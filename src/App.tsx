import React from "react";
import { HashRouter } from "react-router-dom";
import { Switch, Route } from "react-router";
import "./App.css";
import Home from "./Home";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
