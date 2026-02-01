export type Status = "todo" | "inprogress" | "done";
export type Priority = "Low" | "Medium" | "High";

export type Card = {
  id: string;
  title: string;
  content: string;
  status: Status;
  priority: Priority;
  blocked: boolean;
  blockedReason: string;
};

export type TaskForm = {
  title: string;
  content: string;
  status: Status;
  priority: Priority;
  blocked: boolean;
  blockedReason: string;
};

export type Column = {
  id: Status;
  title: string;
  hint: string;
};
