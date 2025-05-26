import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";

import { useHistory } from "@/stores/historyStore";

type RawChartData = {
  day: number;
  股票估值: number;
  現金餘額: number;
  總資產: number;
};

type ChartData = RawChartData & {
  平均總資產: number;
};

// chat gpt generated
function linearRegression(
  data: RawChartData[],
  key: keyof RawChartData,
): ChartData[] {
  const n = data.length;
  const sumX = data.reduce((acc, _, i) => acc + i, 0);
  const sumY = data.reduce((acc, d) => acc + d[key], 0);
  const sumXY = data.reduce((acc, d, i) => acc + i * d[key], 0);
  const sumX2 = data.reduce((acc, _, i) => acc + i * i, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return data.map((d, i) => ({
    ...d,
    平均總資產: slope * i + intercept,
  }));
}

const HistoryChart = () => {
  const { histories } = useHistory();
  const myHistories = histories.map((hList) => {
    const myHistory = hList.find((h) => h.userName == "player");
    if (!myHistory) {
      throw new Error(`player history not found`);
    }
    return myHistory;
  });
  const chartData = myHistories.map((h) => ({
    day: h.day,
    總資產: h.cash + h.stockValue,
    股票估值: h.stockValue,
    現金餘額: h.cash,
  }));

  const dataWithAverage = linearRegression(chartData, "總資產");

  return (
    <ResponsiveContainer width="100%" height="70%">
      <LineChart
        width={500}
        height={300}
        data={dataWithAverage}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={"day"}>
          <Label value="天數" offset={0} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label value="$" offset={0} position="bottom" />
        </YAxis>
        <Tooltip />
        <Legend />
        <Line
          type="linear"
          dataKey="現金餘額"
          stroke="#82ca9d"
          activeDot={{ r: 8 }}
        />
        <Line type="linear" dataKey="股票估值" stroke="#8884d8" />
        <Line type="linear" dataKey="總資產" stroke="#000000" />
        <Line
          type="linear"
          dataKey="平均總資產"
          stroke="#000000"
          strokeDasharray="5 5"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HistoryChart;
