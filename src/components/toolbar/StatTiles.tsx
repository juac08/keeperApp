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
    <SimpleGrid columns={{ base: 2, md: 4 }} gap={3} mt={4}>
      <Box
        bg="bg.muted"
        borderRadius="xl"
        p={3}
        border="1px solid"
        borderColor="border.muted"
      >
        <Box fontSize="xs" color="text.muted" fontWeight="600">
          TOTAL
        </Box>
        <Box fontSize="lg" fontWeight="700">
          {total}
        </Box>
      </Box>
      <Box
        bg="blue.50"
        borderRadius="xl"
        p={3}
        border="1px solid"
        borderColor="blue.100"
      >
        <Box fontSize="xs" color="blue.600" fontWeight="600">
          TO DO
        </Box>
        <Box fontSize="lg" fontWeight="700" color="blue.700">
          {todo}
        </Box>
      </Box>
      <Box
        bg="purple.50"
        borderRadius="xl"
        p={3}
        border="1px solid"
        borderColor="purple.100"
      >
        <Box fontSize="xs" color="purple.600" fontWeight="600">
          IN PROGRESS
        </Box>
        <Box fontSize="lg" fontWeight="700" color="purple.700">
          {inprogress}
        </Box>
      </Box>
      <Box
        bg="green.50"
        borderRadius="xl"
        p={3}
        border="1px solid"
        borderColor="green.100"
      >
        <Box fontSize="xs" color="green.600" fontWeight="600">
          DONE
        </Box>
        <Box fontSize="lg" fontWeight="700" color="green.700">
          {done}
        </Box>
      </Box>
    </SimpleGrid>
  );
};

export default StatTiles;
