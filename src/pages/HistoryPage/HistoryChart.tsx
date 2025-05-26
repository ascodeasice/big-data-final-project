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

type ChartData = {
  day: number;
  股票估值: number;
  現金餘額: number;
  總資產: number;
};

// TODO: use real data
const data: ChartData[] = Array.from({ length: 30 }, (_, i) => {
  const stockValue = Math.random() * 1000000;
  const cash = Math.random() * 1000000;

  return {
    day: i + 1,
    股票估值: stockValue,
    現金餘額: cash,
    總資產: stockValue + cash,
  };
});

function linearRegression(data: ChartData[], key: keyof ChartData) {
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
  const dataWithAverage = linearRegression(data, "總資產");
  return (
    <ResponsiveContainer width="100%" height="100%">
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
