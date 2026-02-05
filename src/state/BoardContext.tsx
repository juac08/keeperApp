import React, { createContext, useContext, useMemo } from "react";
import type { Card, Status } from "@/types";
import { useAppSelector } from "@/store/hooks";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/store";

type BoardContextValue = {
  cards: Card[];
  counts: Record<Status, number>;
  isLoading: boolean;
  error: string | undefined;
  addCard: (card: Partial<Card>) => Promise<Card>;
  updateCard: (card: Card) => Promise<void>;
  removeCard: (id: string) => Promise<void>;
  moveCard: (id: string, status: Status) => Promise<void>;
  clearBoard: () => void;
};

const BoardContext = createContext<BoardContextValue | null>(null);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const activeBoardId = useAppSelector(
    (state) => state.activeBoard.activeBoardId,
  );

  const {
    data: cards = [],
    isLoading,
    error,
  } = useGetTasksQuery(activeBoardId || undefined, {
    skip: !activeBoardId,
  });

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const counts = useMemo(() => {
    return cards.reduce(
      (acc, card) => {
        acc[card.status] += 1;
        return acc;
      },
      { todo: 0, inprogress: 0, done: 0 },
    );
  }, [cards]);

  const addCard = async (card: Partial<Card>) => {
    try {
      const payload = {
        ...card,
        boardId: activeBoardId || undefined,
      } as Partial<Card> & { boardId?: string };

      if (payload.assigneeId === "") {
        delete payload.assigneeId;
      }

      const created = await createTask(payload).unwrap();
      return created;
    } catch (error: any) {
      console.error("Failed to add task:", error);
      throw error;
    }
  };

  const updateCard = async (card: Card) => {
    try {
      const updates: Partial<Card> = { ...card };

      if (updates.assigneeId === "") {
        delete updates.assigneeId;
      }

      await updateTask({ id: card.id, updates }).unwrap();
    } catch (error: any) {
      console.error("Failed to update task:", error);
      throw error;
    }
  };

  const removeCard = async (id: string) => {
    try {
      await deleteTask(id).unwrap();
    } catch (error: any) {
      console.error("Failed to remove task:", error);
      throw error;
    }
  };

  const moveCard = async (id: string, status: Status) => {
    try {
      await updateTask({ id, updates: { status } }).unwrap();
    } catch (error: any) {
      console.error("Failed to move task:", error);
      throw error;
    }
  };

  const clearBoard = () => {
    // This could trigger a batch delete or just clear local state
    console.warn("clearBoard not fully implemented with RTK Query");
  };

  return (
    <BoardContext.Provider
      value={{
        cards,
        counts,
        isLoading,
        error: error
          ? "message" in error
            ? error.message
            : "An error occurred"
          : undefined,
        addCard,
        updateCard,
        removeCard,
        moveCard,
        clearBoard,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (!context) throw new Error("useBoard must be used within BoardProvider");
  return context;
};
