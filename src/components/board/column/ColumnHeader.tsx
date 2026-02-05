import React from "react";
import { Badge, Box, Heading, HStack, Text } from "@chakra-ui/react";
import type { Column } from "@/types";

type Props = {
  column: Column;
  count: number;
};

const ColumnHeader: React.FC<Props> = ({ column, count }) => {
  const dotColor =
    column.id === "todo"
      ? "blue.500"
      : column.id === "inprogress"
        ? "purple.500"
        : "green.500";

  return (
    <HStack align="flex-start" justify="space-between" mb={4}>
      <Box>
        <HStack gap={2}>
          <Box
            w="10px"
            h="10px"
            borderRadius="full"
            bg={dotColor}
            boxShadow="0 0 0 4px rgba(255, 255, 255, 0.6)"
          />
          <Heading size="sm" fontWeight="700">
            {column.title}
          </Heading>
        </HStack>
        <Text fontSize="sm" color="text.muted" mt={1}>
          {column.hint}
        </Text>
      </Box>
      <Badge
        borderRadius="full"
        px={2.5}
        py={1}
        fontSize="xs"
        bg="bg.muted"
        color="text.secondary"
      >
        {count}
      </Badge>
    </HStack>
  );
};

export default ColumnHeader;
