import { formatCurrency } from "@/functions/currency";
import { useHistory } from "@/stores/historyStore";
import { Table } from "@chakra-ui/react";
import { v4 } from "uuid";

type Props = {
  gridColumn?: string;
};

const LeaderboardPage = ({ gridColumn = "1/-1" }: Props) => {
  const { histories } = useHistory();

  const historiesLastDay = histories[histories.length - 1];
  const PLAYER_USERNAME = "player";
  return (
    <Table.ScrollArea
      borderWidth="1px"
      rounded="md"
      height="75vh"
      gridColumn={gridColumn}
      width={"50%"}
      justifySelf={"center"}
    >
      <Table.Root interactive stickyHeader>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>排名</Table.ColumnHeader>
            <Table.ColumnHeader>玩家名</Table.ColumnHeader>
            <Table.ColumnHeader>總資產</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            // sort with total assets
            historiesLastDay
              .sort((a, b) => b.stockValue + b.cash - a.stockValue - a.cash)
              .map((h, i) => (
                <Table.Row
                  key={v4()}
                  background={h.userName == PLAYER_USERNAME ? "teal.200" : ""}
                >
                  <Table.Cell>{i + 1}</Table.Cell>
                  <Table.Cell>
                    {h.userName == PLAYER_USERNAME ? "玩家" : h.userName}
                  </Table.Cell>
                  <Table.Cell>
                    {formatCurrency(h.stockValue + h.cash)}
                  </Table.Cell>
                </Table.Row>
              ))
          }
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
};

export default LeaderboardPage;
