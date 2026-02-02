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
      { name: "Bug", color: "red" },
      { name: "Enhancement", color: "green" },
      { name: "Story", color: "purple" },
      { name: "Design", color: "blue" },
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
      { name: "Bug", color: "red" },
      { name: "Enhancement", color: "green" },
      { name: "Frontend", color: "purple" },
      { name: "Backend", color: "teal" },
      { name: "Testing", color: "yellow" },
      { name: "Documentation", color: "cyan" },
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
      { name: "Social Media", color: "blue" },
      { name: "Email", color: "green" },
      { name: "Content", color: "purple" },
      { name: "SEO", color: "orange" },
      { name: "Analytics", color: "cyan" },
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
      { name: "UI", color: "purple" },
      { name: "UX", color: "blue" },
      { name: "Prototype", color: "green" },
      { name: "Feedback", color: "orange" },
      { name: "Assets", color: "pink" },
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
      { name: "Home", color: "blue" },
      { name: "Work", color: "purple" },
      { name: "Health", color: "green" },
      { name: "Learning", color: "orange" },
      { name: "Shopping", color: "pink" },
    ],
  },
};

export const getTemplateConfig = (template: BoardTemplate): TemplateConfig => {
  return BOARD_TEMPLATES[template];
};
