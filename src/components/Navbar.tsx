import { Flex, Heading, Box, Button } from "@chakra-ui/react";
import { Link } from "wouter";

const Navbar = () => {
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
      <Box>
        <Link to="/game">
          <Button variant="plain" color="white">
            當日投資
          </Button>
        </Link>

        <Link to="/history">
          <Button variant="plain" color="white">
            投資歷史
          </Button>
        </Link>
        <Link to="/others">
          <Button variant="plain" color="white" disabled>
            其他玩家
          </Button>
        </Link>
      </Box>
    </Flex>
  );
};

export default Navbar;
