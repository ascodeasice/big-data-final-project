import { Flex, Heading, Table } from "@chakra-ui/react";
import type { Holding, PortfolioItem } from "@/types/stockTypes";

type Params = {
  holdings: Holding[];
  portfolio: PortfolioItem[];
};

const HoldingList = ({ holdings, portfolio }: Params) => {
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
  return (
    <Flex direction={"column"}>
      <Heading>持有股票</Heading>
      <Table.ScrollArea borderWidth="1px" rounded="md" height="75vh">
        {/* changing the variant somehow makes the stickyHeader not working */}
        <Table.Root interactive stickyHeader>
          <Table.Header>
            <Table.Row bg='bg.subtle'>
              <Table.ColumnHeader>名稱</Table.ColumnHeader>
              <Table.ColumnHeader>股數</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {/* TODO: sorting according to portfolio, holding, name */}
            {/* use portfolio.map.sort instead */}
            {holdings.map((h) => (
              <Table.Row key={h.stockId}>
                <Table.Cell>{h.stockName}</Table.Cell>
                <Table.Cell>
                  {h.count}
                  {/* TODO: getHoldingText */}
                  {getPortfolioText(h.stockId.toString())}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Flex>
  );
};

export default HoldingList;
