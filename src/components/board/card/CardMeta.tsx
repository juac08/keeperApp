import React from "react";
import { Avatar, Badge, Box, HStack, Text, Wrap } from "@chakra-ui/react";
import {
  FiAlertCircle,
  FiArrowUp,
  FiMinus,
  FiArrowDown,
  FiCalendar,
  FiUser,
  FiCheckSquare,
} from "react-icons/fi";
import type { Card } from "@/types";
import { useTagsStore } from "@/state/TagsStore";
import { useAssigneesStore } from "@/state/AssigneesStore";
import type { DensityMode } from "@/state/DensityStore";

type Props = {
  card: Card;
  density?: DensityMode;
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

const CardMeta: React.FC<Props> = ({ card, density = "comfortable" }) => {
  const PriorityIcon = getPriorityIcon(card.priority);
  const { getTag } = useTagsStore();
  const { getAssignee } = useAssigneesStore();

  const assignee = card.assigneeId ? getAssignee(card.assigneeId) : null;

  // Density-based spacing
  const spacingMap = {
    compact: { mb: 1, mt: 1.5, gap: 1, fontSize: "2xs" },
    comfortable: { mb: 3, mt: 3, gap: 1.5, fontSize: "xs" },
    spacious: { mb: 4, mt: 4, gap: 2, fontSize: "sm" },
  };

  const spacing = spacingMap[density];

  const getDueDateStatus = () => {
    if (!card.dueDate) return null;
    const now = new Date();
    const due = new Date(card.dueDate);
    const diffDays = Math.ceil(
      (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays < 0) return { label: "Overdue", color: "red" };
    if (diffDays === 0) return { label: "Due today", color: "orange" };
    if (diffDays === 1) return { label: "Due tomorrow", color: "yellow" };
    return { label: `Due in ${diffDays} days`, color: "gray" };
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <>
      {card.blocked && card.blockedReason && (
        <Box
          bg="purple.50"
          borderLeft="2px solid"
          borderColor="purple.400"
          borderRadius="sm"
          p={density === "compact" ? 1.5 : 2}
          fontSize={spacing.fontSize}
          color="purple.800"
          mb={spacing.mb}
        >
          <Text fontWeight="600" mb={0.5}>
            🚫 Blocked
          </Text>
          <Text fontSize={spacing.fontSize}>{card.blockedReason}</Text>
        </Box>
      )}

      {card.subtasks && card.subtasks.length > 0 && (
        <HStack
          gap={spacing.gap}
          p={density === "compact" ? 1.5 : 2}
          bg="blue.50"
          borderRadius="sm"
          fontSize={spacing.fontSize}
          mb={spacing.mb}
        >
          <FiCheckSquare color="#3b82f6" />
          <Text color="blue.700" fontWeight="600">
            {card.subtasks.filter((st) => st.completed).length}/
            {card.subtasks.length} subtasks completed
          </Text>
        </HStack>
      )}

      <HStack justify="space-between" align="flex-end" mt={spacing.mt}>
        <HStack gap={spacing.gap} flexWrap="wrap" flex="1">
          {card.tags &&
            card.tags.length > 0 &&
            card.tags.slice(0, 2).map((tagId) => {
              const tag = getTag(tagId);
              if (!tag) return null;
              return (
                <Badge
                  key={tag.id}
                  bg={`${tag.color}.100`}
                  color={`${tag.color}.700`}
                  px={2}
                  py={0.5}
                  borderRadius="sm"
                  fontSize="10px"
                  fontWeight="600"
                >
                  {tag.icon} {tag.label}
                </Badge>
              );
            })}
          {card.tags && card.tags.length > 2 && (
            <Text fontSize="xs" color="text.muted">
              +{card.tags.length - 2}
            </Text>
          )}
          {dueDateStatus && (
            <Badge
              bg={
                dueDateStatus.color === "red"
                  ? "red.50"
                  : dueDateStatus.color === "orange"
                    ? "orange.50"
                    : dueDateStatus.color === "yellow"
                      ? "yellow.50"
                      : "gray.50"
              }
              color={
                dueDateStatus.color === "red"
                  ? "red.700"
                  : dueDateStatus.color === "orange"
                    ? "orange.700"
                    : dueDateStatus.color === "yellow"
                      ? "yellow.700"
                      : "gray.600"
              }
              px={2}
              py={0.5}
              borderRadius="sm"
              fontSize="10px"
              fontWeight="600"
              border="2px solid"
              borderColor={
                dueDateStatus.color === "red"
                  ? "red.200"
                  : dueDateStatus.color === "orange"
                    ? "orange.200"
                    : dueDateStatus.color === "yellow"
                      ? "yellow.200"
                      : "gray.200"
              }
            >
              <FiCalendar style={{ display: "inline", marginRight: "4px" }} />
              {dueDateStatus.label}
            </Badge>
          )}
        </HStack>

        <HStack gap={2} flexShrink={0}>
          <Box
            color={
              card.priority === "High"
                ? "red.500"
                : card.priority === "Medium"
                  ? "orange.500"
                  : "blue.500"
            }
            fontSize="16px"
            title={`Priority: ${card.priority}`}
          >
            <PriorityIcon />
          </Box>
          {assignee && (
            <Box
              w="24px"
              h="24px"
              borderRadius="full"
              bg="blue.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
              fontWeight="600"
              color="blue.700"
              title={assignee.name}
              cursor="pointer"
            >
              {assignee.avatar || assignee.name.charAt(0).toUpperCase()}
            </Box>
          )}
        </HStack>
      </HStack>
    </>
  );
};

export default CardMeta;
