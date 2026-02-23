import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear stored auth tokens and user data
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    
    // Progress data (lessonProgress_userId, practiceWeakSummary_userId) is kept
    // so when user logs back in, they see their previous progress

    // Redirect to login page immediately after logout
    navigate("/login", { replace: true });
  }, [navigate]);

  return null; // No UI needed; redirect happens immediately
};

export default Logout;
