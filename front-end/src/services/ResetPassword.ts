import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const resetPasswordApi = createApi({
  reducerPath: "resetPasswordApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/user/",
  }),
  endpoints: (builder) => ({
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: `forgotpassword/${email}`,
        method: "GET",
        responseHandler: (response) => response.text(),
      }),
    }),
    resetPassword: builder.mutation({
      query: (userData) => ({
        url: "resetpassword",
        method: "POST",
        body: userData,
        responseHandler: (response) => response.text(),
      }),
    }),
  }),
});

export const { useForgotPasswordMutation, useResetPasswordMutation } =
  resetPasswordApi;
