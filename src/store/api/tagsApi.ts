import { apiSlice } from "./apiSlice";
import type { Tag } from "@/types";

export const tagsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query<Tag[], string | undefined>({
      query: (boardId) => (boardId ? `/tags?boardId=${boardId}` : "/tags"),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tag" as const, id })),
              { type: "Tag", id: "LIST" },
            ]
          : [{ type: "Tag", id: "LIST" }],
    }),
    createTag: builder.mutation<Tag, Partial<Tag> & { boardId?: string }>({
      query: (tag) => ({
        url: "/tags",
        method: "POST",
        body: tag,
      }),
      invalidatesTags: [{ type: "Tag", id: "LIST" }],
    }),
    updateTag: builder.mutation<Tag, { id: string; updates: Partial<Tag> }>({
      query: ({ id, updates }) => ({
        url: `/tags/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tag", id },
        { type: "Tag", id: "LIST" },
      ],
    }),
    deleteTag: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Tag", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tagsApi;
