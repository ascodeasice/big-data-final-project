import { Box } from "@chakra-ui/react";
import HistoryChart from "./HistoryChart";

const HistoryPage = () => {
  return (
    <Box gridColumn={"1/-1"}>
      <HistoryChart />
    </Box>
  );
};

export default HistoryPage;
