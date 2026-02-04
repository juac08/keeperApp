import { apiSlice } from "./apiSlice";
import type { User } from "@/types";

export type OrganizationRole = "admin" | "member";

export type OrganizationMember = {
  id: string;
  organizationId: string;
  userId: string;
  user: User;
  role: OrganizationRole;
  createdAt: string;
  updatedAt: string;
};

export const organizationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationMembers: builder.query<OrganizationMember[], string>({
      query: (organizationId) => `/organizations/${organizationId}/members`,
      transformResponse: (
        response: { members: OrganizationMember[] } | OrganizationMember[],
      ) => (Array.isArray(response) ? response : response.members),
      providesTags: ["User"],
    }),
    addOrganizationMember: builder.mutation<
      OrganizationMember,
      { organizationId: string; email: string; role: OrganizationRole }
    >({
      query: ({ organizationId, email, role }) => ({
        url: `/organizations/${organizationId}/members`,
        method: "POST",
        body: { email, role },
      }),
      invalidatesTags: (result, error) => (error ? [] : ["User"]),
    }),
    updateOrganizationMemberRole: builder.mutation<
      OrganizationMember,
      { organizationId: string; userId: string; role: OrganizationRole }
    >({
      query: ({ organizationId, userId, role }) => ({
        url: `/organizations/${organizationId}/members/${userId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
    removeOrganizationMember: builder.mutation<
      void,
      { organizationId: string; userId: string }
    >({
      query: ({ organizationId, userId }) => ({
        url: `/organizations/${organizationId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetOrganizationMembersQuery,
  useAddOrganizationMemberMutation,
  useUpdateOrganizationMemberRoleMutation,
  useRemoveOrganizationMemberMutation,
} = organizationsApi;
