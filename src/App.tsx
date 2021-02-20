import React from "react";
import { HashRouter } from "react-router-dom";
import { Switch, Route } from "react-router";
import "./App.css";
import CompanySponsorTable from "./CompanySponsorTable";
import CompanyDetail from "./CompanyDetail";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Switch>
          <Route path="/company/:id">
            <CompanyDetail />
          </Route>
          <Route path="/company">
            <CompanySponsorTable />
          </Route>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
