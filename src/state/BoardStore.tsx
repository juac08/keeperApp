import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Board, BoardTemplate } from "@/types";
import { apiClient } from "@/config/api";

type BoardStore = {
  boards: Board[];
  activeBoardId: string | null;
  isLoading: boolean;
  error: string | null;
  fetchBoards: () => Promise<void>;
  addBoard: (
    board: Omit<Board, "id" | "createdAt" | "updatedAt">,
  ) => Promise<Board>;
  updateBoard: (id: string, updates: Partial<Board>) => Promise<void>;
  deleteBoard: (id: string) => Promise<void>;
  setActiveBoard: (id: string) => void;
  getActiveBoard: () => Board | null;
};

export const useBoardStore = create<BoardStore>()(
  persist(
    (set, get) => ({
      boards: [],
      activeBoardId: null,
      isLoading: false,
      error: null,

      fetchBoards: async () => {
        set({ isLoading: true, error: null });
        try {
          const boards = await apiClient.get("/boards");
          set({
            boards,
            isLoading: false,
            activeBoardId: get().activeBoardId || boards[0]?.id || null,
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          console.error("Failed to fetch boards:", error);
        }
      },

      addBoard: async (board) => {
        set({ isLoading: true, error: null });
        try {
          const newBoard = await apiClient.post("/boards", board);
          set((state) => ({
            boards: [...state.boards, newBoard],
            activeBoardId: state.activeBoardId || newBoard.id,
            isLoading: false,
          }));
          return newBoard;
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      updateBoard: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const updatedBoard = await apiClient.put(`/boards/${id}`, updates);
          set((state) => ({
            boards: state.boards.map((board) =>
              board.id === id ? updatedBoard : board,
            ),
            isLoading: false,
          }));
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      deleteBoard: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.delete(`/boards/${id}`);
          set((state) => {
            const remainingBoards = state.boards.filter((b) => b.id !== id);
            const newActiveId =
              state.activeBoardId === id
                ? remainingBoards[0]?.id || null
                : state.activeBoardId;

            return {
              boards: remainingBoards,
              activeBoardId: newActiveId,
              isLoading: false,
            };
          });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
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
