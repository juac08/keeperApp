import { apiSlice } from "./apiSlice";
import type { Board } from "@/types";

export const boardsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBoards: builder.query<Board[], void>({
      query: () => "/boards",
      providesTags: ["Board"],
    }),
    getBoard: builder.query<Board, string>({
      query: (id) => `/boards/${id}`,
      providesTags: (result, error, id) => [{ type: "Board", id }],
    }),
    createBoard: builder.mutation<
      Board,
      Omit<Board, "id" | "createdAt" | "updatedAt">
    >({
      query: (board) => ({
        url: "/boards",
        method: "POST",
        body: board,
      }),
      invalidatesTags: ["Board"],
    }),
    updateBoard: builder.mutation<
      Board,
      { id: string; updates: Partial<Board> }
    >({
      query: ({ id, updates }) => ({
        url: `/boards/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Board", id },
        "Board",
      ],
    }),
    deleteBoard: builder.mutation<void, string>({
      query: (id) => ({
        url: `/boards/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Board", { type: "Task", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBoardsQuery,
  useGetBoardQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useDeleteBoardMutation,
} = boardsApi;
