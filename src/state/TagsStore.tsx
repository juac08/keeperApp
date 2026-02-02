import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tag } from "@/types";

const normalizeTag = (tag: Tag | any): Tag => ({
  id: tag.id ?? `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  name: tag.name ?? tag.label ?? "Tag",
  color: tag.color,
});

type TagsStore = {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  addTag: (name: string, color?: string) => Tag;
  updateTag: (id: string, updates: Partial<Omit<Tag, "id">>) => void;
  deleteTag: (id: string) => void;
  getTag: (id: string) => Tag | undefined;
};

export const useTagsStore = create<TagsStore>()(
  persist(
    (set, get) => ({
      tags: [],
      setTags: (tags: Tag[]) => set({ tags: tags.map(normalizeTag) }),
      addTag: (name: string, color?: string): Tag => {
        const newTag: Tag = {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          name,
          color,
        };
        set((state: TagsStore) => ({ tags: [...state.tags, newTag] }));
        return newTag;
      },
      updateTag: (id: string, updates: Partial<Omit<Tag, "id">>): void => {
        set((state: TagsStore) => ({
          tags: state.tags.map((tag: Tag) =>
            tag.id === id ? { ...tag, ...updates } : tag,
          ),
        }));
      },
      deleteTag: (id: string): void => {
        set((state: TagsStore) => ({
          tags: state.tags.filter((tag: Tag) => tag.id !== id),
        }));
      },
      getTag: (id: string): Tag | undefined => {
        return get().tags.find((tag: Tag) => tag.id === id);
      },
    }),
    {
      name: "tags-storage",
      version: 2,
      migrate: (persistedState: any) => {
        if (!persistedState) {
          return { tags: [] };
        }
        const tags = Array.isArray(persistedState.tags)
          ? persistedState.tags.map(normalizeTag)
          : [];
        return {
          ...persistedState,
          tags,
        };
      },
    },
  ),
);
