import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (newUser) => ({
        url: "/auth/login",
        method: "POST",
        body: newUser,
        responseHandler: (response) => response.text(),
      }),
    }),
  }),
});

export const { useLoginMutation } = loginApi;
