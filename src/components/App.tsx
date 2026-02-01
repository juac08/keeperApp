import React, { useMemo, useState } from "react";
import { Box, Grid } from "@chakra-ui/react";
import { useBoard } from "@/state/BoardContext";
import type { Card, Priority, Status, TaskForm } from "@/types";
import { COLUMNS } from "@/components/constants";
import BoardHeader from "@/components/BoardHeader";
import BoardToolbar from "@/components/BoardToolbar";
import BoardColumn from "@/components/BoardColumn";
import AppToaster, { appToaster } from "@/components/AppToaster";
import TaskModal from "@/components/TaskModal";

const emptyForm: TaskForm = {
  title: "",
  content: "",
  status: "todo" as Status,
  priority: "Medium" as Priority,
  blocked: false,
  blockedReason: "",
};

const App: React.FC = () => {
  const { cards, counts, addCard, updateCard, removeCard, moveCard, clearBoard } = useBoard();
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<Status | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openNewTaskModal = () => {
    setForm(emptyForm);
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
    });
    setEditingId(card.id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const updateForm = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      updateCard({
        id: editingId,
        title: title || "Untitled",
        content,
        status: form.status,
        priority: form.priority,
        blocked: form.blocked,
        blockedReason: form.blocked ? form.blockedReason.trim() : "",
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
      });
    }
    setIsOpen(false);
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, id: string) => {
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, status: Status) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragOver(status);
  };

  const handleMove = (id: string, status: Status) => {
    moveCard(id, status);
    const label = status === "todo" ? "To Do" : status === "inprogress" ? "In Progress" : "Complete";
    appToaster.info({ title: `Moved to ${label}.`, duration: 1500 });
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, status: Status) => {
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
        acc[column.id] = cards.filter((card) => card.status === column.id);
        return acc;
      },
      { todo: [], inprogress: [], done: [] } as Record<Status, Card[]>
    );
  }, [cards]);

  return (
    <Box maxW="1320px" mx="auto" px={{ base: 5, md: 8 }} py={{ base: 9, md: 11 }}>
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
        <BoardHeader onClear={clearBoard} onAdd={openNewTaskModal} />
        <BoardToolbar
          total={cards.length}
          todo={counts.todo}
          inprogress={counts.inprogress}
          done={counts.done}
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
              onEdit={openEditModal}
              onRemove={removeCard}
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
    </Box>
  );
};

export default App;
