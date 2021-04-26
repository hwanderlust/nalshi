import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Store from "../../context";
import Home from "../home";

const Forecast = React.lazy(() => import("../forecast"));
const Header = React.lazy(() => import("../header"));
const Search = React.lazy(() => import("../search"));

function App() {

  return (
    <Store>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Switch>
            <Route path="/forecast/:location/:period">
              <Forecast />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="*">
              <>
                <Header />
                <h1>404</h1>
                <p>Oops, looks like we messed up! Please try searching for a weather forecast in your location below.</p>
                <Search />
              </>
            </Route>
          </Switch>
        </Router>
      </React.Suspense>
    </Store>
  );
}

export default App;
