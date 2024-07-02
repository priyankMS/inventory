import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const signupApi = createApi({
  reducerPath: "signupApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (newUser) => ({
        url: "/user/signup",
        method: "POST",
        body: newUser,
      }),
    }),
    getAllUserlist: builder.query({
      query: () => ({
        url: "/user/getall",
        method: "GET",
      }),
    }),

    getUserById: builder.query({
      query: ({ id }) => {
        return {
          url: `/user/getone/${id}`,
          method: "GET",
          responseHandler: (response) => {
            return response.json().then((data) => {
              return data;
            });
          },
        };
      },
    }),

    updateUser: builder.mutation({
      query: ({ id, updatedUser }) => {
        return {
          url: `/user/update/${id}`,
          method: "PATCH",
          body: updatedUser,
        };
      },
    }),
  }),
});

export const {
  useSignupMutation,
  useGetAllUserlistQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} = signupApi;
