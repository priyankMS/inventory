import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const signupApi = createApi({
  reducerPath: "signupApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (newUser) => ({
        url: "/user/signup",
        method: "POST",
        body: newUser,
      }),
    }),
  }),
});

export const { useSignupMutation } = signupApi;
