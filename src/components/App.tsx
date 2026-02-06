import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  HStack,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import { useBoard } from "@/state/BoardContext";
import { useCardFilters } from "@/hooks/useCardFilters";
import { useArchiveStore } from "@/state/ArchiveStore";
import type { Card, Priority, Status, TaskForm, Subtask } from "@/types";
import { COLUMNS } from "@/config";
import { BoardView } from "@/components/board";
import AppToaster, { appToaster } from "@/shared";
import {
  useGetBoardsQuery,
  useGetMeQuery,
  useGetTagsQuery,
  useGetBoardMembersQuery,
  useArchiveTaskMutation,
  useCreateTagMutation,
  useCreateSubtaskMutation,
  useUpdateSubtaskMutation,
  useDeleteSubtaskMutation,
  useCreateCommentMutation,
  useGetTaskQuery,
  useDeleteBoardMutation,
} from "@/store";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setActiveBoard } from "@/store";
import type { CardTemplate } from "@/config/cardTemplates";
import { LoginForm } from "@/components/auth";
import { useTagsStore } from "@/state/TagsStore";
import { useAssigneesStore } from "@/state/AssigneesStore";
import { CORE_TAG_PRESETS } from "@/utils/tagHelpers";
import {
  AppIconButton,
  ContentContainer,
  PageShell,
  Panel,
  SkeletonCard,
} from "@/ui";

const TaskModal = React.lazy(() => import("@/components/modal/TaskModal"));
const TaskDetailsModal = React.lazy(
  () => import("@/components/modal/TaskDetailsModal"),
);
const BoardModal = React.lazy(() => import("@/components/modal/BoardModal"));
const BoardMembersModal = React.lazy(
  () => import("@/components/modal/BoardMembersModal"),
);
const OrganizationMembersModal = React.lazy(
  () => import("@/components/modal/OrganizationMembersModal"),
);
const ArchiveModal = React.lazy(() =>
  import("@/components/modal/ArchiveModal").then((m) => ({
    default: m.ArchiveModal,
  })),
);
const ExportImportModal = React.lazy(() =>
  import("@/components/modal/ExportImportModal").then((m) => ({
    default: m.ExportImportModal,
  })),
);
const TemplateModal = React.lazy(() =>
  import("@/components/modal/TemplateModal").then((m) => ({
    default: m.TemplateModal,
  })),
);
const emptyForm: TaskForm = {
  title: "",
  content: "",
  status: "todo" as Status,
  priority: "Medium" as Priority,
  blocked: false,
  blockedReason: "",
  dueDate: "",
  tags: [],
  assigneeId: "",
  subtasks: [],
};

const getErrorMessage = (error: any): string => {
  if (!error) return "";

  const data = error?.data ?? error?.error;

  if (typeof data === "string") {
    return data;
  }

  if (data && typeof data === "object") {
    if (typeof data.message === "string") {
      return data.message;
    }
    if (typeof data.error === "string") {
      return data.error;
    }
    if (data.error && typeof data.error === "object") {
      if (typeof data.error.message === "string") {
        return data.error.message;
      }
    }
  }

  if (typeof error?.message === "string") {
    return error.message;
  }

  return "";
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("auth_token"),
  );

  // Skip auth check if no token
  const { error: authError, isLoading: userLoading } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

  // If auth fails, clear token and show login
  useEffect(() => {
    if (authError) {
      localStorage.removeItem("auth_token");
      setIsAuthenticated(false);
    }
  }, [authError]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const handleLogout = () => {
      setIsAuthenticated(false);
    };
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  return (
    <>
      <AppToaster />
      {!isAuthenticated ? (
        <LoginForm onSuccess={handleLoginSuccess} />
      ) : userLoading ? (
        <PageShell>
          <ContentContainer>
            <Panel w="full" minH="calc(100vh - 64px)">
              <HStack justify="space-between" mb={8}>
                <HStack gap={3}>
                  <Skeleton w="44px" h="44px" borderRadius="12px" />
                  <Box>
                    <Skeleton h="18px" w="160px" mb={2} />
                    <Skeleton h="12px" w="220px" />
                  </Box>
                </HStack>
                <HStack gap={3}>
                  <Skeleton h="40px" w="160px" borderRadius="lg" />
                  <Skeleton h="40px" w="40px" borderRadius="full" />
                  <Skeleton h="40px" w="40px" borderRadius="full" />
                </HStack>
              </HStack>
              <HStack gap={4} align="stretch">
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    flex="1"
                    bg="bg.muted"
                    borderRadius="2xl"
                    border="1px solid"
                    borderColor="border.muted"
                    p={4}
                    minH="520px"
                  >
                    <Skeleton h="16px" w="120px" mb={4} />
                    <VStack gap={3} align="stretch">
                      {[0, 1, 2].map((j) => (
                        <SkeletonCard key={j} />
                      ))}
                    </VStack>
                  </Box>
                ))}
              </HStack>
            </Panel>
          </ContentContainer>
        </PageShell>
      ) : (
        <AuthenticatedApp />
      )}
    </>
  );
};

const AuthenticatedApp: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeBoardId = useAppSelector(
    (state) => state.activeBoard.activeBoardId,
  );

  // Fetch current user
  const { data: user } = useGetMeQuery();

  // Fetch boards on mount
  const { data: boards = [], isLoading: boardsLoading } = useGetBoardsQuery();

  // Fetch board members and tags
  const { data: boardMembers = [] } = useGetBoardMembersQuery(
    activeBoardId || "",
    {
      skip: !activeBoardId,
    },
  );
  const { data: tagsData } = useGetTagsQuery(activeBoardId || undefined, {
    skip: !activeBoardId,
  });
  const [createTag] = useCreateTagMutation();
  const [createSubtask] = useCreateSubtaskMutation();
  const [updateSubtask] = useUpdateSubtaskMutation();
  const [deleteSubtask] = useDeleteSubtaskMutation();
  const [createComment] = useCreateCommentMutation();

  // Sync with local stores
  const { setAssignees } = useAssigneesStore();
  const { setTags } = useTagsStore();
  const tagSeedStatusRef = useRef<Record<string, boolean>>({});

  // Convert board members to assignees
  const assignees = useMemo(
    () =>
      boardMembers.map((member) => ({
        id: member.userId,
        name: member.user.name,
        email: member.user.email,
        avatar: member.user.avatar,
        isSuperAdmin: member.user.isSuperAdmin,
      })),
    [boardMembers],
  );
  const tags = useMemo(() => tagsData ?? [], [tagsData]);

  useEffect(() => {
    if (assignees.length > 0) {
      setAssignees(assignees);
    }
  }, [assignees, setAssignees]);

  useEffect(() => {
    setTags(tags);
  }, [tags, setTags]);

  useEffect(() => {
    if (!activeBoardId) return;

    const normalizedExisting = new Set(
      tags
        .map((tag) => tag.name?.trim().toLowerCase())
        .filter((name): name is string => Boolean(name)),
    );

    const missingPresets = CORE_TAG_PRESETS.filter(
      (preset) => !normalizedExisting.has(preset.name.toLowerCase()),
    );

    if (missingPresets.length === 0) {
      tagSeedStatusRef.current[activeBoardId] = false;
      return;
    }

    if (tagSeedStatusRef.current[activeBoardId]) {
      return;
    }

    tagSeedStatusRef.current[activeBoardId] = true;

    const boardId = activeBoardId;

    Promise.all(
      missingPresets.map((preset) =>
        createTag({
          boardId,
          name: preset.name,
          color: preset.color,
        }).unwrap(),
      ),
    ).catch((error) => {
      console.error("Failed to seed default tags", error);
      tagSeedStatusRef.current[boardId] = false;
    });
  }, [activeBoardId, tags, createTag]);

  // Set the first board as active if none is selected
  useEffect(() => {
    if (!activeBoardId && boards.length > 0) {
      dispatch(setActiveBoard(boards[0].id));
    }
  }, [activeBoardId, boards, dispatch]);

  const {
    cards,
    counts,
    isLoading: cardsLoading,
    addCard,
    updateCard,
    removeCard,
    moveCard,
  } = useBoard();
  const {
    filteredCards,
    searchQuery,
    activeFilter,
    priorityFilter,
    sortBy,
    hasActiveFilters,
    handleSearch,
    handleFilterChange,
    handlePriorityChange,
    handleSortChange,
    clearFilters,
  } = useCardFilters(cards);
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<Status | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [isTemplateOpen, setIsTemplateOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isOrganizationMembersOpen, setIsOrganizationMembersOpen] =
    useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSavingTask, setIsSavingTask] = useState(false);
  const [taskErrors, setTaskErrors] = useState<
    Partial<Record<keyof TaskForm, string>>
  >({});

  const { archiveCard } = useArchiveStore();
  const [archiveTask] = useArchiveTaskMutation();
  const [deleteBoard] = useDeleteBoardMutation();

  const { data: detailedTask, refetch: refetchTaskDetails } = useGetTaskQuery(
    selectedCard?.id ?? "",
    {
      skip: !selectedCard?.id,
    },
  );

  const openDetailsModal = (card: Card) => {
    setSelectedCard(card);
    setIsDetailsOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsOpen(false);
    setSelectedCard(null);
  };

  useEffect(() => {
    if (isDetailsOpen && selectedCard?.id) {
      refetchTaskDetails();
    }
  }, [isDetailsOpen, selectedCard?.id, refetchTaskDetails]);

  const openBoardModal = () => {
    setIsBoardModalOpen(true);
  };

  const closeBoardModal = () => {
    setIsBoardModalOpen(false);
  };

  const openArchiveModal = () => {
    setIsArchiveOpen(true);
  };

  const closeArchiveModal = () => {
    setIsArchiveOpen(false);
  };

  const handleArchiveCard = async (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (!card || card.status !== "done") return;

    try {
      await archiveTask({ id, archived: true }).unwrap();
      archiveCard(card);
      appToaster.success({ title: "Task archived", duration: 2000 });
    } catch (error) {
      appToaster.error({ title: "Failed to archive task", duration: 2000 });
    }
  };

  const handleRestoreCard = async (card: Card) => {
    try {
      await archiveTask({ id: card.id, archived: false }).unwrap();
      appToaster.success({ title: "Task restored", duration: 2000 });
      closeArchiveModal();
    } catch (error) {
      appToaster.error({ title: "Failed to restore task", duration: 2000 });
    }
  };

  const openExportImportModal = () => {
    setIsExportImportOpen(true);
  };

  const closeExportImportModal = () => {
    setIsExportImportOpen(false);
  };

  const handleDeleteBoard = () => {
    if (!activeBoardId) return;
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteBoard = async () => {
    if (!activeBoardId) return;

    try {
      // Store the current board index to select next board
      const currentBoardIndex = boards.findIndex((b) => b.id === activeBoardId);
      const boardIdToDelete = activeBoardId;

      // Immediately switch to another board or clear to remove tasks from UI
      const remainingBoards = boards.filter((b) => b.id !== boardIdToDelete);

      if (remainingBoards.length > 0) {
        // Select the next board immediately
        const nextBoard =
          remainingBoards[
            Math.min(currentBoardIndex, remainingBoards.length - 1)
          ];
        dispatch(setActiveBoard(nextBoard.id));
      } else {
        // No boards left - clear active board immediately
        dispatch(setActiveBoard(""));
      }

      // Close the dialog
      setIsDeleteDialogOpen(false);

      // Delete the board via API (happens in background)
      await deleteBoard(boardIdToDelete).unwrap();

      // Show success message
      appToaster.success({
        title: "Board deleted successfully",
        duration: 2000,
      });

      // Force a full page reload to clear all state and tasks
      window.location.reload();
    } catch (error) {
      console.error("Failed to delete board:", error);
      appToaster.error({ title: "Failed to delete board", duration: 2000 });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleImport = (importedCards: Card[]) => {
    importedCards.forEach((card) => {
      void addCard(card);
    });
    appToaster.success({
      title: `Imported ${importedCards.length} tasks`,
      duration: 2000,
    });
  };

  const activeBoard = boards.find((b) => b.id === activeBoardId);
  const boardName = activeBoard?.name || "Default Board";

  const openTemplateModal = () => {
    setIsTemplateOpen(true);
  };

  const closeTemplateModal = () => {
    setIsTemplateOpen(false);
  };

  const openMembersModal = () => {
    setIsMembersOpen(true);
  };

  const closeMembersModal = () => {
    setIsMembersOpen(false);
  };

  const openOrganizationMembersModal = () => {
    setIsOrganizationMembersOpen(true);
  };

  const closeOrganizationMembersModal = () => {
    setIsOrganizationMembersOpen(false);
  };

  const handleSelectTemplate = (template: CardTemplate) => {
    setForm({
      ...emptyForm,
      title: template.template.title || "",
      content: template.template.content || "",
      priority: template.template.priority || "Medium",
      tags: template.template.tags || [],
      status: template.template.status || "todo",
    });
    setTaskErrors({});
    setEditingId(null);
    setIsOpen(true);
  };

  const openCreateModal = (status?: Status) => {
    setForm({
      ...emptyForm,
      status: status ?? "todo",
    });
    setTaskErrors({});
    setEditingId(null);
    setIsOpen(true);
  };

  const openEditModal = (card: Card) => {
    setForm({
      title: card.title,
      content: card.content,
      status: card.status,
      priority: card.priority,
      blocked: card.blocked,
      blockedReason: card.blockedReason,
      dueDate: card.dueDate || "",
      tags: card.tags || [],
      assigneeId: card.assigneeId || "",
      subtasks: card.subtasks || [],
    });
    setTaskErrors({});
    setEditingId(card.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTaskErrors({});
  };

  const handleRemoveCard = (id: string) => {
    removeCard(id);
    appToaster.success({ title: "Task deleted successfully", duration: 2000 });
  };

  const handleAddComment = async (cardId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    try {
      const createdComment = await createComment({
        taskId: cardId,
        text: trimmed,
      }).unwrap();

      if (selectedCard?.id === cardId) {
        setSelectedCard((prev) =>
          prev && prev.id === cardId
            ? {
                ...prev,
                comments: [...(prev.comments || []), createdComment],
              }
            : prev,
        );
      }

      appToaster.success({ title: "Comment added", duration: 2000 });

      if (selectedCard?.id === cardId) {
        await refetchTaskDetails();
      }
    } catch (error: any) {
      const description = getErrorMessage(error);
      appToaster.error({
        title: "Failed to add comment",
        description,
        duration: 3000,
      });
    }
  };

  const updateForm = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (taskErrors[name as keyof TaskForm]) {
      setTaskErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleBlocked = (
    eventOrChecked: React.ChangeEvent<HTMLInputElement> | boolean,
  ) => {
    const checked =
      typeof eventOrChecked === "boolean"
        ? eventOrChecked
        : eventOrChecked.target.checked;
    setForm((prev) => ({
      ...prev,
      blocked: checked,
      blockedReason: checked ? prev.blockedReason : "",
    }));
  };

  const saveCard = async (event: React.FormEvent) => {
    event.preventDefault();
    const title = form.title.trim();
    const content = form.content.trim();
    if (!title) {
      setTaskErrors((prev) => ({
        ...prev,
        title: "Task title is required.",
      }));
      return;
    }
    if (editingId && form.blocked && !form.blockedReason.trim()) {
      setTaskErrors((prev) => ({
        ...prev,
        blockedReason: "Blocked reason is required.",
      }));
      return;
    }

    setIsSavingTask(true);
    try {
      if (editingId) {
        const existingCard = cards.find((c) => c.id === editingId);
        if (!existingCard) {
          throw new Error("Task not found");
        }

        const incomingSubtasks = form.subtasks || [];
        const existingSubtasksMap = new Map(
          (existingCard.subtasks || []).map((subtask) => [subtask.id, subtask]),
        );
        const finalSubtasks: Subtask[] = [];

        for (const subtask of incomingSubtasks) {
          const existing = existingSubtasksMap.get(subtask.id);

          if (!existing) {
            const created = await createSubtask({
              taskId: editingId,
              text: subtask.text,
            }).unwrap();

            if (subtask.completed) {
              await updateSubtask({
                taskId: editingId,
                subtaskId: created.id,
                updates: { completed: true },
              }).unwrap();
            }

            finalSubtasks.push({
              id: created.id,
              text: created.text ?? subtask.text,
              completed: subtask.completed,
            });
          } else {
            const updates: Partial<Subtask> = {};
            if (existing.text !== subtask.text) {
              updates.text = subtask.text;
            }
            if (existing.completed !== subtask.completed) {
              updates.completed = subtask.completed;
            }

            if (Object.keys(updates).length > 0) {
              await updateSubtask({
                taskId: editingId,
                subtaskId: existing.id,
                updates,
              }).unwrap();
            }

            finalSubtasks.push({
              id: existing.id,
              text: subtask.text,
              completed: subtask.completed,
            });
            existingSubtasksMap.delete(subtask.id);
          }
        }

        for (const [remainingId] of existingSubtasksMap) {
          await deleteSubtask({
            taskId: editingId,
            subtaskId: remainingId,
          }).unwrap();
        }

        const updatedCard: Card = {
          ...existingCard,
          title: title || "Untitled",
          content,
          status: form.status,
          priority: form.priority,
          blocked: form.blocked,
          blockedReason: form.blocked ? form.blockedReason.trim() : "",
          dueDate: form.dueDate || "",
          tags: form.tags || [],
          assigneeId: form.assigneeId || undefined,
          subtasks: finalSubtasks,
          comments: existingCard.comments || [],
          activities: existingCard.activities || [],
          createdAt: existingCard.createdAt,
          updatedAt: new Date().toISOString(),
        };

        await updateCard(updatedCard);

        if (selectedCard && selectedCard.id === editingId) {
          setSelectedCard({
            ...updatedCard,
          });
        }
        appToaster.success({
          title: "Task updated successfully",
          duration: 2000,
        });
      } else {
        const created = await addCard({
          title: title || "Untitled",
          content,
          status: form.status,
          priority: form.priority,
          blocked: form.blocked,
          blockedReason: form.blocked ? form.blockedReason.trim() : "",
          dueDate: form.dueDate || "",
          tags: form.tags || [],
          assigneeId: form.assigneeId || undefined,
          subtasks: [],
        });

        const incomingSubtasks = form.subtasks || [];
        if (incomingSubtasks.length > 0 && created?.id) {
          for (const subtask of incomingSubtasks) {
            const createdSubtask = await createSubtask({
              taskId: created.id,
              text: subtask.text,
            }).unwrap();

            if (subtask.completed) {
              await updateSubtask({
                taskId: created.id,
                subtaskId: createdSubtask.id,
                updates: { completed: true },
              }).unwrap();
            }
          }
        }
        appToaster.success({
          title: "Task created successfully",
          duration: 2000,
        });
      }
      setIsOpen(false);
      setTaskErrors({});
    } catch (error: any) {
      const description = getErrorMessage(error);
      appToaster.error({
        title: editingId ? "Failed to update task" : "Failed to create task",
        description,
        duration: 3000,
      });
    } finally {
      setIsSavingTask(false);
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    id: string,
  ) => {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    status: Status,
  ) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOver(status);
  };

  const handleMove = (id: string, status: Status) => {
    const card = cards.find((c) => c.id === id);
    const oldStatus = card?.status;

    moveCard(id, status);

    // Only show toast if the status actually changed
    if (oldStatus && oldStatus !== status) {
      const label =
        status === "todo"
          ? "To Do"
          : status === "inprogress"
            ? "In Progress"
            : "Complete";
      appToaster.info({ title: `Moved to ${label}.`, duration: 1500 });
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    status: Status,
  ) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (!id) return;
    handleMove(id, status);
    setDragOver(null);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const cardsByStatus = useMemo(() => {
    return COLUMNS.reduce(
      (acc, column) => {
        acc[column.id] = filteredCards.filter(
          (card) => card.status === column.id,
        );
        return acc;
      },
      { todo: [], inprogress: [], done: [] } as Record<Status, Card[]>,
    );
  }, [filteredCards]);

  const detailsCard = useMemo(() => {
    if (!selectedCard) return null;
    if (detailedTask && detailedTask.id === selectedCard.id) {
      return detailedTask;
    }
    const latestFromBoard = cards.find((card) => card.id === selectedCard.id);
    return latestFromBoard ?? selectedCard;
  }, [selectedCard, detailedTask, cards]);

  // Show loading state while boards are loading
  if (boardsLoading) {
    return (
      <PageShell>
        <ContentContainer>
          <Panel w="full" minH="calc(100vh - 64px)">
            <HStack justify="space-between" mb={8}>
              <HStack gap={3}>
                <Skeleton w="44px" h="44px" borderRadius="12px" />
                <Box>
                  <Skeleton h="18px" w="160px" mb={2} />
                  <Skeleton h="12px" w="220px" />
                </Box>
              </HStack>
              <HStack gap={3}>
                <Skeleton h="40px" w="160px" borderRadius="lg" />
                <Skeleton h="40px" w="40px" borderRadius="full" />
                <Skeleton h="40px" w="40px" borderRadius="full" />
              </HStack>
            </HStack>
            <HStack gap={4} align="stretch">
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  flex="1"
                  bg="bg.muted"
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor="border.muted"
                  p={4}
                  minH="520px"
                >
                  <Skeleton h="16px" w="120px" mb={4} />
                  <VStack gap={3} align="stretch">
                    {[0, 1, 2].map((j) => (
                      <SkeletonCard key={j} />
                    ))}
                  </VStack>
                </Box>
              ))}
            </HStack>
          </Panel>
        </ContentContainer>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <ContentContainer>
        <Panel>
          <BoardView
            cards={cards}
            cardsLoading={cardsLoading}
            counts={counts}
            searchQuery={searchQuery}
            activeFilter={activeFilter}
            priorityFilter={priorityFilter}
            sortBy={sortBy}
            hasActiveFilters={hasActiveFilters}
            dragOver={dragOver}
            cardsByStatus={cardsByStatus}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onPriorityChange={handlePriorityChange}
            onSortChange={handleSortChange}
            onClearFilters={clearFilters}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            onCardClick={openDetailsModal}
            onEdit={openEditModal}
            onRemove={handleRemoveCard}
            onDragStart={handleDragStart}
            onArchive={handleArchiveCard}
            onCreate={openCreateModal}
            onCreateBoard={openBoardModal}
            onOpenArchive={openArchiveModal}
            onOpenExportImport={openExportImportModal}
            onOpenTemplates={openTemplateModal}
            onOpenMembers={openMembersModal}
            onOpenOrganizationMembers={openOrganizationMembersModal}
            onDeleteBoard={handleDeleteBoard}
          />
        </Panel>

        <React.Suspense fallback={null}>
          <TaskModal
            isOpen={isOpen}
            onClose={closeModal}
            onSave={saveCard}
            editingId={editingId}
            form={form}
            onChange={updateForm}
            onToggleBlocked={toggleBlocked}
            isSaving={isSavingTask}
            errors={taskErrors}
          />
          <TaskDetailsModal
            card={detailsCard}
            isOpen={isDetailsOpen}
            onClose={closeDetailsModal}
            onEdit={openEditModal}
            onAddComment={handleAddComment}
          />

          <BoardModal isOpen={isBoardModalOpen} onClose={closeBoardModal} />

          <ArchiveModal
            isOpen={isArchiveOpen}
            onClose={closeArchiveModal}
            onRestore={handleRestoreCard}
          />

          <ExportImportModal
            isOpen={isExportImportOpen}
            onClose={closeExportImportModal}
            boardId={activeBoard?.id || "default"}
            boardName={boardName}
            cards={cards}
            onImport={handleImport}
          />

          <TemplateModal
            isOpen={isTemplateOpen}
            onClose={closeTemplateModal}
            onSelectTemplate={handleSelectTemplate}
          />

          <BoardMembersModal
            boardId={activeBoardId || ""}
            isOpen={isMembersOpen}
            onClose={closeMembersModal}
          />

          <OrganizationMembersModal
            organizationId={user?.organizationId || ""}
            isOpen={isOrganizationMembersOpen}
            onClose={closeOrganizationMembersModal}
          />
        </React.Suspense>

        <Dialog.Root
          open={isDeleteDialogOpen}
          onOpenChange={(details) =>
            !details.open && setIsDeleteDialogOpen(false)
          }
        >
          <Dialog.Backdrop bg="rgba(0, 0, 0, 0.6)" backdropFilter="blur(10px)" />
          <Dialog.Positioner>
            <Dialog.Content
              maxW="420px"
              borderRadius="xl"
              overflow="hidden"
              boxShadow="0 20px 60px rgba(0, 0, 0, 0.3)"
              bg="white"
              _dark={{ bg: "gray.800" }}
            >
              <Dialog.CloseTrigger asChild>
                <AppIconButton
                  aria-label="Close"
                  size="sm"
                  position="absolute"
                  top={3}
                  right={3}
                >
                  <FiX />
                </AppIconButton>
              </Dialog.CloseTrigger>

              <Box px={6} pt={6} pb={4}>
                <VStack gap={3} align="center">
                  <Box
                    p={3}
                    borderRadius="full"
                    bg="red.50"
                    _dark={{ bg: "red.900/20" }}
                  >
                    <FiAlertTriangle size={32} color="#DC2626" />
                  </Box>
                  <Dialog.Title
                    fontSize="xl"
                    fontWeight="semibold"
                    color="gray.900"
                    _dark={{ color: "white" }}
                    textAlign="center"
                  >
                    Delete Board?
                  </Dialog.Title>
                </VStack>
              </Box>

              <Dialog.Body px={6} py={4}>
                <Text
                  fontSize="sm"
                  lineHeight="relaxed"
                  color="gray.600"
                  _dark={{ color: "gray.400" }}
                  textAlign="center"
                >
                  This action will permanently delete all tasks in this board
                  and cannot be undone.
                </Text>
              </Dialog.Body>

              <Dialog.Footer gap={3} px={6} pb={6} pt={2} flexDirection="column">
                <Button
                  onClick={confirmDeleteBoard}
                  size="lg"
                  width="full"
                  bg="red.600"
                  color="white"
                  _hover={{ bg: "red.700" }}
                  _active={{ bg: "red.800" }}
                  borderRadius="lg"
                  fontWeight="medium"
                >
                  Delete Board
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  size="lg"
                  width="full"
                  color="gray.600"
                  _hover={{ bg: "gray.100" }}
                  borderRadius="lg"
                  fontWeight="medium"
                >
                  Cancel
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Dialog.Root>
      </ContentContainer>
    </PageShell>
  );
};

export default App;
