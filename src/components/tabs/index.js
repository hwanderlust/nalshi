import React from "react";

import styles from "./tabs.module.css";

function Tabs(props) {
  const { values, activeValue, handleClick } = props;
  return (
    <nav className={styles.nav}>
      {values.map(v => (
        <button
          className={activeValue === v ? styles.active : undefined}
          onClick={() => handleClick(v)}
        >
          {v}
        </button>
      ))}
    </nav>
  );
}

export default Tabs;