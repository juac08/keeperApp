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
  FiEdit2,
  FiCalendar,
  FiAlertCircle,
  FiArrowUp,
  FiMinus,
  FiArrowDown,
  FiBookmark,
  FiCheck,
  FiCircle,
  FiLayers,
  FiStar,
  FiActivity,
  FiFileText,
  FiMessageCircle,
  FiCheckSquare,
  FiSquare,
} from "react-icons/fi";
import type { Card } from "@/types";
import { AppButton, AvatarCircle } from "@/ui";
import { useTagsStore } from "@/state/TagsStore";
import { getTagMeta } from "@/utils/tagHelpers";
import { useAssigneesStore } from "@/state/AssigneesStore";
import { CommentSection } from "@/components/comments";
import { ActivityTimeline } from "@/components/activity";

type Props = {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (card: Card) => void;
  onAddComment: (cardId: string, text: string) => void | Promise<void>;
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

  const renderTagGlyph = (glyph: string) => {
    switch (glyph) {
      case "bookmark":
        return <FiBookmark size={12} />;
      case "check":
        return <FiCheck size={12} />;
      case "circle":
        return <FiCircle size={12} strokeWidth={3} />;
      case "sparkle":
        return <FiStar size={12} />;
      case "diamond":
        return <FiLayers size={12} />;
      case "flask":
        return <FiActivity size={12} />;
      case "document":
        return <FiFileText size={12} />;
      case "comment":
        return <FiMessageCircle size={12} />;
      default:
        return <Box w="6px" h="6px" borderRadius="full" bg="white" />;
    }
  };

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
          borderRadius="2xl"
          overflow="hidden"
          maxW="980px"
          maxH="90vh"
          boxShadow="0 24px 60px rgba(15, 23, 42, 0.18)"
          bg="bg.panel"
        >
          <Dialog.Header
            bg="bg.panel"
            py={5}
            px={{ base: 6, md: 8 }}
            borderBottom="1px solid"
            borderColor="border.muted"
          >
            <HStack justify="space-between" align="center">
              <HStack gap={3} align="center">
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="14px"
                  bg="linear-gradient(135deg, #0ea5e9 0%, #22c55e 100%)"
                  color="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 10px 20px rgba(14, 165, 233, 0.25)"
                >
                  <FiFileText size={18} />
                </Box>
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    color="text.muted"
                    textTransform="uppercase"
                    letterSpacing="0.12em"
                  >
                    Task
                  </Text>
                  <Text fontSize="lg" fontWeight="700" color="text.primary">
                    Task details
                  </Text>
                </Box>
              </HStack>
              <HStack gap={3}>
                <Badge
                  colorScheme={
                    card.status === "done"
                      ? "green"
                      : card.status === "inprogress"
                        ? "blue"
                        : "gray"
                  }
                  px={2.5}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="700"
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
                  <Text fontSize="xs" fontWeight="700">
                    {card.priority}
                  </Text>
                </HStack>
                <Dialog.CloseTrigger
                  borderRadius="full"
                  w="40px"
                  h="40px"
                  color="text.muted"
                  _hover={{ bg: "bg.muted" }}
                />
              </HStack>
            </HStack>
          </Dialog.Header>

          <Dialog.Body
            bg="bg.panel"
            px={{ base: 6, md: 8 }}
            py={6}
            overflowY="auto"
          >
            <Stack gap={6}>
              {/* Title */}
              <Heading
                size="lg"
                fontWeight="600"
                color="text.primary"
                lineHeight="1.3"
              >
                {card.title}
              </Heading>

              {/* Description */}
              {card.content && (
                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="text.muted"
                    mb={2}
                  >
                    DESCRIPTION
                  </Text>
                  <Text
                    fontSize="sm"
                    color="text.secondary"
                    lineHeight="1.6"
                    whiteSpace="pre-wrap"
                  >
                    {card.content}
                  </Text>
                </Box>
              )}

              {/* Blocked */}
              {card.blocked && (
                <Box
                  bg="red.50"
                  border="2px solid"
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
                    {card.blockedReason || "No reason provided"}
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
                      color="text.muted"
                      mb={2}
                    >
                      ASSIGNEE
                    </Text>
                    <HStack gap={2}>
                      <AvatarCircle
                        name={assignee.name}
                        avatar={assignee.avatar}
                        seed={assignee.id}
                        size="28px"
                        fontSize="xs"
                      />
                      <Text fontSize="sm" fontWeight="500" color="text.primary">
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
                      color="text.muted"
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
                  <Text
                    fontSize="xs"
                    fontWeight="600"
                    color="text.muted"
                    mb={2}
                  >
                    TAGS
                  </Text>
                  <Wrap gap={2}>
                    {card.tags.map((tagId) => {
                      const tag = getTag(tagId);
                      if (!tag) return null;
                      const meta = getTagMeta(tag);
                      return (
                        <Badge
                          key={tag.id}
                          bg={meta.background}
                          color={meta.color}
                          px={3}
                          py={1.5}
                          borderRadius="md"
                          fontSize="xs"
                          fontWeight="600"
                          border="1px solid"
                          borderColor={meta.borderColor}
                          textTransform="uppercase"
                          letterSpacing="0.04em"
                          display="flex"
                          alignItems="center"
                          gap={2}
                        >
                          <Box
                            w="18px"
                            h="18px"
                            borderRadius="sm"
                            bg={meta.swatch}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            color="white"
                          >
                            {renderTagGlyph(meta.glyph)}
                          </Box>
                          <span>{meta.label}</span>
                        </Badge>
                      );
                    })}
                  </Wrap>
                </Box>
              )}

              {/* Subtasks */}
              {card.subtasks && card.subtasks.length > 0 && (
                <Box pt={4} borderTop="1px solid" borderColor="border.muted">
                  <HStack mb={3} justify="space-between">
                    <HStack gap={2} align="center">
                      <Box as={FiCheckSquare} fontSize="16px" color="gray.600" />
                      <Text fontSize="sm" fontWeight="700" color="text.primary">
                        Subtasks
                      </Text>
                      <Badge
                        px={2}
                        py={0.5}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="700"
                        bg="blue.50"
                        color="blue.700"
                      >
                        {card.subtasks.filter((st) => st.completed).length}/
                        {card.subtasks.length}
                      </Badge>
                    </HStack>
                  </HStack>

                  <Box
                    borderRadius="xl"
                    border="1px solid"
                    borderColor="border.muted"
                    bg="bg.panel"
                    overflow="hidden"
                  >
                    <Stack gap={0}>
                      {card.subtasks.map((subtask, index) => (
                        <HStack
                          key={subtask.id}
                          py={2.5}
                          px={3}
                          gap={3}
                          align="center"
                          bg="bg.panel"
                          borderTop={index === 0 ? "none" : "1px solid"}
                          borderColor="border.muted"
                          _hover={{ bg: "bg.muted" }}
                        >
                          <Box
                            color={subtask.completed ? "gray.500" : "gray.400"}
                            fontSize="14px"
                            flexShrink={0}
                          >
                            {subtask.completed ? (
                              <FiCheckSquare />
                            ) : (
                              <FiSquare />
                            )}
                          </Box>
                          <Text
                            fontSize="sm"
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
                </Box>
              )}

              {/* Comments */}
              <Box pt={4} borderTop="1px solid" borderColor="border.muted">
                <CommentSection
                  comments={card.comments || []}
                  onAddComment={(text) => onAddComment(card.id, text)}
                />
              </Box>

              {/* Activity */}
              <Box pt={4} borderTop="1px solid" borderColor="border.muted">
                <Text fontSize="xs" fontWeight="600" color="text.muted" mb={3}>
                  ACTIVITY
                </Text>
                <ActivityTimeline activities={card.activities || []} />
              </Box>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer
            bg="bg.panel"
            py={4}
            px={6}
            borderTop="1px solid"
            borderColor="border.muted"
          >
            <HStack justify="flex-end" w="100%">
              <AppButton
                variantStyle="ghost"
                size="md"
                onClick={() => {
                  onClose();
                }}
              >
                Cancel
              </AppButton>
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
