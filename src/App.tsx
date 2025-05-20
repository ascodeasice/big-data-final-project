import { Route, Switch } from "wouter";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import { Provider } from "@/components/ui/provider";

const App = () => (
  <Provider forcedTheme="light">
    <Switch>
      <Route path="/">
        <HomePage />
      </Route>
      <Route path="/game">
        <GamePage />
      </Route>
      {/* TODO: others, history */}
      {/* Default route in a switch */}
      <Route>404: No such page!</Route>
    </Switch>
  </Provider>
);

export default App;
