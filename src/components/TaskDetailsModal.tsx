import React from "react";
import {
  Box,
  Dialog,
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

type Props = {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (card: Card) => void;
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
          borderRadius="xl"
          overflow="hidden"
          maxW="700px"
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.15)"
          border="1px solid"
          borderColor="gray.200"
        >
          <Dialog.Header
            bgGradient="linear(to-br, white, gray.50)"
            py={4}
            px={6}
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            <HStack justify="space-between" align="center">
              <Heading size="md" fontWeight="700" color="gray.900">
                {card.title}
              </Heading>
              <Dialog.CloseTrigger asChild>
                <AppIconButton
                  size="sm"
                  aria-label="Close"
                  color="gray.500"
                  borderRadius="md"
                  _hover={{ color: "gray.700", bg: "gray.100" }}
                >
                  <Box as={FiX} fontSize="14px" />
                </AppIconButton>
              </Dialog.CloseTrigger>
            </HStack>
          </Dialog.Header>

          <Dialog.Body bg="white" px={6} py={5}>
            <Stack gap={4}>
              {/* Status and Priority Row */}
              <HStack gap={3} flexWrap="wrap">
                <Badge
                  colorScheme={
                    card.status === "done"
                      ? "green"
                      : card.status === "inprogress"
                        ? "blue"
                        : "gray"
                  }
                  variant="solid"
                  px={3}
                  py={1.5}
                  borderRadius="md"
                  fontSize="xs"
                  fontWeight="700"
                  textTransform="uppercase"
                >
                  {statusLabels[card.status]}
                </Badge>
                <Badge
                  bg={
                    card.priority === "High"
                      ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                      : card.priority === "Medium"
                        ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                        : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                  }
                  color="white"
                  px={3}
                  py={1.5}
                  borderRadius="md"
                  fontSize="xs"
                  fontWeight="700"
                  textTransform="uppercase"
                >
                  <HStack gap={1}>
                    <Box as={PriorityIcon} fontSize="11px" />
                    <span>{card.priority}</span>
                  </HStack>
                </Badge>
                {card.blocked && (
                  <Badge
                    colorScheme="purple"
                    variant="solid"
                    px={3}
                    py={1.5}
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight="700"
                    textTransform="uppercase"
                  >
                    <HStack gap={1}>
                      <Box as={FiAlertCircle} fontSize="11px" />
                      <span>Blocked</span>
                    </HStack>
                  </Badge>
                )}
              </HStack>

              {/* Description */}
              {card.content && (
                <Box>
                  <Text fontSize="xs" fontWeight="700" color="gray.600" mb={2}>
                    DESCRIPTION
                  </Text>
                  <Text fontSize="sm" color="gray.700" lineHeight="1.7">
                    {card.content}
                  </Text>
                </Box>
              )}

              {/* Blocked Reason */}
              {card.blocked && card.blockedReason && (
                <Box
                  bg="purple.50"
                  border="1px solid"
                  borderColor="purple.200"
                  borderRadius="md"
                  p={3}
                >
                  <HStack gap={2} mb={1.5}>
                    <Box
                      as={FiAlertCircle}
                      fontSize="14px"
                      color="purple.600"
                    />
                    <Text fontSize="xs" fontWeight="700" color="purple.900">
                      BLOCK REASON
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="purple.800" lineHeight="1.6">
                    {card.blockedReason}
                  </Text>
                </Box>
              )}

              {/* Tags */}
              {card.tags && card.tags.length > 0 && (
                <Box>
                  <Text fontSize="xs" fontWeight="700" color="gray.600" mb={2}>
                    TAGS
                  </Text>
                  <Wrap gap={2}>
                    {card.tags.map((tagId) => {
                      const tag = getTag(tagId);
                      if (!tag) return null;
                      return (
                        <Badge
                          key={tag.id}
                          colorScheme={tag.color}
                          variant="solid"
                          px={3}
                          py={1.5}
                          borderRadius="md"
                          fontSize="xs"
                          fontWeight="600"
                          display="flex"
                          alignItems="center"
                          gap={1.5}
                        >
                          <span>{tag.icon}</span>
                          <span>{tag.label}</span>
                        </Badge>
                      );
                    })}
                  </Wrap>
                </Box>
              )}

              {/* Footer with metadata */}
              <Box pt={4} mt={2} borderTop="1px solid" borderColor="gray.200">
                <Stack gap={2.5}>
                  {assignee && (
                    <HStack gap={2}>
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        fontWeight="600"
                        minW="80px"
                      >
                        ASSIGNEE
                      </Text>
                      <HStack gap={2}>
                        <Box fontSize="lg">{assignee.avatar || "👤"}</Box>
                        <Text fontSize="sm" fontWeight="600" color="gray.800">
                          {assignee.name}
                        </Text>
                      </HStack>
                    </HStack>
                  )}
                  {card.dueDate && dueDateStatus && (
                    <HStack gap={2}>
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        fontWeight="600"
                        minW="80px"
                      >
                        DUE DATE
                      </Text>
                      <Badge
                        colorScheme={dueDateStatus.color}
                        variant="subtle"
                        px={2.5}
                        py={1}
                        borderRadius="md"
                        fontSize="xs"
                        fontWeight="600"
                      >
                        <HStack gap={1.5}>
                          <Box as={FiCalendar} fontSize="10px" />
                          <span>{dueDateStatus.label}</span>
                        </HStack>
                      </Badge>
                    </HStack>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Dialog.Body>

          <Dialog.Footer
            bgGradient="linear(to-br, gray.50, white)"
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
                icon={<FiEdit2 size={16} />}
              >
                Edit Task
              </AppButton>
            </HStack>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};

export default TaskDetailsModal;
