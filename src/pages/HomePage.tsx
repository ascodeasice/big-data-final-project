import { Button, Center, Heading, Stack } from "@chakra-ui/react";
import { Link } from "wouter";

const HomePage = () => {
  // TODO: add more decoration
  return (
    <Center minH="100vh">
      <Stack spaceY={6} align={"center"}>
        <Heading size="6xl">韭菜傳奇</Heading>
        <Link to="/game">
          <Button colorPalette={"teal"}>開始遊戲</Button>
        </Link>
      </Stack>
    </Center>
  );
};

export default HomePage;
