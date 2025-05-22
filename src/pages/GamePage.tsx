import Navbar from "@/components/Navbar";
import { Field } from "@/components/ui/field";
import { formatCurrency } from "@/functions/currency";
import { type Stock, type APIResponse } from "@/types/stockTypes";
import {
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Heading,
  InputGroup,
  NativeSelect,
  NumberInput,
  Text,
} from "@chakra-ui/react";
import camelcaseKeys from "camelcase-keys";
import { useEffect, useState } from "react";

type ActionType = "" | "buy" | "sell";

const GamePage = () => {
  const [balance, setBalance] = useState(1_000_000);
  const [action, setAction] = useState<ActionType>("");
  const [bgGradient, setBgGradient] = useState<[string, string]>(["", ""]); // gradient from, to
  const [day] = useState<number>(1);
  const [stockCount, setStockCount] = useState<number>(10);
  const [selectedStockId, setSelectedStockId] = useState<string>("");
  const [stocks, setStocks] = useState<Stock[]>([]);

  const selectedStock = stocks.find((s) => s.id.toString() == selectedStockId);
  const selectedStockPrice =
    Math.round((selectedStock?.price ?? 0) * 100) / 100; // only takes two digits
  const stockCost = isNaN(stockCount) ? 0 : stockCount * selectedStockPrice;

  const onClickActionButton = (newAction: ActionType) => {
    setAction(newAction);

    if (newAction == "buy") {
      setBgGradient(["white", "green.500"]);
    } else if (newAction == "sell") {
      setBgGradient(["white", "red.500"]);
    } else {
      console.error("Invalid newAction");
    }
  };

  const getNewBalance = () => {
    switch (action) {
      case "":
        return balance;
      case "buy":
        return balance - stockCost;
      case "sell":
        return balance + stockCost;
      default:
        console.warn("Invalid action");
        return balance;
    }
  };

  const fetchGameStatus = async () => {
    // TODO: separate the case of start and advance since advance requires other parameters
    const url = `${import.meta.env.VITE_BACKEND_URL}/${day == 1 ? "start" : `/advance/day`}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch histories");
      }
      // deep must be used for userName inside histories
      const data: APIResponse = camelcaseKeys(await res.json(), { deep: true });

      // update history status
      const myHistory = data.histories.find((h) => h.userName == "player");
      if (!myHistory) {
        console.warn("My history not found");
      } else {
        setBalance(myHistory.cash);
        // TODO: set holdings
      }
      // TODO: update history of other players

      setStocks(data.stocks);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGameStatus();
  }, []);

  return (
    <Grid
      minH={"100vh"}
      templateRows={"1fr 5fr"}
      gapY={6}
      bgGradient={"to-br"}
      gradientFrom={bgGradient[0]}
      gradientTo={bgGradient[1]}
    >
      <Navbar />
      <Flex paddingX={6} gap={6} direction={"column"}>
        <Flex gap={6}>
          {/* TODO: update day count */}
          <Heading>第 {day} 天</Heading>
          <Heading>現金餘額：{formatCurrency(balance)}</Heading>
          {/* TODO: calculate the worth of stocks */}
          <Heading>股票估值：{formatCurrency(0)}</Heading>
        </Flex>
        <Flex direction="column" width={"fit-content"} gap={6}>
          <Field label="商品">
            <NativeSelect.Root>
              <NativeSelect.Field
                value={selectedStockId}
                onChange={(e) => setSelectedStockId(e.target.value)}
              >
                <option value="">請選擇商品</option>
                {stocks.map((s) => (
                  <option key={s.id} value={s.id.toString()}>
                    {s.name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field>
          <ButtonGroup size="lg" attached>
            <Button
              colorPalette={"green"}
              disabled={action == "buy"}
              onClick={() => onClickActionButton("buy")}
            >
              買
            </Button>
            <Button
              colorPalette={"red"}
              disabled={action == "sell"}
              onClick={() => onClickActionButton("sell")}
            >
              賣
            </Button>
          </ButtonGroup>
          <Flex align={"center"} gap={3}>
            {/* TODO: set max to stock owning when selling */}
            <NumberInput.Root
              value={stockCount.toString()}
              onValueChange={(e) =>
                setStockCount(isNaN(e.valueAsNumber) ? 0 : e.valueAsNumber)
              }
              min={0}
            >
              <InputGroup endAddon="股">
                <NumberInput.Input />
              </InputGroup>
            </NumberInput.Root>
            {/* TODO: use price of the selected stock */}
            <Text whiteSpace={"nowrap"}>
              {" × "}
              {formatCurrency(selectedStockPrice)}
              {" = "}
              {formatCurrency(stockCost)}
            </Text>
          </Flex>
          {/* TODO: use add when selling */}
          <Text>新餘額：{formatCurrency(getNewBalance())}</Text>
          <ButtonGroup>
            {/* TODO: button features */}
            <Button colorPalette={"teal"}>加入投資組合</Button>
            <Button colorPalette={"gray"} variant={"surface"}>
              重設
            </Button>
          </ButtonGroup>
        </Flex>
      </Flex>
    </Grid>
  );
};

export default GamePage;
