import React, { useMemo, useState } from "react";
import { Box, Grid } from "@chakra-ui/react";
import { useBoard } from "@/state/BoardContext";
import { useCardFilters } from "@/hooks/useCardFilters";
import type { Card, Priority, Status, TaskForm } from "@/types";
import { COLUMNS } from "@/config";
import { BoardHeader, BoardToolbar, BoardColumn } from "@/components/board";
import AppToaster, { appToaster } from "@/shared";
import { TaskModal, TaskDetailsModal, BoardModal } from "@/components/modal";

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

const App: React.FC = () => {
  const {
    cards,
    counts,
    addCard,
    updateCard,
    removeCard,
    moveCard,
    clearBoard,
  } = useBoard();
  const {
    filteredCards,
    searchQuery,
    activeFilter,
    priorityFilter,
    hasActiveFilters,
    handleSearch,
    handleFilterChange,
    handlePriorityChange,
    clearFilters,
  } = useCardFilters(cards);
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<Status | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const openNewTaskModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsOpen(true);
  };

  const openDetailsModal = (card: Card) => {
    setSelectedCard(card);
    setIsDetailsOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsOpen(false);
    setSelectedCard(null);
  };

  const openBoardModal = () => {
    setIsBoardModalOpen(true);
  };

  const closeBoardModal = () => {
    setIsBoardModalOpen(false);
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
    setEditingId(card.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleRemoveCard = (id: string) => {
    removeCard(id);
    appToaster.success({ title: "Task deleted successfully", duration: 2000 });
  };

  const handleAddComment = (cardId: string, text: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      text,
      authorId: "", // You can set this to current user when auth is added
      createdAt: new Date().toISOString(),
    };

    const newActivity = {
      id: `activity-${Date.now()}`,
      type: "commented" as const,
      timestamp: new Date().toISOString(),
    };

    updateCard({
      ...card,
      comments: [...(card.comments || []), newComment],
      activities: [...(card.activities || []), newActivity],
      updatedAt: new Date().toISOString(),
    });

    // Update selectedCard to show the new comment immediately
    if (selectedCard && selectedCard.id === cardId) {
      setSelectedCard({
        ...card,
        comments: [...(card.comments || []), newComment],
        activities: [...(card.activities || []), newActivity],
      });
    }

    appToaster.success({ title: "Comment added", duration: 2000 });
  };

  const updateForm = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleBlocked = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setForm((prev) => ({
      ...prev,
      blocked: checked,
      blockedReason: checked ? prev.blockedReason : "",
    }));
  };

  const saveCard = (event: React.FormEvent) => {
    event.preventDefault();
    const title = form.title.trim();
    const content = form.content.trim();
    if (!title && !content) return;
    if (form.blocked && !form.blockedReason.trim()) return;

    if (editingId) {
      const existingCard = cards.find((c) => c.id === editingId);
      updateCard({
        id: editingId,
        title: title || "Untitled",
        content,
        status: form.status,
        priority: form.priority,
        blocked: form.blocked,
        blockedReason: form.blocked ? form.blockedReason.trim() : "",
        dueDate: form.dueDate || "",
        tags: form.tags || [],
        assigneeId: form.assigneeId || "",
        subtasks: form.subtasks || [],
        comments: existingCard?.comments || [],
        activities: [
          ...(existingCard?.activities || []),
          {
            id: `activity-${Date.now()}`,
            type: "updated" as const,
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: existingCard?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      appToaster.success({
        title: "Task updated successfully",
        duration: 2000,
      });
    } else {
      addCard({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        title: title || "Untitled",
        content,
        status: form.status,
        priority: form.priority,
        blocked: form.blocked,
        blockedReason: form.blocked ? form.blockedReason.trim() : "",
        dueDate: form.dueDate || "",
        tags: form.tags || [],
        assigneeId: form.assigneeId || "",
        subtasks: form.subtasks || [],
        comments: [],
        activities: [
          {
            id: `activity-${Date.now()}`,
            type: "created" as const,
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      appToaster.success({
        title: "Task created successfully",
        duration: 2000,
      });
    }
    setIsOpen(false);
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

  return (
    <Box
      maxW="1320px"
      mx="auto"
      px={{ base: 5, md: 8 }}
      py={{ base: 9, md: 11 }}
    >
      <AppToaster />
      <Box
        bg="bg.panel"
        borderRadius={{ base: "2xl", md: "3xl" }}
        border="1px solid"
        borderColor="border.muted"
        boxShadow="soft"
        px={{ base: 6, md: 10 }}
        py={{ base: 7, md: 9 }}
      >
        <BoardHeader
          onClear={clearBoard}
          onAdd={openNewTaskModal}
          onCreateBoard={openBoardModal}
        />
        <BoardToolbar
          total={cards.length}
          todo={counts.todo}
          inprogress={counts.inprogress}
          done={counts.done}
          searchQuery={searchQuery}
          activeFilter={activeFilter}
          priorityFilter={priorityFilter}
          hasActiveFilters={hasActiveFilters}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          onPriorityChange={handlePriorityChange}
          onClearFilters={clearFilters}
        />
        <Grid templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }} gap={4}>
          {COLUMNS.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              cards={cardsByStatus[column.id]}
              count={counts[column.id]}
              dragOver={dragOver}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragLeave={handleDragLeave}
              onCardClick={openDetailsModal}
              onEdit={openEditModal}
              onRemove={handleRemoveCard}
              onMove={handleMove}
              onDragStart={handleDragStart}
            />
          ))}
        </Grid>
      </Box>

      <TaskModal
        isOpen={isOpen}
        onClose={closeModal}
        onSave={saveCard}
        editingId={editingId}
        form={form}
        onChange={updateForm}
        onToggleBlocked={toggleBlocked}
      />

      <TaskDetailsModal
        card={selectedCard}
        isOpen={isDetailsOpen}
        onClose={closeDetailsModal}
        onEdit={openEditModal}
        onAddComment={handleAddComment}
      />

      <BoardModal isOpen={isBoardModalOpen} onClose={closeBoardModal} />
    </Box>
  );
};

export default App;
