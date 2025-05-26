import { Flex, Heading, Box, Button } from "@chakra-ui/react";
import type React from "react";
import { Link } from "wouter";

type Props = {
  setTabIndex?: React.Dispatch<React.SetStateAction<number>>;
  hideLinks?: boolean;
};

const Navbar = ({ setTabIndex = () => {}, hideLinks = false }: Props) => {
  return (
    <Flex
      spaceX={12}
      background={"teal"}
      align={"center"}
      justify={"space-between"}
      paddingX={6}
      gridColumn={"1/-1"}
    >
      {/* TODO: maybe icon? */}
      <Link to="/game">
        <Heading color={"white"} size="3xl">
          韭菜傳奇
        </Heading>
      </Link>
      <Box hidden={hideLinks}>
        <Button variant="plain" color="white" onClick={() => setTabIndex(0)}>
          當日投資
        </Button>
        <Button variant="plain" color="white" onClick={() => setTabIndex(1)}>
          投資歷史
        </Button>
        <Button variant="plain" color="white" onClick={() => setTabIndex(2)}>
          其他玩家
        </Button>
      </Box>
    </Flex>
  );
};

export default Navbar;
