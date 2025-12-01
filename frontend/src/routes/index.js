import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Signup from "../pages/auth/Signup";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import Logout from "../pages/auth/Logout";
import Dashboard from "../pages/Dashboard";
import CreateAuth from "../pages/CreateAuth";
import AdminDashboard from "../pages/AdminDashboard";
import EPKDashboard from "../pages/EPKDashboard";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: 'home',
                element: <Home />
            },
            {
                path: 'signup',
                element: <Signup />
            },
            {
                path: 'login',
                element: <Login />
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword />
            },
            {
                path: 'verify-email',
                element: <VerifyEmail />
            },
            {
                path: 'logout',
                element: <Logout />
            },
            {
                path: 'dashboard',
                element: <AdminDashboard/> // Placeholder for dashboard
            },
            {
                path:'create-auth',
                element:<CreateAuth/>
            },
            {
                path:"manage-users",
                element:<AdminDashboard/>
            },
            {
                path:"manage-epks",
                element:<EPKDashboard/>
            }
        ]
    }
]);

export default router;