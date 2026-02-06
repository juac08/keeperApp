import React from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";

type Props = {
  total: number;
  todo: number;
  inprogress: number;
  done: number;
};

const StatTiles: React.FC<Props> = ({ total, todo, inprogress, done }) => {
  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} gap={3} mt={3}>
      <Box
        bg="linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)"
        _dark={{
          bg: "linear-gradient(180deg, #1b2434 0%, #151c2b 100%)",
          borderColor: "border.muted",
          boxShadow: "0 10px 18px rgba(0, 0, 0, 0.35)",
        }}
        borderRadius="2xl"
        p={3.5}
        border="1px solid"
        borderColor="border.muted"
        boxShadow="0 10px 18px rgba(15, 23, 42, 0.06)"
      >
        <Box
          fontSize="xs"
          color="text.muted"
          fontWeight="700"
          letterSpacing="0.08em"
          _dark={{ color: "text.muted" }}
        >
          TOTAL
        </Box>
        <Box
          fontSize="2xl"
          fontWeight="800"
          mt={1}
          color="text.primary"
          _dark={{ color: "text.primary" }}
        >
          {total}
        </Box>
      </Box>
      <Box
        bg="linear-gradient(180deg, #f0f7ff 0%, #e8f1ff 100%)"
        _dark={{
          bg: "linear-gradient(180deg, #162539 0%, #121c2b 100%)",
          borderColor: "rgba(59, 130, 246, 0.25)",
          boxShadow: "0 10px 18px rgba(15, 23, 42, 0.35)",
        }}
        borderRadius="2xl"
        p={3.5}
        border="1px solid"
        borderColor="blue.100"
        boxShadow="0 10px 18px rgba(37, 99, 235, 0.08)"
      >
        <Box
          fontSize="xs"
          color="blue.600"
          fontWeight="700"
          letterSpacing="0.08em"
          _dark={{ color: "blue.300" }}
        >
          TO DO
        </Box>
        <Box
          fontSize="2xl"
          fontWeight="800"
          color="blue.700"
          mt={1}
          _dark={{ color: "blue.200" }}
        >
          {todo}
        </Box>
      </Box>
      <Box
        bg="linear-gradient(180deg, #f6f0ff 0%, #efe7ff 100%)"
        _dark={{
          bg: "linear-gradient(180deg, #201a33 0%, #171428 100%)",
          borderColor: "rgba(167, 139, 250, 0.25)",
          boxShadow: "0 10px 18px rgba(15, 23, 42, 0.35)",
        }}
        borderRadius="2xl"
        p={3.5}
        border="1px solid"
        borderColor="purple.100"
        boxShadow="0 10px 18px rgba(124, 58, 237, 0.08)"
      >
        <Box
          fontSize="xs"
          color="purple.600"
          fontWeight="700"
          letterSpacing="0.08em"
          _dark={{ color: "purple.300" }}
        >
          IN PROGRESS
        </Box>
        <Box
          fontSize="2xl"
          fontWeight="800"
          color="purple.700"
          mt={1}
          _dark={{ color: "purple.200" }}
        >
          {inprogress}
        </Box>
      </Box>
      <Box
        bg="linear-gradient(180deg, #ecfdf3 0%, #e3f9ee 100%)"
        _dark={{
          bg: "linear-gradient(180deg, #142a24 0%, #0f1f1a 100%)",
          borderColor: "rgba(52, 211, 153, 0.25)",
          boxShadow: "0 10px 18px rgba(15, 23, 42, 0.35)",
        }}
        borderRadius="2xl"
        p={3.5}
        border="1px solid"
        borderColor="green.100"
        boxShadow="0 10px 18px rgba(16, 185, 129, 0.08)"
      >
        <Box
          fontSize="xs"
          color="green.700"
          fontWeight="700"
          letterSpacing="0.08em"
          _dark={{ color: "green.300" }}
        >
          DONE
        </Box>
        <Box
          fontSize="2xl"
          fontWeight="800"
          color="green.700"
          mt={1}
          _dark={{ color: "green.200" }}
        >
          {done}
        </Box>
      </Box>
    </SimpleGrid>
  );
};

export default StatTiles;
