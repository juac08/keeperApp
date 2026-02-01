export type Status = "todo" | "inprogress" | "done";
export type Priority = "Low" | "Medium" | "High";

export type Tag = {
  id: string;
  label: string;
  color: string;
  icon: string;
};

export type Assignee = {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
};

export type Card = {
  id: string;
  title: string;
  content: string;
  status: Status;
  priority: Priority;
  blocked: boolean;
  blockedReason: string;
  dueDate?: string; // ISO date string
  tags: string[]; // Array of tag IDs
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskForm = {
  title: string;
  content: string;
  status: Status;
  priority: Priority;
  blocked: boolean;
  blockedReason: string;
  dueDate: string;
  tags: string[];
  assigneeId: string;
};

export type Column = {
  id: Status;
  title: string;
  hint: string;
};

export type SortOption =
  | "priority"
  | "dueDate"
  | "title"
  | "createdAt"
  | "updatedAt";
export type SortDirection = "asc" | "desc";
