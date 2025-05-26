import Navbar from "@/components/Navbar";
import { Field } from "@/components/ui/field";
import { formatCurrency } from "@/functions/currency";
import {
  type Stock,
  type APIResponse,
  type Holding,
  type PortfolioItem,
} from "@/types/stockTypes";
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
import { useCallback, useEffect, useState } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useHistory, type HistoryStore } from "@/stores/historyStore";
import { useLocation } from "wouter";
import HoldingList from "./HoldingList";

type ActionType = "" | "buy" | "sell";

const GamePage = () => {
  const DEFAULT_STOCK_COUNT = 1000;

  const [balance, setBalance] = useState(1_000_000);
  const [action, setAction] = useState<ActionType>("");
  const [bgGradient, setBgGradient] = useState<[string, string]>(["", ""]); // gradient from, to
  const [day, setDay] = useState<number>(1);
  const [stockCount, setStockCount] = useState<number>(DEFAULT_STOCK_COUNT);
  const [selectedStockId, setSelectedStockId] = useState<string>("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const { pushHistories } = useHistory();

  const [, navigate] = useLocation();

  const selectedStock = stocks.find((s) => s.id.toString() == selectedStockId);
  const selectedStockPrice =
    Math.round((selectedStock?.price ?? 0) * 100) / 100; // only takes two digits
  const stockCost = isNaN(stockCount) ? 0 : stockCount * selectedStockPrice;

  const holdingsWorth = holdings.reduce((worth: number, h: Holding) => {
    const stock = stocks.find((s) => h.stockId == s.id);
    if (!stock) {
      console.warn(`holdings in stock not found: ${h.stockId}`);
    }
    return worth + h.count * (stock?.price ?? 0);
  }, 0);

  const getMaxStockCount = (): number => {
    const DEFAULT_MAX_STOCK_COUNT = 1_000_000;
    if (action != "sell" && action != "buy") {
      return DEFAULT_MAX_STOCK_COUNT;
    }

    if (action == "buy") {
      if (selectedStockPrice == 0) {
        return DEFAULT_MAX_STOCK_COUNT;
      }
      return Math.floor(getNewBalance() / selectedStockPrice);
    }
    const portItem = portfolio.find((item) => item.stockId == selectedStockId);
    const holding = holdings.find(
      (item) => item.stockId.toString() == selectedStockId,
    );

    if (portItem || holding) {
      return (portItem?.count ?? 0) + (holding?.count ?? 0);
    }

    return DEFAULT_MAX_STOCK_COUNT;
  };

  const getDefaultPortfolio = (stocks: Stock[]): PortfolioItem[] => {
    return stocks.map((s) => ({
      stockId: s.id.toString(),
      count: 0,
    }));
  };

  const getNewBalance = () => {
    // from portfolio
    let newBalance = balance;
    portfolio.forEach((p) => {
      const stockPrice = stocks.find(
        (s) => s.id.toString() == p.stockId,
      )?.price;
      if (!stockPrice) {
        console.warn(`price of stock ${p.stockId} not found`);
        return;
      }
      // because selling (negative count) result in adding money
      newBalance -= p.count * stockPrice;
    });

    return newBalance;
  };

  const getBalanceAfterAction = () => {
    const newBalance = getNewBalance();
    switch (action) {
      case "":
        return newBalance;
      case "buy":
        return newBalance - stockCost;
      case "sell":
        return newBalance + stockCost;
    }
  };

  const updateStates = (data: APIResponse) => {
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

    const newHistories: HistoryStore[] = data.histories.map((h) => {
      const stockValue = h.holdings.reduce((acc, ho) => {
        const stock = data.stocks.find((s) => s.id == ho.stockId);
        return acc + (stock?.price ?? 0) * ho.count;
      }, 0);

      return {
        ...h,
        stockValue,
      };
    });
    pushHistories(newHistories);

    // SECTION: stocks related info
    const sortedStocks = data.stocks.sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    setStocks(sortedStocks);

    // init portfolio
    setPortfolio(getDefaultPortfolio(sortedStocks));
  };

  const fetchGameStatus = useCallback(async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/start`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch histories");
      }
      // deep must be used for userName inside histories
      const data: APIResponse = camelcaseKeys(await res.json(), { deep: true });
      updateStates(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const resetPortfolio = () => {
    setSelectedStockId("");
    setAction("");
    setStockCount(DEFAULT_STOCK_COUNT);
    setPortfolio(getDefaultPortfolio(stocks));
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

    if (action == "buy" && selectedStockPrice * stockCount > getNewBalance()) {
      toaster.create({
        title: "餘額不足",
        type: "warning",
      });
      return;
    }

    const portItem = portfolio.find((item) => item.stockId == selectedStockId);
    const holding = holdings.find(
      (h) => h.stockId.toString() == selectedStockId,
    );
    const ownedStockCount = (portItem?.count ?? 0) + (holding?.count ?? 0);
    if (action == "sell" && stockCount > ownedStockCount) {
      toaster.create({
        title: "持有的股票不足",
        type: "warning",
      });
      return;
    }
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
        setAction("");
        return {
          ...item,
          count: newCount,
        };
      }),
    );
  };

  const advanceDay = async () => {
    const newDay = day + 1;
    if (newDay == 31) {
      navigate("/result");
      return;
    }
    setDay(newDay);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/advance/${newDay}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stocks: portfolio.map((p) => ({
              id: Number(p.stockId),
              count: p.count,
            })),
          }),
        },
      );
      // deep must be used for userName inside histories
      const data: APIResponse = camelcaseKeys(await res.json(), { deep: true });
      updateStates(data);
    } catch (error) {
      console.error(error);
    }
  };

  // fetch game status when day changed
  useEffect(() => {
    fetchGameStatus();
  }, [fetchGameStatus]);

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
            <Heading>第 {day} 天</Heading>
            <Heading>現金餘額：{formatCurrency(balance)}</Heading>
            <Heading>股票估值：{formatCurrency(holdingsWorth)}</Heading>
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
              <NumberInput.Root
                value={stockCount.toString()}
                onValueChange={(e) =>
                  setStockCount(isNaN(e.valueAsNumber) ? 0 : e.valueAsNumber)
                }
                min={1}
                max={getMaxStockCount()}
              >
                <InputGroup endAddon="股">
                  <NumberInput.Input />
                </InputGroup>
              </NumberInput.Root>
              <Text whiteSpace={"nowrap"}>
                {" × "}
                {formatCurrency(selectedStockPrice)}
                {" = "}
                {formatCurrency(stockCost)}
              </Text>
            </Flex>
            <Text>投資組合餘額：{formatCurrency(getNewBalance())}</Text>
            <Text>
              新增操作後餘額：{formatCurrency(getBalanceAfterAction())}
            </Text>
            <ButtonGroup>
              <Button colorPalette={"teal"} onClick={addToPortfolio}>
                加入投資組合
              </Button>
              <Button
                colorPalette={"gray"}
                variant={"surface"}
                onClick={resetPortfolio}
              >
                重置投資組合
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <Button
                colorPalette={"green"}
                variant={"subtle"}
                onClick={advanceDay}
              >
                {day == 30 ? "查看結果" : "進入下一天"}
              </Button>
            </ButtonGroup>
          </Flex>
        </Flex>
        <HoldingList holdings={holdings} portfolio={portfolio} />
      </Grid>
      <Toaster />
    </>
  );
};

export default GamePage;
