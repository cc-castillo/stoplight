'use client'

import Stoplight from "@/components/stoplight";
import { Box, Flex } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box minH="100vh" bg="yellow.200" py={8}>
      <Flex direction="column" align="center" justify="center">
        <Stoplight />
      </Flex>
    </Box>
  );
}
