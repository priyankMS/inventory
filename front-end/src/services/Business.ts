import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getAccessToken = () => {
  return sessionStorage.getItem("accessToken");
};

export const businessApi = createApi({
  reducerPath: "businessApi",
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
    createBusiness: builder.mutation({
      query: (newbank) => ({
        url: "/business/create",
        method: "POST",
        body: newbank,
      }),
    }),
    getAllBusiness: builder.query({
      query: () => ({
        url: "/business/getAll",
        method: "GET",
      }),
    }),
    getBusinessById: builder.query({
      query: (id) => {
        return {
          url: `/business/getOne/${id}`,
          method: "GET",
        };
      },
    }),
    updateBusiness: builder.mutation({
      query: ({ id, updateBusiness }) => {
        return {
          url: `/business/update/${id}`,
          method: "PUT",
          body: updateBusiness,
        };
      },
    }),
  }),
});

export const {
  useCreateBusinessMutation,
  useGetAllBusinessQuery,
  useGetBusinessByIdQuery,
  useUpdateBusinessMutation,
} = businessApi;
