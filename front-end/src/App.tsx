import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./auth/Login";
import SignUp from "./auth/Singup"; // Corrected typo in filename
import AppBar from "./componets/AppBar"; // Corrected typo in filename
import {ForgotPassword} from "./auth/ForgotPassword"; // Removed braces
import {ResetPassword} from "./auth/ResetPassword"; // Removed braces
import PrivateRoute from "./PrivateRoute";
import { useEffect, useState } from "react";
import 'rsuite/dist/rsuite.min.css';
import { refreshToken } from "./functions/refreshToken";
import USerProfile from "./componets/userProfile/USerProfile";

const App = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkToken = async () => {
      const sessionToken = sessionStorage.getItem("accessToken");
      const localToken = localStorage.getItem("accessToken");

      if (!sessionToken && localToken) {
       await   refreshToken(navigate);
      if (window.location.pathname.startsWith('/dashboard')) {
        navigate('/dashboard');
        } else if (!sessionToken &&!localToken) {
          navigate('/');
        }
      }
      setLoading(false);
    };

    checkToken();
  }, [navigate]);

  



  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<PrivateRoute><AppBar /></PrivateRoute>} />
      <Route path="/signup" element={<SignUp />} /> {/* Not protected */}
      <Route path="/forgotpassword" element={<ForgotPassword />} /> {/* Not protected */}
      <Route path="/resetpassword" element={<ResetPassword />} /> {/* Not protected */}
      <Route path="/profile" element={<PrivateRoute><USerProfile /></PrivateRoute>} />
    </Routes>
  );
};

export default App;
