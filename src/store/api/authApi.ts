import { apiSlice } from "./apiSlice";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  organizationRole?: "admin" | "member";
  isSuperAdmin?: boolean;
  organizationId?: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("auth_token", data.token);
          // Invalidate all cached data after successful login
          dispatch(apiSlice.util.resetApiState());
        } catch (error) {
          // Error handled in component
          console.error("Login failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("auth_token", data.token);
          // Invalidate all cached data after successful registration
          dispatch(apiSlice.util.resetApiState());
        } catch (error) {
          // Error handled in component
          console.error("Registration failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),
    getMe: builder.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      queryFn: () => {
        localStorage.removeItem("auth_token");
        return { data: undefined };
      },
      async onQueryStarted(_arg, { dispatch }) {
        dispatch(apiSlice.util.resetApiState());
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
