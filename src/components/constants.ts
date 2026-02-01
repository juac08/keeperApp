import type { Column } from "@/types";

export const COLUMNS: Column[] = [
  { id: "todo", title: "To Do", hint: "Ideas & incoming work" },
  { id: "inprogress", title: "In Progress", hint: "Focus zone" },
  { id: "done", title: "Complete", hint: "Shipped work" },
];
