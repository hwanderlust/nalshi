const BASE_URL = "https://api.weather.gov/points";
const weekForecastUrl = (latitude, longitude) => `${BASE_URL}/${latitude},${longitude}/forecast`;
const hourlyForecastUrl = (latitude, longitude) => `${weekForecastUrl(latitude, longitude)}/hourly`;
const noOp = () => { };

function apiRequest(getPlacesService, query, handleSuccess, handleFailure = noOp, type = "hourly") {
  const request = {
    query,
    fields: ["name", "geometry"],
  }
  if (global.google) {
    getPlacesService().findPlaceFromQuery(request, function (results, status) {
      if (status === global.google.maps.places.PlacesServiceStatus.OK) {
        const latitude = results[0]?.geometry.location.lat();
        const longitude = results[0]?.geometry.location.lng();
        fetch(type === "hourly" ? hourlyForecastUrl(latitude, longitude) : weekForecastUrl(latitude, longitude))
          .then(r => r.json())
          .then(response => {
            if (!response?.properties?.periods?.length) {
              alert(`${query} couldn't be found. Please try again. Be sure to include the entire zipcode, or the city and state.`);
              console.error("Something went wrong with the API request/response", response);
              return;
            }
            handleSuccess(results, response);
          })
          .catch(err => {
            console.error("Something went wrong with the API request", err);
            handleFailure();
          });
      }
    });
  }
}

function capitalize(str, type = "word") {
  if (type.localeCompare("word") !== 0 && type.localeCompare("sentence") !== 0) {
    console.warn(`capitalize() doesn't support ${type}`);
    return;
  }
  if (type.localeCompare("sentence") == 0) {
    const arr = str.split(" ");
    const mappedStr = arr.reduce((acc, word) =>
      acc.concat(
        `${acc.length === 0 ? "" : " "}${capitalize(word)}`
      )
      , "");
    return mappedStr;
  }
  const firstLetter = str.slice(0, 1);
  const remainingWord = str.slice(1);
  return firstLetter.toUpperCase().concat(remainingWord.toLowerCase());
}

export {
  apiRequest,
  capitalize,
};