import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tag } from "@/types";

type TagsStore = {
  tags: Tag[];
  addTag: (label: string, color: string, icon: string) => Tag;
  updateTag: (id: string, updates: Partial<Omit<Tag, "id">>) => void;
  deleteTag: (id: string) => void;
  getTag: (id: string) => Tag | undefined;
};

const defaultTags: Tag[] = [
  { id: "1", label: "Bug", color: "red", icon: "🐛" },
  { id: "2", label: "Feature", color: "blue", icon: "✨" },
  { id: "3", label: "Enhancement", color: "purple", icon: "🚀" },
  { id: "4", label: "Documentation", color: "gray", icon: "📚" },
  { id: "5", label: "Design", color: "pink", icon: "🎨" },
  { id: "6", label: "Testing", color: "green", icon: "✅" },
];

export const useTagsStore = create<TagsStore>()(
  persist(
    (set, get) => ({
      tags: defaultTags,
      addTag: (label: string, color: string, icon: string): Tag => {
        const newTag: Tag = {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          label,
          color,
          icon,
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
    },
  ),
);
