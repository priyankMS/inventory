import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getAccessToken = () => {
  return sessionStorage.getItem("accessToken");
};

export const bankApi = createApi({
  reducerPath: "bankApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/",
    prepareHeaders: (headers) => {
      const token = getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createBank: builder.mutation({
      query: (newbank) => ({
        url: "/banks/create",
        method: "POST",
        body: newbank,
      }),
    }),
    getAllBank: builder.query({
      query: () => ({
        url: "/banks/getall",
        method: "GET",
      }),
    }),
    getBankById: builder.query({
      query: (id) => ({
        url: `/banks/getone/${id}`,
        method: "GET",
      }),
    }),
    updateBank: builder.mutation({
      query: ({ id, updateBank }) => ({
        url: `/banks/update/${id}`,
        method: "PUT",
        body: updateBank,
      }),
    }),
  }),
});

export const {
  useCreateBankMutation,
  useGetAllBankQuery,
  useGetBankByIdQuery,
  useUpdateBankMutation,
} = bankApi;
