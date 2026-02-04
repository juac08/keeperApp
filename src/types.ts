export type Status = "todo" | "inprogress" | "done";
export type Priority = "Low" | "Medium" | "High";

export type Tag = {
  id: string;
  name: string;
  color?: string;
};

export type Assignee = {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  isSuperAdmin?: boolean;
};

export type Subtask = {
  id: string;
  text: string;
  completed: boolean;
};

export type Comment = {
  id: string;
  text: string;
  authorId: string;
  createdAt: string;
  authorName?: string;
};

export type Activity = {
  id: string;
  type: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  taskId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  // Legacy fields for backward compatibility
  authorId?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
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
  subtasks: Subtask[];
  comments: Comment[];
  activities: Activity[];
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
  subtasks: Subtask[];
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

export type BoardTemplate =
  | "default"
  | "software"
  | "marketing"
  | "design"
  | "personal";

export type Board = {
  id: string;
  name: string;
  description?: string;
  template: BoardTemplate;
  icon?: string;
  createdAt: string;
  updatedAt: string;
};

export type BoardMemberRole = "owner" | "admin" | "member" | "viewer";

export type BoardMember = {
  id: string;
  boardId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    isSuperAdmin?: boolean;
  };
  role: BoardMemberRole;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  organizationRole?: "admin" | "member";
  isSuperAdmin?: boolean;
  organizationId?: string;
};
