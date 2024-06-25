import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getAccessToken = () => {
  return sessionStorage.getItem("accessToken");
};

export const productApi = createApi({
  reducerPath: "productApi",
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
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/product/create",
        method: "POST",
        body: newProduct,
      }),
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: "/product/findall",
        method: "GET",
      }),
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: `/product/findone/${id}`,
        method: "GET",
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, updatedProduct }) => ({
        url: `/product/updateproducts/${id}`,
        method: "PUT",
        body: updatedProduct,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/deleteone/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
