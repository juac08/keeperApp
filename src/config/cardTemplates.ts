import type { Priority, TaskForm } from "@/types";

export type CardTemplate = {
  id: string;
  name: string;
  icon: string;
  description: string;
  template: Partial<TaskForm>;
};

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: "bug",
    name: "Bug Report",
    icon: "🐛",
    description: "Report and track a bug",
    template: {
      title: "Bug: ",
      content:
        "**Steps to reproduce:**\n1. \n\n**Expected behavior:**\n\n**Actual behavior:**\n",
      priority: "High" as Priority,
      tags: [],
    },
  },
  {
    id: "feature",
    name: "Feature Request",
    icon: "✨",
    description: "New feature or enhancement",
    template: {
      title: "Feature: ",
      content:
        "**Description:**\n\n**Use case:**\n\n**Acceptance criteria:**\n",
      priority: "Medium" as Priority,
      tags: [],
    },
  },
  {
    id: "task",
    name: "General Task",
    icon: "📝",
    description: "Standard work item",
    template: {
      title: "",
      content: "",
      priority: "Medium" as Priority,
      tags: [],
    },
  },
  {
    id: "research",
    name: "Research",
    icon: "🔍",
    description: "Investigation or research task",
    template: {
      title: "Research: ",
      content: "**Goal:**\n\n**Questions to answer:**\n\n**Resources:**\n",
      priority: "Low" as Priority,
      tags: [],
    },
  },
  {
    id: "meeting",
    name: "Meeting",
    icon: "👥",
    description: "Schedule a meeting",
    template: {
      title: "Meeting: ",
      content: "**Agenda:**\n\n**Attendees:**\n\n**Action items:**\n",
      priority: "Medium" as Priority,
      tags: [],
    },
  },
  {
    id: "review",
    name: "Code Review",
    icon: "👁️",
    description: "Review code changes",
    template: {
      title: "Review: ",
      content: "**PR/MR link:**\n\n**Key changes:**\n\n**Notes:**\n",
      priority: "Medium" as Priority,
      tags: [],
    },
  },
];

export const getTemplateById = (id: string): CardTemplate | undefined => {
  return CARD_TEMPLATES.find((t) => t.id === id);
};
