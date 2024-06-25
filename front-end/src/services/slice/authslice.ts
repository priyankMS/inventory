import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
    loading: boolean;
    token: string | null;
    user: string | null;
    error: string | null;
    theme:string;
}

const initialState:AuthState={
    loading :false,
    token:localStorage.getItem('accessToken') ||null,
    user:null,
    error:null,
    theme:localStorage.getItem('theme') || "light"
}

export const authSlice = createSlice({
    name: "auth",
    initialState,   
    reducers:{
        loginUser:(state,action:PayloadAction<string>)=>{
            
            state.token=action.payload;
         
            sessionStorage.setItem('accessToken',action.payload);
            localStorage.setItem('accessToken',action.payload);
        },
        logout:(state)=>{
            state.token=null;
            state.user=null;
            localStorage.removeItem('accessToken');
            sessionStorage.removeItem('accessToken');
        },
        forgotPassword:(state)=>{
            state.loading=true;
        },
        toggleTheme:(state)=>{
            state.theme=state.theme==="light" ? "dark":"light";
            localStorage.setItem('theme',state.theme)
        },
        setTheme:(state,action:PayloadAction<string>)=>{
            state.theme=action.payload
            localStorage.setItem('theme',action.payload)
        }
           
    }
})

export const {loginUser,logout,forgotPassword ,toggleTheme,setTheme}=authSlice.actions;
export default authSlice.reducer;