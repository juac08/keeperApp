import { apiSlice } from "./apiSlice";
import type {
  Activity,
  Card,
  Comment,
  Priority,
  Status,
  Subtask,
} from "@/types";
import type { RootState } from "@/store/store";

const normalizePriority = (value: unknown): Priority => {
  const key = String(value ?? "medium").toLowerCase();
  if (key.startsWith("hi")) return "High";
  if (key.startsWith("lo")) return "Low";
  return "Medium";
};

type ApiComment = {
  id?: string;
  text?: string;
  body?: string;
  authorId?: string;
  userId?: string;
  author?: { id?: string; name?: string };
  user?: { id?: string; name?: string };
  authorName?: string;
  userName?: string;
  createdAt?: string;
  created_at?: string;
};

type ApiSubtask = {
  id?: string;
  title?: string;
  text?: string;
  completed?: boolean;
};

type ApiActivity = {
  id?: string | number;
  type?: Activity["type"];
  authorId?: string;
  timestamp?: string;
  metadata?: Record<string, any>;
};

type ApiTask = {
  id?: string;
  title?: string;
  description?: string;
  content?: string;
  status?: Status;
  priority?: string | Priority;
  blocked?: boolean;
  isBlocked?: boolean;
  is_blocked?: boolean;
  blockedStatus?: boolean;
  blockedReason?: string;
  blocked_reason?: string;
  blockedReasonText?: string;
  dueDate?: string;
  tags?: Array<{ id?: string } | string>;
  assigneeId?: string;
  subtasks?: ApiSubtask[];
  comments?: ApiComment[];
  activities?: ApiActivity[];
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
};

type ApiBoard = {
  tasks?: ApiTask[];
};

const mapCommentFromApi = (comment: ApiComment): Comment => {
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

const mapTaskFromApi = (task: ApiTask): Card => {
  const normalizeSubtasks = Array.isArray(task?.subtasks)
    ? task.subtasks.map((subtask: ApiSubtask) => ({
        id:
          subtask.id ??
          `subtask-${Math.random().toString(16).slice(2)}-${Date.now()}`,
        text: subtask.title ?? subtask.text ?? "",
        completed: Boolean(subtask.completed),
      }))
    : [];

  const normalizeComments = Array.isArray(task?.comments)
    ? task.comments.map((comment: ApiComment) => mapCommentFromApi(comment))
    : [];

  const normalizeActivities = Array.isArray(task?.activities)
    ? task.activities.map((activity: ApiActivity): Activity => {
        const createdAt = activity.timestamp ?? new Date().toISOString();
        return {
          id: String(activity.id ?? Date.now()),
          type: String(activity.type ?? "created"),
          taskId: String(task.id ?? ""),
          userId: String(activity.authorId ?? ""),
          createdAt,
          updatedAt: createdAt,
          authorId: activity.authorId,
          timestamp: activity.timestamp ?? createdAt,
          metadata: activity.metadata ?? {},
        };
      })
    : [];

  const normalizeTags = Array.isArray(task?.tags)
    ? task.tags.map((tag) => (typeof tag === "string" ? tag : tag?.id ?? ""))
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

const updateQueryData = apiSlice.util.updateQueryData as any;

const getActiveBoardId = (state: RootState, fallback?: string) =>
  fallback ?? state.activeBoard.activeBoardId ?? undefined;

const applyCardUpdates = (draft: Card, updates: Partial<Card>) => {
  if (updates.title !== undefined) draft.title = updates.title;
  if (updates.content !== undefined) draft.content = updates.content;
  if (updates.status !== undefined) draft.status = updates.status;
  if (updates.priority !== undefined)
    draft.priority = normalizePriority(updates.priority);
  if (updates.blocked !== undefined) draft.blocked = updates.blocked;
  if (updates.blockedReason !== undefined || updates.blocked !== undefined) {
    draft.blockedReason = draft.blocked ? updates.blockedReason ?? "" : "";
  }
  if (updates.dueDate !== undefined) draft.dueDate = updates.dueDate ?? "";
  if (updates.tags !== undefined) draft.tags = updates.tags;
  if (updates.assigneeId !== undefined)
    draft.assigneeId = updates.assigneeId ?? "";
  if (updates.subtasks !== undefined) draft.subtasks = updates.subtasks;
  if (updates.comments !== undefined) draft.comments = updates.comments;
  if (updates.activities !== undefined) draft.activities = updates.activities;
  draft.updatedAt = new Date().toISOString();
};

const buildOptimisticCard = (
  task: Partial<Card>,
  id: string,
): Card => ({
  id,
  title: task.title ?? "Untitled",
  content: task.content ?? "",
  status: (task.status ?? "todo") as Status,
  priority: normalizePriority(task.priority),
  blocked: Boolean(task.blocked),
  blockedReason: task.blocked ? task.blockedReason ?? "" : "",
  dueDate: task.dueDate ?? "",
  tags: task.tags ?? [],
  assigneeId: task.assigneeId ?? "",
  subtasks: task.subtasks ?? [],
  comments: task.comments ?? [],
  activities: task.activities ?? [],
  createdAt: task.createdAt ?? new Date().toISOString(),
  updatedAt: task.updatedAt ?? new Date().toISOString(),
});

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

        const board = response.data as ApiBoard;
        const tasks = Array.isArray(board?.tasks)
          ? board.tasks.filter((task) => !task?.archived).map(mapTaskFromApi)
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
      transformResponse: (response: ApiTask) => mapTaskFromApi(response),
      providesTags: (_result, _error, id) => [{ type: "Task", id }],
    }),
    createTask: builder.mutation<Card, Partial<Card> & { boardId?: string }>({
      query: (task) => ({
        url: "/tasks",
        method: "POST",
        body: mapCardToApiPayload(task),
      }),
      async onQueryStarted(task, { dispatch, queryFulfilled, getState }) {
        const boardId = getActiveBoardId(getState() as RootState, task.boardId);
        if (!boardId) {
          return;
        }

        const tempId = `temp-${Date.now()}`;
        const optimisticCard = buildOptimisticCard(task, tempId);

        const patchResult = dispatch(
          updateQueryData(
            "getTasks",
            boardId,
            (draft: Card[]) => {
              draft.unshift(optimisticCard);
            },
          ),
        );

        try {
          const { data } = await queryFulfilled;
          const normalized = mapTaskFromApi(data);

          dispatch(
            updateQueryData(
              "getTasks",
              boardId,
              (draft: Card[]) => {
                const index = draft.findIndex((card) => card.id === tempId);
                if (index >= 0) {
                  draft[index] = normalized;
                } else {
                  draft.unshift(normalized);
                }
              },
            ),
          );

          dispatch(
            updateQueryData(
              "getTask",
              normalized.id,
              () => normalized,
            ),
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    updateTask: builder.mutation<Card, { id: string; updates: Partial<Card> }>({
      query: ({ id, updates }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: mapCardToApiPayload(updates),
      }),
      async onQueryStarted(
        { id, updates },
        { dispatch, queryFulfilled, getState },
      ) {
        const boardId = getActiveBoardId(getState() as RootState);
        const patchResults = [];

        patchResults.push(
          dispatch(
            updateQueryData("getTask", id, (draft: Card) => {
              applyCardUpdates(draft, updates);
            }),
          ),
        );

        if (boardId) {
          patchResults.push(
            dispatch(
              updateQueryData(
                "getTasks",
                boardId,
                (draft: Card[]) => {
                  const card = draft.find((item) => item.id === id);
                  if (card) {
                    applyCardUpdates(card, updates);
                  }
                },
              ),
            ),
          );
        }

        try {
          const { data } = await queryFulfilled;
          const normalized = mapTaskFromApi(data);

          dispatch(
            updateQueryData(
              "getTask",
              normalized.id,
              () => normalized,
            ),
          );

          if (boardId) {
            dispatch(
              updateQueryData(
                "getTasks",
                boardId,
                (draft: Card[]) => {
                  const index = draft.findIndex(
                    (item) => item.id === normalized.id,
                  );
                  if (index >= 0) {
                    draft[index] = normalized;
                  }
                },
              ),
            );
          }
        } catch {
          patchResults.forEach((patch) => patch.undo());
        }
      },
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
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const boardId = getActiveBoardId(getState() as RootState);
        if (!boardId) {
          return;
        }

        const patchResult = dispatch(
          updateQueryData(
            "getTasks",
            boardId,
            (draft: Card[]) => {
              const index = draft.findIndex((card) => card.id === id);
              if (index >= 0) {
                draft.splice(index, 1);
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    archiveTask: builder.mutation<Card, { id: string; archived: boolean }>({
      query: ({ id, archived }) => ({
        url: `/tasks/${id}/archive`,
        method: "PATCH",
        body: { archived },
      }),
      async onQueryStarted(
        { id, archived },
        { dispatch, queryFulfilled, getState },
      ) {
        const boardId = getActiveBoardId(getState() as RootState);
        if (!boardId) {
          return;
        }

        const patchResult = dispatch(
          updateQueryData(
            "getTasks",
            boardId,
            (draft: Card[]) => {
              if (archived) {
                const index = draft.findIndex((card) => card.id === id);
                if (index >= 0) {
                  draft.splice(index, 1);
                }
                return;
              }
              const card = draft.find((item) => item.id === id);
              if (card) {
                (card as any).archived = false;
              }
            },
          ),
        );

        try {
          const { data } = await queryFulfilled;
          const normalized = mapTaskFromApi(data);

          dispatch(
            updateQueryData(
              "getTask",
              normalized.id,
              () => normalized,
            ),
          );
        } catch {
          patchResult.undo();
        }
      },
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
    getTaskActivities: builder.query<Activity[], string>({
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
