import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { signupApi } from "../services/Singup";
import { loginApi } from "../services/Login";
import { productApi } from "../services/Productlist";
import { orderlistApi } from "../services/Orderlist";
import { resetPasswordApi } from "../services/ResetPassword";
import { companyApi } from "../services/Company";
import authReducer from "../services/slice/authslice";

export const store = configureStore({
  reducer: {
    auth:authReducer,
    [signupApi.reducerPath]: signupApi.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [resetPasswordApi.reducerPath]: resetPasswordApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [orderlistApi.reducerPath]: orderlistApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      signupApi.middleware,
      loginApi.middleware,
      resetPasswordApi.middleware,
      productApi.middleware,
      orderlistApi.middleware,
      companyApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
export type Rootstate = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
