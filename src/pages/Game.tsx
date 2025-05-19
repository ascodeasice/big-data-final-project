import Navbar from "@/components/Navbar";
import { Grid } from "@chakra-ui/react";

const Game = () => {
  return (
    <Grid minH={"100vh"} templateRows={"1fr 5fr"}>
      <Navbar/>
    </Grid>
  );
};

export default Game;
