import React from "react";
import { Badge, Box, Heading, HStack, Text } from "@chakra-ui/react";
import type { Column } from "@/types";

type Props = {
  column: Column;
  count: number;
};

const ColumnHeader: React.FC<Props> = ({ column, count }) => {
  return (
    <HStack align="flex-start" justify="space-between" mb={4}>
      <Box>
        <HStack gap={2}>
          <Box
            w="10px"
            h="10px"
            borderRadius="full"
            bg={
              column.id === "todo"
                ? "blue.400"
                : column.id === "inprogress"
                ? "purple.400"
                : "green.400"
            }
          />
          <Heading size="sm">{column.title}</Heading>
        </HStack>
        <Text fontSize="sm" color="gray.500" mt={1}>
          {column.hint}
        </Text>
      </Box>
      <Badge borderRadius="full" px={2}>
        {count}
      </Badge>
    </HStack>
  );
};

export default ColumnHeader;
