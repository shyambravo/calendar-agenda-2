import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Authorization from "./pages/Authorization/Authorization";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/">
              <Authorization />
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
