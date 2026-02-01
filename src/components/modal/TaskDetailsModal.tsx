import React from "react";
import {
  Box,
  Dialog,
  Grid,
  Heading,
  HStack,
  Stack,
  Text,
  Badge,
  Wrap,
} from "@chakra-ui/react";
import {
  FiX,
  FiEdit2,
  FiCalendar,
  FiAlertCircle,
  FiArrowUp,
  FiMinus,
  FiArrowDown,
} from "react-icons/fi";
import type { Card } from "@/types";
import { AppButton, AppIconButton } from "@/ui";
import { useTagsStore } from "@/state/TagsStore";
import { useAssigneesStore } from "@/state/AssigneesStore";
import { CommentSection } from "@/components/comments";
import { ActivityTimeline } from "@/components/activity";

type Props = {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (card: Card) => void;
  onAddComment: (cardId: string, text: string) => void;
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

const TaskDetailsModal: React.FC<Props> = ({
  card,
  isOpen,
  onClose,
  onEdit,
  onAddComment,
}) => {
  const { getTag } = useTagsStore();
  const { getAssignee } = useAssigneesStore();

  if (!card) return null;

  const PriorityIcon = getPriorityIcon(card.priority);
  const assignee = card.assigneeId ? getAssignee(card.assigneeId) : null;

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

  const statusLabels = {
    todo: "To Do",
    inprogress: "In Progress",
    done: "Done",
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details) => !details.open && onClose()}
    >
      <Dialog.Backdrop bg="blackAlpha.600" backdropFilter="blur(8px)" />
      <Dialog.Positioner>
        <Dialog.Content
          borderRadius="lg"
          overflow="hidden"
          maxW="800px"
          maxH="90vh"
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.15)"
          bg="white"
        >
          <Dialog.Header
            bg="white"
            py={4}
            px={6}
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            <HStack justify="space-between">
              <HStack gap={3}>
                <Badge
                  colorScheme={
                    card.status === "done"
                      ? "green"
                      : card.status === "inprogress"
                        ? "blue"
                        : "gray"
                  }
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="xs"
                  fontWeight="600"
                >
                  {statusLabels[card.status]}
                </Badge>
                <HStack
                  gap={1.5}
                  color={
                    card.priority === "High"
                      ? "red.500"
                      : card.priority === "Medium"
                        ? "orange.500"
                        : "blue.500"
                  }
                >
                  <Box as={PriorityIcon} fontSize="14px" />
                  <Text fontSize="xs" fontWeight="600">
                    {card.priority}
                  </Text>
                </HStack>
              </HStack>
              <Dialog.CloseTrigger
                borderRadius="md"
                _hover={{ bg: "gray.100" }}
              />
            </HStack>
          </Dialog.Header>

          <Dialog.Body bg="white" px={6} py={6} overflowY="auto">
            <Stack gap={6}>
              {/* Title */}
              <Heading
                size="lg"
                fontWeight="600"
                color="gray.900"
                lineHeight="1.3"
              >
                {card.title}
              </Heading>

              {/* Description */}
              {card.content && (
                <Box>
                  <Text fontSize="xs" fontWeight="600" color="gray.500" mb={2}>
                    DESCRIPTION
                  </Text>
                  <Text
                    fontSize="sm"
                    color="gray.700"
                    lineHeight="1.6"
                    whiteSpace="pre-wrap"
                  >
                    {card.content}
                  </Text>
                </Box>
              )}

              {/* Blocked */}
              {card.blocked && card.blockedReason && (
                <Box
                  bg="red.50"
                  border="1px solid"
                  borderColor="red.200"
                  borderRadius="md"
                  p={3}
                >
                  <HStack gap={2} mb={1}>
                    <Box as={FiAlertCircle} color="red.500" />
                    <Text fontSize="xs" fontWeight="700" color="red.700">
                      BLOCKED
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="red.700">
                    {card.blockedReason}
                  </Text>
                </Box>
              )}

              {/* Metadata Grid */}
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {assignee && (
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.500"
                      mb={2}
                    >
                      ASSIGNEE
                    </Text>
                    <HStack gap={2}>
                      <Box
                        w="28px"
                        h="28px"
                        borderRadius="full"
                        bg="blue.100"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="xs"
                        fontWeight="600"
                        color="blue.700"
                      >
                        {assignee.avatar ||
                          assignee.name.charAt(0).toUpperCase()}
                      </Box>
                      <Text fontSize="sm" fontWeight="500" color="gray.700">
                        {assignee.name}
                      </Text>
                    </HStack>
                  </Box>
                )}

                {card.dueDate && dueDateStatus && (
                  <Box>
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color="gray.500"
                      mb={2}
                    >
                      DUE DATE
                    </Text>
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
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="600"
                    >
                      <HStack gap={1}>
                        <Box as={FiCalendar} fontSize="10px" />
                        <span>{dueDateStatus.label}</span>
                      </HStack>
                    </Badge>
                  </Box>
                )}
              </Grid>

              {/* Tags */}
              {card.tags && card.tags.length > 0 && (
                <Box>
                  <Text fontSize="xs" fontWeight="600" color="gray.500" mb={2}>
                    TAGS
                  </Text>
                  <Wrap gap={2}>
                    {card.tags.map((tagId) => {
                      const tag = getTag(tagId);
                      if (!tag) return null;
                      return (
                        <Badge
                          key={tag.id}
                          bg={`${tag.color}.100`}
                          color={`${tag.color}.700`}
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontSize="xs"
                          fontWeight="600"
                        >
                          {tag.icon} {tag.label}
                        </Badge>
                      );
                    })}
                  </Wrap>
                </Box>
              )}

              {/* Subtasks */}
              {card.subtasks && card.subtasks.length > 0 && (
                <Box pt={4} borderTop="1px solid" borderColor="gray.200">
                  <HStack justify="space-between" mb={3}>
                    <Text fontSize="xs" fontWeight="600" color="gray.500">
                      SUBTASKS
                    </Text>
                    <Text fontSize="xs" color="gray.500" fontWeight="500">
                      {card.subtasks.filter((st) => st.completed).length}/
                      {card.subtasks.length}
                    </Text>
                  </HStack>
                  <Stack gap={1}>
                    {card.subtasks.map((subtask) => (
                      <HStack key={subtask.id} py={1} fontSize="sm">
                        <Text
                          color={subtask.completed ? "green.500" : "gray.400"}
                          fontWeight="600"
                        >
                          {subtask.completed ? "✓" : "○"}
                        </Text>
                        <Text
                          color={subtask.completed ? "gray.500" : "gray.700"}
                          textDecoration={
                            subtask.completed ? "line-through" : "none"
                          }
                        >
                          {subtask.text}
                        </Text>
                      </HStack>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Comments */}
              <Box pt={4} borderTop="1px solid" borderColor="gray.200">
                <CommentSection
                  comments={card.comments || []}
                  onAddComment={(text) => onAddComment(card.id, text)}
                />
              </Box>

              {/* Activity */}
              <Box pt={4} borderTop="1px solid" borderColor="gray.200">
                <Text fontSize="xs" fontWeight="600" color="gray.500" mb={3}>
                  ACTIVITY
                </Text>
                <ActivityTimeline activities={card.activities || []} />
              </Box>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer
            bg="gray.50"
            py={4}
            px={6}
            borderTop="1px solid"
            borderColor="gray.200"
          >
            <HStack justify="flex-end" w="100%">
              <AppButton
                variantStyle="primary"
                size="md"
                onClick={() => {
                  onEdit(card);
                  onClose();
                }}
                icon={<FiEdit2 size={14} />}
              >
                Edit
              </AppButton>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default TaskDetailsModal;
