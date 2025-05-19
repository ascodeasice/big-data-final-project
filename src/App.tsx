import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Game from "./pages/Game";
import { ChakraProvider, defaultSystem, defineConfig } from "@chakra-ui/react";
import { ThemeProvider } from "@emotion/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {},
    },
  },
});

const App = () => (
  <ChakraProvider value={defaultSystem}>
    <ThemeProvider theme={config}>
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
    </ThemeProvider>
  </ChakraProvider>
);

export default App;
