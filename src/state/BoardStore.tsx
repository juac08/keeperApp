import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Board, BoardTemplate } from "@/types";

type BoardStore = {
  boards: Board[];
  activeBoardId: string | null;
  addBoard: (board: Omit<Board, "id" | "createdAt" | "updatedAt">) => Board;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  setActiveBoard: (id: string) => void;
  getActiveBoard: () => Board | null;
};

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      boards: [],
      activeBoardId: null,

      addBoard: (board) => {
        const newBoard: Board = {
          ...board,
          id: `board-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          boards: [...state.boards, newBoard],
          activeBoardId: state.activeBoardId || newBoard.id,
        }));

        return newBoard;
      },

      updateBoard: (id, updates) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id
              ? { ...board, ...updates, updatedAt: new Date().toISOString() }
              : board,
          ),
        }));
      },

      deleteBoard: (id) => {
        set((state) => {
          const remainingBoards = state.boards.filter((b) => b.id !== id);
          const newActiveId =
            state.activeBoardId === id
              ? remainingBoards[0]?.id || null
              : state.activeBoardId;

          return {
            boards: remainingBoards,
            activeBoardId: newActiveId,
          };
        });
      },

      setActiveBoard: (id) => {
        set({ activeBoardId: id });
      },

      getActiveBoard: () => {
        const state = get();
        return state.boards.find((b) => b.id === state.activeBoardId) || null;
      },
    }),
    {
      name: "board-storage",
    },
  ),
);
