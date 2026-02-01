import React from "react";
import { Heading, HStack, Box } from "@chakra-ui/react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import type { Card } from "@/types";
import { AppIconButton } from "@/ui";

type Props = {
  card: Card;
  onEdit: (card: Card) => void;
  onRemove: (id: string) => void;
};

const CardHeader: React.FC<Props> = ({ card, onEdit, onRemove }) => {
  return (
    <HStack align="center" justify="space-between" mb={3} gap={2}>
      <Heading
        size="sm"
        fontWeight="600"
        color="gray.900"
        lineHeight="1.4"
        flex="1"
      >
        {card.title}
      </Heading>
      <HStack gap={0.5} flexShrink={0}>
        <AppIconButton
          size="sm"
          aria-label="Edit task"
          onClick={() => onEdit(card)}
          color="gray.500"
          _hover={{ color: "blue.500", bg: "blue.50" }}
        >
          <Box as={FiEdit2} fontSize="14px" />
        </AppIconButton>
        <AppIconButton
          size="sm"
          aria-label="Remove task"
          onClick={() => onRemove(card.id)}
          color="gray.500"
          _hover={{ color: "red.500", bg: "red.50" }}
        >
          <Box as={FiTrash2} fontSize="14px" />
        </AppIconButton>
      </HStack>
    </HStack>
  );
};

export default CardHeader;
