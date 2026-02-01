import type { BoardTemplate, Tag } from "@/types";

export type TemplateConfig = {
  name: string;
  description: string;
  icon: string;
  columns: {
    id: string;
    title: string;
    hint: string;
  }[];
  defaultTags: Omit<Tag, "id">[];
};

export const BOARD_TEMPLATES: Record<BoardTemplate, TemplateConfig> = {
  default: {
    name: "Default Board",
    description: "Simple task board with To Do, In Progress, and Done columns",
    icon: "📋",
    columns: [
      { id: "todo", title: "To Do", hint: "Tasks to be started" },
      { id: "inprogress", title: "In Progress", hint: "Active tasks" },
      { id: "done", title: "Done", hint: "Completed tasks" },
    ],
    defaultTags: [
      { label: "Bug", color: "red", icon: "🐛" },
      { label: "Feature", color: "blue", icon: "✨" },
      { label: "Urgent", color: "orange", icon: "🔥" },
    ],
  },

  software: {
    name: "Software Development",
    description: "Perfect for software development teams with sprint planning",
    icon: "💻",
    columns: [
      { id: "todo", title: "Backlog", hint: "Planned work" },
      { id: "inprogress", title: "In Development", hint: "Active development" },
      { id: "done", title: "Deployed", hint: "Live in production" },
    ],
    defaultTags: [
      { label: "Bug", color: "red", icon: "🐛" },
      { label: "Feature", color: "blue", icon: "✨" },
      { label: "Frontend", color: "purple", icon: "🎨" },
      { label: "Backend", color: "green", icon: "⚙️" },
      { label: "Testing", color: "yellow", icon: "🧪" },
      { label: "Documentation", color: "cyan", icon: "📝" },
    ],
  },

  marketing: {
    name: "Marketing Campaign",
    description: "Manage marketing campaigns and content creation",
    icon: "📢",
    columns: [
      { id: "todo", title: "Ideas", hint: "Campaign ideas" },
      { id: "inprogress", title: "In Production", hint: "Content creation" },
      { id: "done", title: "Published", hint: "Live campaigns" },
    ],
    defaultTags: [
      { label: "Social Media", color: "blue", icon: "📱" },
      { label: "Email", color: "green", icon: "📧" },
      { label: "Content", color: "purple", icon: "✍️" },
      { label: "SEO", color: "orange", icon: "🔍" },
      { label: "Analytics", color: "cyan", icon: "📊" },
    ],
  },

  design: {
    name: "Design Project",
    description: "Track design work from concept to delivery",
    icon: "🎨",
    columns: [
      { id: "todo", title: "Concept", hint: "Initial ideas" },
      { id: "inprogress", title: "In Design", hint: "Active design work" },
      { id: "done", title: "Delivered", hint: "Completed designs" },
    ],
    defaultTags: [
      { label: "UI Design", color: "purple", icon: "🖼️" },
      { label: "UX Research", color: "blue", icon: "🔬" },
      { label: "Prototype", color: "green", icon: "📐" },
      { label: "Feedback", color: "orange", icon: "💬" },
      { label: "Assets", color: "pink", icon: "🎭" },
    ],
  },

  personal: {
    name: "Personal Tasks",
    description: "Organize your personal todos and goals",
    icon: "✅",
    columns: [
      { id: "todo", title: "To Do", hint: "Things to do" },
      { id: "inprogress", title: "Doing", hint: "In progress" },
      { id: "done", title: "Done", hint: "Completed" },
    ],
    defaultTags: [
      { label: "Home", color: "blue", icon: "🏠" },
      { label: "Work", color: "purple", icon: "💼" },
      { label: "Health", color: "green", icon: "🏃" },
      { label: "Learning", color: "orange", icon: "📚" },
      { label: "Shopping", color: "pink", icon: "🛒" },
    ],
  },
};

export const getTemplateConfig = (template: BoardTemplate): TemplateConfig => {
  return BOARD_TEMPLATES[template];
};
