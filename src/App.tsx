import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Game from "./pages/Game";
import { Provider } from "@/components/ui/provider";

const App = () => (
  <Provider>
    <Switch>
      <Route path="/">
        <Home />
      </Route>
      <Route path="/game">
        <Game />
      </Route>
      {/* TODO: others, history */}
      {/* Default route in a switch */}
      <Route>404: No such page!</Route>
    </Switch>
  </Provider>
);

export default App;
