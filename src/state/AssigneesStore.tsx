import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Assignee } from "@/types";

type AssigneesStore = {
  assignees: Assignee[];
  setAssignees: (assignees: Assignee[]) => void;
  addAssignee: (name: string, email?: string, avatar?: string) => Assignee;
  updateAssignee: (id: string, updates: Partial<Omit<Assignee, "id">>) => void;
  deleteAssignee: (id: string) => void;
  getAssignee: (id: string) => Assignee | undefined;
};

export const useAssigneesStore = create<AssigneesStore>()(
  persist(
    (set, get) => ({
      assignees: [],
      setAssignees: (assignees: Assignee[]) => set({ assignees }),
      addAssignee: (
        name: string,
        email?: string,
        avatar?: string,
      ): Assignee => {
        const newAssignee: Assignee = {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name,
          email,
          avatar,
        };
        set((state: AssigneesStore) => ({
          assignees: [...state.assignees, newAssignee],
        }));
        return newAssignee;
      },
      updateAssignee: (
        id: string,
        updates: Partial<Omit<Assignee, "id">>,
      ): void => {
        set((state: AssigneesStore) => ({
          assignees: state.assignees.map((assignee: Assignee) =>
            assignee.id === id ? { ...assignee, ...updates } : assignee,
          ),
        }));
      },
      deleteAssignee: (id: string): void => {
        set((state: AssigneesStore) => ({
          assignees: state.assignees.filter(
            (assignee: Assignee) => assignee.id !== id,
          ),
        }));
      },
      getAssignee: (id: string): Assignee | undefined => {
        return get().assignees.find((assignee: Assignee) => assignee.id === id);
      },
    }),
    {
      name: "assignees-storage",
    },
  ),
);
