// src/App.jsx
import "./App.css";
import { Outlet } from "react-router-dom";
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
    <CallProvider user={user}>
      <div>
        <Outlet />
      </div>
    </CallProvider>
  );
}

export default App;
