import React from "react";
import { Badge, Box, HStack, Stack, Text } from "@chakra-ui/react";
import {
  FiClock,
  FiCheckCircle,
  FiMessageSquare,
  FiMove,
  FiPlus,
} from "react-icons/fi";
import type { Activity } from "@/types";
import { useAssigneesStore } from "@/state/AssigneesStore";

type Props = {
  activities: Activity[];
};

const ActivityTimeline: React.FC<Props> = ({ activities }) => {
  const { getAssignee } = useAssigneesStore();

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "created":
        return FiPlus;
      case "updated":
        return FiClock;
      case "moved":
        return FiMove;
      case "commented":
        return FiMessageSquare;
      case "completed_subtask":
        return FiCheckCircle;
      default:
        return FiClock;
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "created":
        return "green";
      case "updated":
        return "blue";
      case "moved":
        return "purple";
      case "commented":
        return "orange";
      case "completed_subtask":
        return "teal";
      default:
        return "gray";
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case "created":
        return "created this task";
      case "updated":
        return "updated the task";
      case "moved":
        return `moved to ${activity.metadata?.status || "unknown"}`;
      case "commented":
        return "added a comment";
      case "completed_subtask":
        return "completed a subtask";
      default:
        return "performed an action";
    }
  };

  const getAuthor = (activity: Activity) => {
    const authorId = activity.userId || activity.authorId;
    const author = authorId ? getAssignee(authorId) : null;
    return author?.name || "Someone";
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return "Unknown time";

    const date = new Date(timestamp);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();

    // Handle negative or zero differences (timestamps in the future or exact same time)
    if (diffMs <= 0) {
      return "Just now";
    }

    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffSecs < 10) return "Just now";
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (activities.length === 0) {
    return (
      <Box
        p={4}
        textAlign="center"
        borderRadius="md"
        bg="bg.muted"
        border="1px dashed"
        borderColor="border.muted"
      >
        <Text fontSize="sm" color="text.muted">
          No activity yet
        </Text>
      </Box>
    );
  }

  console.log(activities);

  return (
    <Stack gap={3} position="relative">
      {activities.map((activity, index) => {
        const Icon = getActivityIcon(activity.type);
        const color = getActivityColor(activity.type);
        const isLast = index === activities.length - 1;
        const authorName = getAuthor(activity);

        return (
          <HStack key={activity.id} align="flex-start" gap={3}>
            <Box position="relative">
              <Box
                w="32px"
                h="32px"
                borderRadius="full"
                bg={`${color}.100`}
                border="2px solid"
                borderColor={`${color}.400`}
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={`${color}.600`}
                zIndex={1}
              >
                <Icon size={14} />
              </Box>
              {!isLast && (
                <Box
                  position="absolute"
                  left="15px"
                  top="32px"
                  w="2px"
                  h="calc(100% + 12px)"
                  bg="border.muted"
                />
              )}
            </Box>
            <Box flex="1" pt={0.5}>
              <HStack gap={1.5} flexWrap="wrap" align="center">
                <Badge
                  fontSize="xs"
                  px={2}
                  py={0.5}
                  borderRadius="md"
                  colorScheme="blue"
                  variant="subtle"
                >
                  {authorName}
                </Badge>
                <Text fontSize="sm" color="text.secondary" display="inline">
                  {getActivityText(activity)}
                </Text>
              </HStack>
              <Text fontSize="xs" color="text.muted" mt={1}>
                {formatTimestamp(
                  activity.createdAt || activity.timestamp || "",
                )}
              </Text>
            </Box>
          </HStack>
        );
      })}
    </Stack>
  );
};

export default ActivityTimeline;
