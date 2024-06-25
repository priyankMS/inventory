import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getAccessToken = () => {
  return sessionStorage.getItem("accessToken");
};

export const orderlistApi = createApi({
  reducerPath: "orderlistApi",
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
    createOrderlist: builder.mutation({
      query: (newOrder) => ({
        url: "/order/create",
        method: "POST",
        body: newOrder,
      }),
    }),

    getAllOrderlist: builder.query({
      query: () => ({
        url: "/order/getall",
        method: "GET",
      }),
    }),

    getOrderById: builder.query({
      query: (id) => ({
        url: `/order/getone/${id}`,
        method: "GET",
      }),
    }),

    getAllData: builder.query({
      query: () => ({
        url: "/order/allData",
        method: "GET",
      }),
    }),

    createInvoice: builder.mutation({
      query: ({ id, newInvoice }) => ({
        url: `/order/invoice/${id}`,
        method: "POST",
        body: newInvoice,
      }),
    }),


  
  }),
});

export const {
  useCreateOrderlistMutation,
  useGetAllOrderlistQuery,
  useGetOrderByIdQuery,
  useCreateInvoiceMutation,
  useGetAllDataQuery,
} = orderlistApi;
