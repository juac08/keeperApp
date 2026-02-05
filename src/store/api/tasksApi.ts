import { apiSlice } from "./apiSlice";
import type {
  Activity,
  Card,
  Comment,
  Priority,
  Status,
  Subtask,
} from "@/types";

const normalizePriority = (value: unknown): Priority => {
  const key = String(value ?? "medium").toLowerCase();
  if (key.startsWith("hi")) return "High";
  if (key.startsWith("lo")) return "Low";
  return "Medium";
};

const mapCommentFromApi = (comment: any): Comment => {
  const createdAt =
    comment?.createdAt ??
    comment?.created_at ??
    comment?.created_at ??
    new Date().toISOString();

  const authorId =
    comment?.authorId ??
    comment?.userId ??
    comment?.author?.id ??
    comment?.user?.id ??
    "";

  const authorName =
    comment?.authorName ??
    comment?.author?.name ??
    comment?.user?.name ??
    comment?.userName ??
    undefined;

  return {
    id: comment?.id ?? String(Date.now()),
    text: comment?.text ?? comment?.body ?? "",
    authorId,
    authorName,
    createdAt,
  };
};

const mapTaskFromApi = (task: any): Card => {
  const normalizeSubtasks = Array.isArray(task?.subtasks)
    ? task.subtasks.map((subtask: any) => ({
        id:
          subtask.id ??
          `subtask-${Math.random().toString(16).slice(2)}-${Date.now()}`,
        text: subtask.title ?? subtask.text ?? "",
        completed: Boolean(subtask.completed),
      }))
    : [];

  const normalizeComments = Array.isArray(task?.comments)
    ? task.comments.map((comment: any) => mapCommentFromApi(comment))
    : [];

  const normalizeActivities = Array.isArray(task?.activities)
    ? task.activities.map((activity: any) => ({
        id: activity.id ?? String(activity?.id ?? Date.now()),
        type: (activity.type ?? "created") as Activity["type"],
        authorId: activity.authorId,
        timestamp: activity.timestamp ?? new Date().toISOString(),
        metadata: activity.metadata ?? {},
      }))
    : [];

  const normalizeTags = Array.isArray(task?.tags)
    ? task.tags.map((tag: any) => (typeof tag === "string" ? tag : tag.id))
    : [];

  const blockedValue =
    task.blocked ??
    task.isBlocked ??
    task.is_blocked ??
    task.blockedStatus ??
    false;
  const blockedReasonValue =
    task.blockedReason ??
    task.blocked_reason ??
    task.blockedReasonText ??
    "";

  return {
    id: task.id ?? String(Date.now()),
    title: task.title ?? "Untitled",
    content: task.description ?? task.content ?? "",
    status: (task.status ?? "todo") as Status,
    priority: normalizePriority(task.priority),
    blocked: Boolean(blockedValue),
    blockedReason: blockedValue ? String(blockedReasonValue ?? "") : "",
    dueDate: task.dueDate ?? "",
    tags: normalizeTags,
    assigneeId: task.assigneeId ?? "",
    subtasks: normalizeSubtasks,
    comments: normalizeComments,
    activities: normalizeActivities,
    createdAt: task.createdAt ?? new Date().toISOString(),
    updatedAt: task.updatedAt ?? new Date().toISOString(),
  };
};

const mapCardToApiPayload = (
  task: Partial<Card> & { boardId?: string },
): Record<string, any> => {
  const payload: Record<string, any> = {};

  if (task.boardId !== undefined) {
    payload.boardId = task.boardId;
  }

  if (task.title !== undefined) {
    payload.title = task.title;
  }

  if (task.content !== undefined) {
    payload.description = task.content;
  }

  if (task.status !== undefined) {
    payload.status = task.status;
  }

  if (task.priority !== undefined) {
    payload.priority = String(task.priority).toLowerCase();
  }

  if (task.blocked !== undefined) {
    payload.blocked = task.blocked;
    payload.isBlocked = task.blocked;
    payload.is_blocked = task.blocked;
  }

  if (task.blockedReason !== undefined || task.blocked !== undefined) {
    const reason = task.blocked ? (task.blockedReason ?? "") : null;
    payload.blockedReason = reason;
    payload.blocked_reason = reason;
  }

  if (task.dueDate !== undefined) {
    payload.dueDate = task.dueDate ? task.dueDate : null;
  }

  if (task.tags !== undefined) {
    payload.tags = task.tags;
  }

  if (task.assigneeId !== undefined) {
    payload.assigneeId = task.assigneeId || null;
  }

  if (task.subtasks !== undefined) {
    payload.subtasks = task.subtasks.map((subtask) => {
      const isTemporary = subtask.id?.startsWith("subtask-");
      const base: Record<string, any> = {
        title: subtask.text,
        completed: subtask.completed,
      };
      if (!isTemporary && subtask.id) {
        base.id = subtask.id;
      }
      return base;
    });
  }

  return payload;
};

export const tasksApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Card[], string | undefined>({
      async queryFn(boardId, _api, _options, fetchWithBQ) {
        if (!boardId) {
          return { data: [] };
        }

        const response = await fetchWithBQ(`/boards/${boardId}`);

        if (response.error) {
          return { error: response.error };
        }

        const board = response.data as any;
        const tasks = Array.isArray(board?.tasks)
          ? board.tasks
              .filter((task: any) => !task?.archived)
              .map(mapTaskFromApi)
          : [];

        return { data: tasks };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Task" as const, id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),
    getTask: builder.query<Card, string>({
      query: (id) => `/tasks/${id}`,
      transformResponse: (response: any) => mapTaskFromApi(response),
      providesTags: (_result, _error, id) => [{ type: "Task", id }],
    }),
    createTask: builder.mutation<Card, Partial<Card> & { boardId?: string }>({
      query: (task) => ({
        url: "/tasks",
        method: "POST",
        body: mapCardToApiPayload(task),
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    updateTask: builder.mutation<Card, { id: string; updates: Partial<Card> }>({
      query: ({ id, updates }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: mapCardToApiPayload(updates),
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    archiveTask: builder.mutation<Card, { id: string; archived: boolean }>({
      query: ({ id, archived }) => ({
        url: `/tasks/${id}/archive`,
        method: "PATCH",
        body: { archived },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),
    createSubtask: builder.mutation<Subtask, { taskId: string; text: string }>({
      query: ({ taskId, text }) => ({
        url: `/tasks/${taskId}/subtasks`,
        method: "POST",
        body: { title: text },
      }),
      transformResponse: (response: any): Subtask => ({
        id: response.id,
        text: response.title ?? response.text ?? "",
        completed: Boolean(response.completed),
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
      ],
    }),
    updateSubtask: builder.mutation<
      Subtask,
      { taskId: string; subtaskId: string; updates: Partial<Subtask> }
    >({
      query: ({ taskId, subtaskId, updates }) => {
        const payload: Record<string, any> = {};
        if (updates.text !== undefined) {
          payload.title = updates.text;
        }
        if (updates.completed !== undefined) {
          payload.completed = updates.completed;
        }
        return {
          url: `/tasks/${taskId}/subtasks/${subtaskId}`,
          method: "PUT",
          body: payload,
        };
      },
      transformResponse: (response: any): Subtask => ({
        id: response.id,
        text: response.title ?? response.text ?? "",
        completed: Boolean(response.completed),
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
      ],
    }),
    deleteSubtask: builder.mutation<
      void,
      { taskId: string; subtaskId: string }
    >({
      query: ({ taskId, subtaskId }) => ({
        url: `/tasks/${taskId}/subtasks/${subtaskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
      ],
    }),
    createComment: builder.mutation<Comment, { taskId: string; text: string }>({
      query: ({ taskId, text }) => ({
        url: `/tasks/${taskId}/comments`,
        method: "POST",
        body: { text },
      }),
      transformResponse: (response: any): Comment =>
        mapCommentFromApi(response),
      invalidatesTags: (_result, _error, { taskId }) => [
        { type: "Task", id: taskId },
      ],
    }),
    getTaskActivities: builder.query<any[], string>({
      query: (taskId) => `/tasks/${taskId}/activities`,
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useArchiveTaskMutation,
  useCreateSubtaskMutation,
  useUpdateSubtaskMutation,
  useDeleteSubtaskMutation,
  useCreateCommentMutation,
  useGetTaskActivitiesQuery,
} = tasksApi;
