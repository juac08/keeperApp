import React from "react";
import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import type { Column } from "@/types";
import { TagPill } from "@/ui";

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
            _dark={{ boxShadow: "0 0 0 4px rgba(15, 23, 42, 0.7)" }}
          />
          <Heading size="sm" fontWeight="700" color="text.primary">
            {column.title}
          </Heading>
        </HStack>
        <Text fontSize="sm" color="text.secondary" mt={1}>
          {column.hint}
        </Text>
      </Box>
      <TagPill color="text.secondary">
        {count}
      </TagPill>
    </HStack>
  );
};

export default ColumnHeader;
