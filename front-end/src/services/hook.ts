import { useSelector } from "react-redux";
import { AppDispatch, Rootstate } from "../app/store";
import { useDispatch } from "react-redux";



export const useAppSelectore = useSelector.withTypes<Rootstate>()
export  const useAppDispatch =  useDispatch.withTypes<AppDispatch>()