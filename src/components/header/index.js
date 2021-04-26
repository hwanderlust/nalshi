import React from "react";
import { Link } from "react-router-dom";

import styles from "./header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <Link to="/">
        <h1>NALSHI</h1>
      </Link>
    </header>
  );
}

export default Header;