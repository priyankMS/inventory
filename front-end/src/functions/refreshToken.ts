import { message } from "antd";
import axios from "axios";

export async function refreshToken(navigate: any) {
  await axios
    .get("http://localhost:3000/auth/refresh", { withCredentials: true })
    .then((value) => {
      sessionStorage.setItem("accessToken", value.data);
   
    })
    .catch(() => {
      message.error("Session timeout login again");
      sessionStorage.clear();
      localStorage.removeItem("accessToken");
      navigate("/");
    });
  return sessionStorage.getItem("accessToken");
}
  