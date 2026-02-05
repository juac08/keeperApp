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
    <SimpleGrid columns={{ base: 2, md: 4 }} gap={4} mt={4}>
      <Box
        bg="linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)"
        borderRadius="2xl"
        p={4}
        border="1px solid"
        borderColor="border.muted"
        boxShadow="0 12px 24px rgba(15, 23, 42, 0.05)"
      >
        <Box fontSize="xs" color="text.muted" fontWeight="700" letterSpacing="0.08em">
          TOTAL
        </Box>
        <Box fontSize="2xl" fontWeight="800" mt={1}>
          {total}
        </Box>
      </Box>
      <Box
        bg="linear-gradient(180deg, #f0f7ff 0%, #e8f1ff 100%)"
        borderRadius="2xl"
        p={4}
        border="1px solid"
        borderColor="blue.100"
        boxShadow="0 12px 24px rgba(37, 99, 235, 0.08)"
      >
        <Box fontSize="xs" color="blue.600" fontWeight="700" letterSpacing="0.08em">
          TO DO
        </Box>
        <Box fontSize="2xl" fontWeight="800" color="blue.700" mt={1}>
          {todo}
        </Box>
      </Box>
      <Box
        bg="linear-gradient(180deg, #f6f0ff 0%, #efe7ff 100%)"
        borderRadius="2xl"
        p={4}
        border="1px solid"
        borderColor="purple.100"
        boxShadow="0 12px 24px rgba(124, 58, 237, 0.08)"
      >
        <Box fontSize="xs" color="purple.600" fontWeight="700" letterSpacing="0.08em">
          IN PROGRESS
        </Box>
        <Box fontSize="2xl" fontWeight="800" color="purple.700" mt={1}>
          {inprogress}
        </Box>
      </Box>
      <Box
        bg="linear-gradient(180deg, #ecfdf3 0%, #e3f9ee 100%)"
        borderRadius="2xl"
        p={4}
        border="1px solid"
        borderColor="green.100"
        boxShadow="0 12px 24px rgba(16, 185, 129, 0.08)"
      >
        <Box fontSize="xs" color="green.700" fontWeight="700" letterSpacing="0.08em">
          DONE
        </Box>
        <Box fontSize="2xl" fontWeight="800" color="green.700" mt={1}>
          {done}
        </Box>
      </Box>
    </SimpleGrid>
  );
};

export default StatTiles;
