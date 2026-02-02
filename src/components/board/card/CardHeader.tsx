import React from "react";
import { Heading, HStack, Box } from "@chakra-ui/react";
import { FiEdit2, FiTrash2, FiArchive } from "react-icons/fi";
import type { Card } from "@/types";
import { AppIconButton } from "@/ui";

type Props = {
  card: Card;
  onEdit: (card: Card) => void;
  onRemove: (id: string) => void;
  onArchive?: (id: string) => void;
};

const CardHeader: React.FC<Props> = ({ card, onEdit, onRemove, onArchive }) => {
  const showArchive = onArchive && card.status === "done";

  return (
    <HStack align="flex-start" justify="space-between" mb={2} gap={2}>
      <Heading
        size="sm"
        fontWeight="600"
        color="text.primary"
        lineHeight="1.4"
        flex="1"
        lineClamp={2}
        _hover={{ color: "blue.600" }}
      >
        {card.title}
      </Heading>
      <HStack gap={0.5} flexShrink={0} transition="opacity 0.2s" mt="-4px">
        <AppIconButton
          size="xs"
          aria-label="Edit task"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(card);
          }}
          color="text.muted"
          _hover={{ color: "blue.600", bg: "blue.50" }}
        >
          <Box as={FiEdit2} fontSize="13px" />
        </AppIconButton>
        <AppIconButton
          size="xs"
          aria-label="Remove task"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(card.id);
          }}
          color="text.muted"
          _hover={{ color: "red.600", bg: "red.50" }}
        >
          <Box as={FiTrash2} fontSize="13px" />
        </AppIconButton>
        {showArchive && (
          <AppIconButton
            size="xs"
            aria-label="Archive task"
            onClick={(e) => {
              e.stopPropagation();
              onArchive(card.id);
            }}
            color="gray.500"
            _hover={{ color: "green.600", bg: "green.50" }}
          >
            <Box as={FiArchive} fontSize="13px" />
          </AppIconButton>
        )}
      </HStack>
    </HStack>
  );
};

export default CardHeader;
