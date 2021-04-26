import React from "react";
import { useHistory, useParams } from "react-router-dom";

import { context } from "../../context";
import { apiRequest } from "../../helpers";
import styles from "./search.module.css";

function Search() {
  const history = useHistory();
  const params = useParams();
  const {
    getPlacesService,
    location,
    setLocation,
    setForecastData
  } = React.useContext(context);
  const [inputValue, setInputValue] = React.useState(
    decodeURI(params.location) || location || ""
  );
  const [wasSubmitted, setSubmitted] = React.useState(false);
  const handleSuccess = React.useCallback((results, response) => {
    setForecastData(response.properties.periods);
    setLocation(results[0].name);
    setSubmitted(_ => false);
    history.push(`/forecast/${encodeURI(results[0].name)}/hourly`);
  }, []);
  const handleFailure = React.useCallback(() => {
    setSubmitted(_ => false);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(_ => true);
    apiRequest(getPlacesService, inputValue, handleSuccess, handleFailure);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label
        className={styles.label}
        htmlFor="locationInput">
        Location
      </label>
      <input
        className={styles.input}
        id="locationInput"
        type="text"
        placeholder={`city, state, or zipcode`}
        value={inputValue}
        disabled={wasSubmitted}
        onChange={event => setInputValue(_ => event.target.value)} />
      <button className={styles.button}>
        Search
        </button>
    </form>
  );
}

export default Search;