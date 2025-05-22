import Navbar from "@/components/Navbar";
import { Field } from "@/components/ui/field";
import { formatCurrency } from "@/functions/currency";
import { type Stock, type APIResponse, type Holding } from "@/types/stockTypes";
import {
  Button,
  ButtonGroup,
  Flex,
  Grid,
  Heading,
  InputGroup,
  NativeSelect,
  NumberInput,
  Table,
  Text,
} from "@chakra-ui/react";
import camelcaseKeys from "camelcase-keys";
import { useEffect, useState } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";

type ActionType = "" | "buy" | "sell";

type PortfolioItem = {
  stockId: string;
  count: number; // positive: buying, negative: selling
};

const GamePage = () => {
  const DEFAULT_STOCK_COUNT = 1000;

  const [balance, setBalance] = useState(1_000_000);
  const [action, setAction] = useState<ActionType>("");
  const [bgGradient, setBgGradient] = useState<[string, string]>(["", ""]); // gradient from, to
  const [day] = useState<number>(1);
  const [stockCount, setStockCount] = useState<number>(DEFAULT_STOCK_COUNT);
  const [selectedStockId, setSelectedStockId] = useState<string>("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

  const selectedStock = stocks.find((s) => s.id.toString() == selectedStockId);
  const selectedStockPrice =
    Math.round((selectedStock?.price ?? 0) * 100) / 100; // only takes two digits
  const stockCost = isNaN(stockCount) ? 0 : stockCount * selectedStockPrice;

  // TODO: consider all portfolioToday
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
        setHoldings(
          myHistory.holdings.sort((a, b) =>
            a.stockName.localeCompare(b.stockName),
          ),
        );
      }
      // TODO: update history of other players

      // SECTION: stocks related info
      setStocks(data.stocks.sort((a, b) => a.name.localeCompare(b.name)));

      // init portfolio
      setPortfolio(
        data.stocks.map((s) => ({
          stockId: s.id.toString(),
          count: 0,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setSelectedStockId("");
    setAction("");
    setStockCount(DEFAULT_STOCK_COUNT);
  };

  const addToPortfolio = () => {
    // SECTION: validation
    if (!stocks.find((s) => s.id.toString() == selectedStockId)) {
      toaster.create({
        title: "請選擇商品",
        type: "warning",
      });
      return;
    }

    if (action == "") {
      toaster.create({
        title: "請選擇買或賣",
        type: "warning",
      });
      return;
    }

    if (stockCount == 0) {
      toaster.create({
        title: "請輸入股數",
        type: "warning",
      });
      return;
    }

    // TODO: other validations like can't sell over owned count (maybe in select?)

    setPortfolio((prev) =>
      prev.map((item) => {
        let newCount = item.count;
        if (item.stockId == selectedStockId) {
          switch (action) {
            case "buy":
              newCount += stockCount;
              break;
            case "sell":
              newCount -= stockCount;
              break;
            default:
              console.warn("Invalid action");
              break;
          }
        }
        return {
          ...item,
          count: newCount,
        };
      }),
    );
    resetForm();
  };

  const getPortfolioText = (stockId: string) => {
    const item = portfolio.find((item) => item.stockId == stockId);
    if (!item) {
      console.warn(`portfolio item not found for id ${stockId}`);
      return "";
    }

    const { count } = item;
    if (count == 0) {
      return "";
    } else if (count > 0) {
      return ` + ${count}`;
    } else {
      // keep the spaces standardized
      return ` - ${Math.abs(count)}`;
    }
  };

  useEffect(() => {
    fetchGameStatus();
  }, []);

  // change gradient according to action change
  useEffect(() => {
    if (action == "buy") {
      setBgGradient(["white", "green.500"]);
    } else if (action == "sell") {
      setBgGradient(["white", "red.500"]);
    } else {
      setBgGradient(["", ""]);
    }
  }, [action]);

  return (
    <>
      <Grid
        minH={"100vh"}
        templateRows={"1fr 5fr"}
        templateColumns={"2fr 1fr"}
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
                onClick={() => setAction("buy")}
              >
                買
              </Button>
              <Button
                colorPalette={"red"}
                disabled={action == "sell"}
                onClick={() => setAction("sell")}
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
              <Button colorPalette={"teal"} onClick={addToPortfolio}>
                加入投資組合
              </Button>
              <Button
                colorPalette={"gray"}
                variant={"surface"}
                onClick={resetForm}
              >
                重設
              </Button>
            </ButtonGroup>
          </Flex>
        </Flex>
        <Flex direction={"column"}>
          <Heading>持有股票</Heading>
          {/* TODO: extract */}
          <Table.Root interactive stickyHeader variant={"outline"}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>名稱</Table.ColumnHeader>
                <Table.ColumnHeader>股數</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {holdings.map((h) => (
                <Table.Row key={h.stockId}>
                  <Table.Cell>{h.stockName}</Table.Cell>
                  <Table.Cell>
                    {h.count}
                    {getPortfolioText(h.stockId.toString())}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Flex>
      </Grid>
      <Toaster />
    </>
  );
};

export default GamePage;
