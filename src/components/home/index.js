import React from "react";

import Favorites from "../favorites";
import Header from "../header";
import Search from "../search";

function Home() {

  return (
    <div>
      <Header />
      <Search />
      <Favorites />
    </div>
  );
}

export default Home;
