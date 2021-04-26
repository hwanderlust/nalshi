import { format, getHours, isToday } from "date-fns";
import React from "react";
import { useHistory, useParams } from "react-router-dom";

import { context } from "../../context";
import { apiRequest, capitalize } from "../../helpers";
import Header from "../header";
import Search from "../search";
import Tabs from "../tabs";
import styles from "./forecast.module.css";

const DEGREE = "\u00B0";
const TABS = ["Hourly", "Daily"];

function Forecast() {
  const params = useParams();
  const history = useHistory();
  const {
    forecastData,
    getPlacesService,
    location,
    setForecastData,
    setLocation
  } = React.useContext(context);
  const [waitingForAPIResponse, toggleWaiting] = React.useState(false);
  const [forecastType, setForecastType] = React.useState(
    capitalize(params.period) || TABS[0]
  );

  React.useEffect(() => {
    if (!forecastData.length && location) {
      toggleWaiting(_ => true);
      apiRequest(getPlacesService, location, (_, response) => {
        setForecastData(response.properties.periods);
        toggleWaiting(_ => false);
      });
    }
    if (!forecastData.length && !location && params.location) {
      toggleWaiting(_ => true);
      apiRequest(getPlacesService, params.location, (_, response) => {
        setForecastData(response.properties.periods);
        setLocation(params.location);
        toggleWaiting(_ => false);
      });
    }
    if (location.localeCompare(params.location) !== 0) {
      toggleWaiting(_ => true);
      apiRequest(getPlacesService, params.location, (_, response) => {
        setForecastData(response.properties.periods);
        setLocation(params.location);
        toggleWaiting(_ => false);
      });
    }
  }, []);

  let highOfTheDay = 0;
  let lowOfTheDay = 0;
  forecastData.forEach(hourlyData => {
    if (isToday(new Date(hourlyData.endTime))) {
      if (hourlyData.temperature > highOfTheDay) {
        highOfTheDay = hourlyData.temperature;
      }
      if (hourlyData.temperature < lowOfTheDay || (lowOfTheDay === 0 && hourlyData.temperature !== 0)) {
        lowOfTheDay = hourlyData.temperature;
      }
    }
  });

  const handleTabClick = React.useCallback(selectedTab => {
    if (selectedTab.localeCompare(TABS[0]) !== 0 && selectedTab.localeCompare(TABS[1]) !== 0) {
      console.warn("something went wrong");
      return;
    }
    toggleWaiting(_ => true);
    setForecastType(prev => {
      if (prev.localeCompare(selectedTab) === 0) {
        return prev;
      }
      apiRequest(getPlacesService, params.location, (_, response) => {
        setForecastData(response.properties.periods);
        setLocation(params.location);
        toggleWaiting(_ => false);
      }, () => { }, selectedTab);
      return selectedTab;
    });
    history.push(`/forecast/${encodeURI(location)}/${selectedTab}`);
  });
  const handleSaveFavorite = React.useCallback(() => {
    if (!!window.localStorage.getItem("favorites")) {
      const favorites = JSON.parse(window.localStorage.getItem("favorites"));
      if (!favorites.includes(params.location)) {
        window.localStorage.setItem("favorites", JSON.stringify([...favorites, params.location]));
      }
      return;
    }
    window.localStorage.setItem("favorites", JSON.stringify([params.location]));
  }, [params.location]);
  const isLocationSaved = () => {
    const favorites = JSON.parse(window.localStorage.getItem("favorites"));
    if (!favorites.length) {
      return false;
    }
    return favorites.includes(params.location);
  }

  return (
    <>
      <Header />
      <Search />
      {waitingForAPIResponse ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.center}>
          <section className={`${styles.center} ${styles.saveBtn}`}>
            <button
              disabled={isLocationSaved()}
              onClick={handleSaveFavorite}>
              Save Location
            </button>
          </section>
          <main>
            <Tabs
              values={TABS}
              activeValue={forecastType}
              handleClick={handleTabClick}
            />
            {forecastType.localeCompare(TABS[0]) === 0 && forecastData.length ? (
              <section className={styles.today}>
                <h1>
                  As of {format(new Date(forecastData[0].startTime), "h:mma")} it is currently
                </h1>
                <span className={styles.now}>
                  {forecastData[0].temperature}{DEGREE}F
                  </span>

                <div className={styles.highLow}>
                  <h2>It'll reach the following temperatures today</h2>
                  <span>High:</span> {highOfTheDay}{DEGREE}F
                  <span>Low:</span> {lowOfTheDay}{DEGREE}F
                </div>
              </section>
            ) : null}
            <Table
              data={
                forecastData
              }
              forecastType={forecastType} />
          </main>
        </div>
      )}
    </>
  );
}

function Table(props) {
  const { data, forecastType } = props;

  if (!data.length) {
    return null;
  }

  // 24 hours in a day - current hour digit in 24hr + the current hour
  const todaysRemainingHours = 24 - getHours(new Date(data[0]?.endTime)) + 1;
  const limitedData = forecastType === TABS[0] ? data.slice(0, todaysRemainingHours) : data.slice(0, 2 * (7 + 1));

  return (
    <section>
      {limitedData.map(periodData => (
        <TableItem
          time={forecastType.localeCompare(TABS[0]) === 0 ? format(new Date(periodData.startTime), "ha") : periodData.name}
          temp={periodData.temperature}
          icon={periodData.icon}
          desc={periodData.shortForecast}
          windSpeed={periodData.windSpeed}
          windDirection={periodData.windDirection}
          key={`${periodData.number} ${forecastType === TABS[0] ? format(new Date(periodData.startTime), "h:mm") : periodData.name}`}
          forecastType={forecastType}
        />
      ))}
    </section>
  );
}

function TableItem(props) {
  const { time, temp, icon, desc, windSpeed, windDirection, forecastType } = props;
  return (
    <div className={`${styles.tableItem} ${forecastType === TABS[0] ? styles.hourlyTableItem : styles.dayTableItem}`}>
      <span>{time}</span>
      <span>{temp}{DEGREE}F</span>
      <div className={styles.tableItemDetails}>
        <img src={icon} alt={desc} />
        <span>{desc}</span>
      </div>
      <div>
        <span>Wind:</span> {windSpeed} {windDirection}
      </div>
    </div>
  );
}

export default Forecast;