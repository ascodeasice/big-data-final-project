import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Game from "./pages/Game";

const App = () => (
  <>
    <Switch>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/game">
        <Game />
      </Route>
      {/* Default route in a switch */}
      <Route>404: No such page!</Route>
    </Switch>
  </>
);

export default App;
