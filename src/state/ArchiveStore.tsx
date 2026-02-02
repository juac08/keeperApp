import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Card } from "@/types";

type ArchiveStore = {
  archivedCards: Card[];
  archiveCard: (card: Card) => void;
  restoreCard: (id: string) => Card | undefined;
  deleteArchivedCard: (id: string) => void;
  clearArchive: () => void;
  getArchivedCard: (id: string) => Card | undefined;
};

export const useArchiveStore = create<ArchiveStore>()(
  persist(
    (set, get) => ({
      archivedCards: [],
      archiveCard: (card) =>
        set((state) => ({
          archivedCards: [
            ...state.archivedCards,
            { ...card, archivedAt: new Date().toISOString() },
          ],
        })),
      restoreCard: (id) => {
        const card = get().archivedCards.find((c) => c.id === id);
        if (card) {
          set((state) => ({
            archivedCards: state.archivedCards.filter((c) => c.id !== id),
          }));
          const { archivedAt, ...restoredCard } = card as Card & {
            archivedAt?: string;
          };
          return restoredCard;
        }
        return undefined;
      },
      deleteArchivedCard: (id) =>
        set((state) => ({
          archivedCards: state.archivedCards.filter((c) => c.id !== id),
        })),
      clearArchive: () => set({ archivedCards: [] }),
      getArchivedCard: (id) => get().archivedCards.find((c) => c.id === id),
    }),
    {
      name: "archive-storage",
    },
  ),
);
