import "./App.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/login";
import Home from "./components/home";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/dashboard">
          <Home />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}
