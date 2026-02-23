// src/App.jsx
import "./App.css";
import { Outlet } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';  // 👈 NEW IMPORT
import CallProvider from "./Provider/CallProvider";

function App() {
  // get current logged-in user (adjust if you already have auth context)
  let user = null;
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      user = JSON.parse(storedUser);
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }

  return (
    <GoogleOAuthProvider clientId="144058274170-8i3k6nneb9s97dlhhl8ii8lmoas3kvj0.apps.googleusercontent.com">  {/* 👈 WRAP EVERYTHING */}
      <CallProvider user={user}>
        <div>
          <Outlet />
        </div>
      </CallProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
