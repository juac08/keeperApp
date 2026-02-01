import React from "react";
import { Badge, Box, HStack, Text } from "@chakra-ui/react";
import type { Card } from "@/types";

type Props = {
  card: Card;
};

const CardMeta: React.FC<Props> = ({ card }) => {
  return (
    <>
      {card.content && (
        <Text fontSize="sm" color="gray.600" mb={3}>
          {card.content}
        </Text>
      )}
      <HStack gap={2} mb={2} flexWrap="wrap">
        <Badge
          colorScheme={
            card.priority === "High"
              ? "red"
              : card.priority === "Medium"
              ? "orange"
              : "blue"
          }
        >
          {card.priority}
        </Badge>
        {card.blocked && <Badge colorScheme="purple">Blocked</Badge>}
      </HStack>
      {card.blocked && card.blockedReason && (
        <Box bg="purple.50" borderRadius="md" p={2} fontSize="xs" color="purple.700">
          {card.blockedReason}
        </Box>
      )}
    </>
  );
};

export default CardMeta;
