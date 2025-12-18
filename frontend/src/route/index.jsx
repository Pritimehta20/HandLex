import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Dashboard from "../Pages/Dashboard";
import Logout from "../Component/Logout";
import SignToText from "../Pages/SignToText";
import TextToSign from "../Pages/TextToSign";
import LessonsPage from "../Pages/LessonsPage";
import LessonCategoryPage from "../Pages/LessonCategoryPage";
import PracticeSign from "../Pages/PracticeSign";
import Friends from "../Pages/Friends";
import VideoCall from "../Pages/VideoCall";

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
                element: <Login />
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
            }
        ]
    }
]);
export default router;