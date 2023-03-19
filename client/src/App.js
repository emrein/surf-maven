import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home, About, Edit, Monitor } from "./components/pages";
import { Navbar } from "./components/Navbar";
import "./style.css";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/home" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/edit" component={Edit} />
        <Route path="/monitor" component={Monitor} />
      </Switch>
    </Router>
  );
}
