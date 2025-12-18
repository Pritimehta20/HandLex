import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear stored auth tokens or user data
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Redirect to login page immediately after logout
    navigate("/login", { replace: true });
  }, [navigate]);

  return null; // No UI needed; redirect happens immediately
};

export default Logout;
