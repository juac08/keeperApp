import React from "react";
import { Badge, Box, HStack, Text } from "@chakra-ui/react";
import { FiArrowUp, FiMinus, FiArrowDown, FiCalendar } from "react-icons/fi";
import type { Card } from "@/types";
import { useTagsStore } from "@/state/TagsStore";
import { getTagMeta } from "@/utils/tagHelpers";
import { useAssigneesStore } from "@/state/AssigneesStore";
import type { DensityMode } from "@/state/DensityStore";
import { AvatarCircle } from "@/ui";

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

  const tagEntries = (card.tags ?? [])
    .map((tagId) => {
      const tag = getTag(tagId);
      if (!tag) return null;
      return { id: tag.id, meta: getTagMeta(tag) };
    })
    .filter(
      (entry): entry is { id: string; meta: ReturnType<typeof getTagMeta> } =>
        entry !== null,
    );

  const visibleTags = tagEntries.slice(0, 2);
  const hiddenTagCount = Math.max(tagEntries.length - visibleTags.length, 0);

  const dueDateBadge = dueDateStatus ? (
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
          ? "red.600"
          : dueDateStatus.color === "orange"
            ? "orange.600"
            : dueDateStatus.color === "yellow"
              ? "yellow.700"
              : "gray.600"
      }
      px={2}
      py={0.5}
      borderRadius="sm"
      fontSize="11px"
      fontWeight="500"
      border="none"
    >
      <FiCalendar
        style={{ display: "inline", marginRight: "4px", fontSize: "10px" }}
      />
      {dueDateStatus.label}
    </Badge>
  ) : null;

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

      <HStack justify="space-between" align="flex-end" mt={spacing.mt}>
        <HStack gap={spacing.gap} flexWrap="wrap" flex="1" align="center">
          {visibleTags.map(({ id, meta }) => (
            <Badge
              key={id}
              bg={meta.background}
              color={meta.color}
              px={2}
              py={0.5}
              borderRadius="sm"
              fontSize="11px"
              fontWeight="500"
              border="none"
              letterSpacing="normal"
              textTransform="none"
            >
              {meta.label}
            </Badge>
          ))}
          {hiddenTagCount > 0 && (
            <Text fontSize="11px" color="text.muted" fontWeight="500">
              +{hiddenTagCount}
            </Text>
          )}
          {dueDateBadge}
        </HStack>
        <HStack gap={4} flexShrink={0} align="center" pr={1}>
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
            <Box title={assignee.name} cursor="pointer">
              <AvatarCircle
                name={assignee.name}
                avatar={assignee.avatar}
                seed={assignee.id}
                size="24px"
                fontSize="xs"
              />
            </Box>
          )}
        </HStack>
      </HStack>
    </>
  );
};

export default CardMeta;
