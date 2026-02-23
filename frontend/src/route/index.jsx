import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../Pages/Login";
import LoginSelector from "../Pages/LoginSelector";
import Register from "../Pages/Register";
import ForgotPassword from "../Pages/ForgotPassword";
import Dashboard from "../Pages/Dashboard";
import Logout from "../Component/Logout";
import SignToText from "../Pages/SignToText";
import TextToSign from "../Pages/TextToSign";
import LessonsPage from "../Pages/LessonsPage";
import LessonCategoryPage from "../Pages/LessonCategoryPage";
import PracticeSign from "../Pages/PracticeSign";
import Friends from "../Pages/Friends";
import VideoCall from "../Pages/VideoCall";
import AdminLogin from "../Pages/AdminLogin";
import AdminDashboard from "../Pages/AdminDashboard";
import CategorySignsPage from "../Pages/CategorySignsPage";
import AllSignsPage from "../Pages/AllSignsPage";
import SignQuiz from "../Pages/SignQuiz";
import LeaderboardPage from "../Pages/LeaderboardPage"; // ✅ NEW LEADERBOARD IMPORT

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index:true,
                element: <Register />
            },
            {
                path: "login",
                element: <LoginSelector />
            },
            {
                path: "login/user",
                element: <Login />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path:"dashboard",
                element:<Dashboard/>
            },
            {
                path:"logout",
                element:<Logout/>
            },
            {
                path:"sign-to-text",
                element:<SignToText/>
            },
            {
                path:"text-to-sign",
                element:<TextToSign/>
            },
            {
                path:"lesson",
                element:<LessonsPage/>
            },
            {
                path:"lesson/:categoryId",
                element:<LessonCategoryPage/>
            },
            { 
                path: "practice", 
                element: <PracticeSign/> 
            },
            {
                path:"friends",
                element:<Friends/>
            },
            {
                path:"call/:roomId",
                element:<VideoCall/>
            },
            {
                path: "quiz", 
                element: <SignQuiz />
            },
            {
                path: "leaderboard",        // ✅ NEW LEADERBOARD ROUTE
                element: <LeaderboardPage />
            }
        ]
    },
    {
        path: "/admin/login",
        element: <AdminLogin />
    },
    {
        path: "/admin/dashboard",
        element: <AdminDashboard />
    },
    {
        path: "/admin/category/:category", 
        element: <CategorySignsPage />
    },
    {
        path: "/admin/all-signs",        
        element: <AllSignsPage />
    }
]);

export default router;
