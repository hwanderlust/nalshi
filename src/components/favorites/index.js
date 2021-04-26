import React from "react";
import { Link } from "react-router-dom";

import styles from "./favorites.module.css";

function Favorites() {
  const storedLocations = JSON.parse(window.localStorage.getItem("favorites"));
  return (
    <section className={styles.favorites}>
      <ul className={styles.list}>
        {storedLocations?.length
          ? storedLocations.map(location => (
            <FavoritedLocation key={location} location={location} />
          ))
          : null}
      </ul>
    </section>
  );
}

function FavoritedLocation(props) {
  const { location } = props;
  return (
    <li className={styles.listItem}>
      <Link to={`/forecast/${encodeURI(location)}/hourly`}>
        {location}
      </Link>
    </li>
  );
}

export default Favorites;