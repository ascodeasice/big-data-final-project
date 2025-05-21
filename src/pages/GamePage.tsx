import Navbar from "@/components/Navbar";
import { Field } from "@/components/ui/field";
import { formatCurrency } from "@/functions/currency";
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
import { useState } from "react";

type ActionType = "" | "buy" | "sell";

const GamePage = () => {
  const [balance] = useState(1_000_000);
  const [action, setAction] = useState<ActionType>("");
  const [bgGradient, setBgGradient] = useState<[string, string]>(["", ""]); // gradient from, to
  const [day] = useState<number>(1);
  const [stockCount, setStockCount] = useState<number>(10);
  const [selectedStockPrice] = useState<number>(1000);

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
              <NativeSelect.Field>
                {/* TODO: use real options */}
                <option value="1">2330 台積電</option>
                <option value="2">2454 聯發科</option>
                <option value="3">2317 鴻海（富士康）</option>
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
