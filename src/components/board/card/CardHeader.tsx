import React from "react";
import { Heading, HStack, Box } from "@chakra-ui/react";
import { FiEdit2, FiTrash2, FiArchive, FiMoreVertical } from "react-icons/fi";
import type { Card } from "@/types";
import { AppIconButton, TooltipWrap } from "@/ui";

type Props = {
  card: Card;
  onEdit: (card: Card) => void;
  onRemove: (id: string) => void;
  onArchive?: (id: string) => void;
};

const CardHeader: React.FC<Props> = ({ card, onEdit, onRemove, onArchive }) => {
  const showArchive = onArchive && card.status === "done";

  return (
    <HStack align="flex-start" justify="space-between" mb={3} gap={2}>
      <HStack gap={2} align="flex-start" flex="1">
        <Box
          color="text.muted"
          mt="2px"
          opacity={{ base: 1, md: 0.4 }}
          _groupHover={{ opacity: 1 }}
        >
          <FiMoreVertical size={14} />
        </Box>
        <Heading
          size="sm"
          fontWeight="700"
          color="text.primary"
          lineHeight="1.4"
          flex="1"
          lineClamp={2}
          _hover={{ color: "blue.600" }}
        >
          {card.title}
        </Heading>
      </HStack>
      <HStack
        gap={0.5}
        flexShrink={0}
        transition="opacity 0.2s"
        mt="-4px"
        opacity={1}
      >
        <TooltipWrap label="Edit task">
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
        </TooltipWrap>
        <TooltipWrap label="Delete task">
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
        </TooltipWrap>
        {showArchive && (
          <TooltipWrap label="Archive task">
            <AppIconButton
              size="xs"
              aria-label="Archive task"
              onClick={(e) => {
                e.stopPropagation();
                onArchive(card.id);
              }}
              color="text.muted"
              _hover={{ color: "green.600", bg: "green.50" }}
            >
              <Box as={FiArchive} fontSize="13px" />
            </AppIconButton>
          </TooltipWrap>
        )}
      </HStack>
    </HStack>
  );
};

export default CardHeader;
