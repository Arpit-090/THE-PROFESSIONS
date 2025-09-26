import { useContext } from "react";
import { Navigate } from "react-router-dom";
import {AuthContext} from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Agar user logged in nahi hai to redirect to login
    return <Navigate to="/login" replace />;
  }

  // Agar logged in hai to component show karo
  return children;
};

export default ProtectedRoute;
