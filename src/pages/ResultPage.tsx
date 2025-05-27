import { Button, Flex, Grid, Heading } from "@chakra-ui/react";
import HistoryChart from "./HistoryPage/HistoryChart";
import Navbar from "@/components/Navbar";
import { useLocation } from "wouter";
import { useHistory } from "@/stores/historyStore";
import { useStock } from "@/stores/stockStore";
import LeaderboardPage from "./LeaderboardPage/LeaderboardPage";

const ResultPage = () => {
  const [, navigate] = useLocation();
  const { clearHistories } = useHistory();
  const { clearStocks } = useStock();

  const restartGame = () => {
    clearHistories();
    clearStocks();
    navigate("/");
  };

  return (
    <Grid
      h={"100vh"}
      w={"100vw"}
      gridTemplateRows={"1fr 5fr"}
      gridTemplateColumns={"1fr 1fr"}
      gap={6}
    >
      <Navbar hideLinks={true} />
      <LeaderboardPage gridColumn="1/1"/>
      <Flex direction={"column"} align={"center"} gap={6}>
        <Heading size={"2xl"}>遊戲結果</Heading>
        <HistoryChart />
        <Button colorPalette={"teal"} onClick={restartGame}>
          重新開始
        </Button>
      </Flex>
    </Grid>
  );
};

export default ResultPage;
