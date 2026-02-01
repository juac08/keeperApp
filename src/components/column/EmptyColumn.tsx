import React from "react";
import { Box, Text } from "@chakra-ui/react";

const EmptyColumn: React.FC = () => {
  return (
    <Box
      border="1px dashed"
      borderColor="gray.300"
      borderRadius="xl"
      p={6}
      textAlign="center"
      color="gray.500"
      bg="white"
    >
      <Text fontWeight="600">Drop cards here</Text>
      <Text fontSize="sm">No notes yet.</Text>
    </Box>
  );
};

export default EmptyColumn;
