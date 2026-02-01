import React from "react";
import { Badge, Box, HStack, Text } from "@chakra-ui/react";
import { FiAlertCircle, FiArrowUp, FiMinus, FiArrowDown } from "react-icons/fi";
import type { Card } from "@/types";

type Props = {
  card: Card;
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "High":
      return FiArrowUp;
    case "Medium":
      return FiMinus;
    case "Low":
      return FiArrowDown;
    default:
      return FiMinus;
  }
};

const CardMeta: React.FC<Props> = ({ card }) => {
  const PriorityIcon = getPriorityIcon(card.priority);

  return (
    <>
      {card.content && (
        <Text
          fontSize="sm"
          color="gray.600"
          mb={3}
          lineHeight="1.6"
          lineClamp={3}
        >
          {card.content}
        </Text>
      )}
      <HStack gap={2} mb={3} flexWrap="wrap">
        <Badge
          colorScheme={
            card.priority === "High"
              ? "red"
              : card.priority === "Medium"
                ? "orange"
                : "blue"
          }
          variant="subtle"
          px={2}
          py={0.5}
          borderRadius="md"
          fontSize="xs"
          fontWeight="600"
          border="1px solid"
          borderColor={
            card.priority === "High"
              ? "red.300"
              : card.priority === "Medium"
                ? "orange.300"
                : "blue.300"
          }
        >
          <HStack gap={1} alignItems="center">
            <Box
              as={PriorityIcon}
              fontSize="11px"
              color={
                card.priority === "High"
                  ? "red.600"
                  : card.priority === "Medium"
                    ? "orange.600"
                    : "blue.600"
              }
            />
            <span>{card.priority}</span>
          </HStack>
        </Badge>
        {card.blocked && (
          <Badge
            colorScheme="purple"
            variant="subtle"
            px={2}
            py={0.5}
            borderRadius="md"
            fontSize="xs"
            fontWeight="600"
          >
            <HStack gap={1}>
              <Box as={FiAlertCircle} fontSize="10px" />
              <span>Blocked</span>
            </HStack>
          </Badge>
        )}
      </HStack>
      {card.blocked && card.blockedReason && (
        <Box
          bg="purple.50"
          borderLeft="3px solid"
          borderColor="purple.400"
          borderRadius="md"
          p={2.5}
          fontSize="xs"
          color="purple.800"
          lineHeight="1.5"
        >
          <Text fontWeight="600" mb={1}>
            Block reason:
          </Text>
          <Text>{card.blockedReason}</Text>
        </Box>
      )}
    </>
  );
};

export default CardMeta;
