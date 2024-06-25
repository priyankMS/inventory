import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getAccessToken = () => {
  return sessionStorage.getItem("accessToken");
};

export const companyApi = createApi({
  reducerPath: "companyApi",
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
    createCompany: builder.mutation({
      query: (newCompany) => ({
        url: "/company/create",
        method: "POST",
        body: newCompany,
      }),
    }),

    getAllCompany: builder.query({
      query: () => ({
        url: "/company/getall",
        method: "GET",
      }),
    }),

    updateCompany: builder.mutation({
      query: ({ id, updatedCompany }) => {
        console.log('updateCompany:', id, updatedCompany); // <--- Add this line
        return {
          url: `/company/update/${id}`,
          method: "PUT",
          body: updatedCompany,
        };
      },
    }),

    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `/company/deletecompany/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCompanyMutation,
  useGetAllCompanyQuery,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;
