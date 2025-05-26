import { Grid } from "@chakra-ui/react";
import HistoryChart from "./HistoryChart";
import Navbar from "@/components/Navbar";

const HistoryPage = () => {
  return (
    <Grid minH={"100vh"} templateRows={"1fr 5fr"} gapY={6}>
      <Navbar />
      <div>
        <HistoryChart />
      </div>
    </Grid>
  );
};

export default HistoryPage;
