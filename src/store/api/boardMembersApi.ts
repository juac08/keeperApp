import { apiSlice } from "./apiSlice";
import type { BoardMember, User } from "@/types";

export const boardMembersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBoardMembers: builder.query<BoardMember[], string>({
      query: (boardId) => `/boards/${boardId}/members`,
      transformResponse: (
        response: { members: BoardMember[] } | BoardMember[],
      ) => {
        // Handle both response formats
        return Array.isArray(response) ? response : response.members;
      },
      providesTags: (_result, _error, boardId) => [
        { type: "BoardMember" as const, id: boardId },
      ],
    }),
    addBoardMember: builder.mutation<
      BoardMember,
      { boardId: string; userId: string; role?: string }
    >({
      query: ({ boardId, userId, role = "member" }) => ({
        url: `/boards/${boardId}/members`,
        method: "POST",
        body: { userId, role },
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "BoardMember" as const, id: boardId },
      ],
    }),
    removeBoardMember: builder.mutation<
      void,
      { boardId: string; userId: string }
    >({
      query: ({ boardId, userId }) => ({
        url: `/boards/${boardId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "BoardMember" as const, id: boardId },
      ],
    }),
    updateBoardMemberRole: builder.mutation<
      BoardMember,
      { boardId: string; userId: string; role: string }
    >({
      query: ({ boardId, userId, role }) => ({
        url: `/boards/${boardId}/members/${userId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (_result, _error, { boardId }) => [
        { type: "BoardMember" as const, id: boardId },
      ],
    }),
    searchUsers: builder.query<User[], string>({
      query: (email) => `/users/search?q=${encodeURIComponent(email)}`,
      transformResponse: (response: { users: User[] } | User[]) => {
        // Handle both response formats
        return Array.isArray(response) ? response : response.users;
      },
    }),
  }),
});

export const {
  useGetBoardMembersQuery,
  useAddBoardMemberMutation,
  useRemoveBoardMemberMutation,
  useUpdateBoardMemberRoleMutation,
  useSearchUsersQuery,
} = boardMembersApi;
