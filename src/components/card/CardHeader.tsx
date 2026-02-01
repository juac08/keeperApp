import React from "react";
import { Heading, HStack } from "@chakra-ui/react";
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
      <HStack align="center" justify="space-between" mb={2}>
        <Heading size="sm">{card.title}</Heading>
      <HStack gap={2}>
        <AppIconButton size="sm" aria-label="Edit task" onClick={() => onEdit(card)}>
          <FiEdit2 />
        </AppIconButton>
        <AppIconButton size="sm" aria-label="Remove task" onClick={() => onRemove(card.id)}>
          <FiTrash2 />
        </AppIconButton>
      </HStack>
      </HStack>
  );
};

export default CardHeader;
