import { apiSlice } from "./apiSlice";
import type { User } from "./authApi";

// Using User type as Assignee since they're the same in the API
export type Assignee = User;

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
