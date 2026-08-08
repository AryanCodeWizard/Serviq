
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../features/auth/pages/Login";
import SignUp from "../features/auth/pages/SignUp";
import VerifyOtp from "../features/auth/pages/verifyOtp";
import ForgotPassword from "../features/auth/pages/forgotPassword";
import ForgotPasswordOTP from "../features/auth/pages/forgotPasswordOTP";
import ResetPassword from "../features/auth/pages/resetPassword";
import AppLayout from "../components/layout/AppLayout";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";
import Dashboard from "../features/dashboard/pages/Dashboard";
import NotFound from "../pages/NotFound";
import Bookings from "../features/booking/pages/Bookings";
import BookingDetails from "../features/booking/pages/BookingDetails";
import Services from "../features/services/pages/Services";

export const routes = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/dashboard",
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />,
                    },
                ],
            },
            {
                path: "/services",
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <Services />,
                    },
                ],
            },
            {
                path: "/bookings",
                element: <ProtectedRoute />,
                children: [
                    {
                        index: true,
                        element: <Bookings />,
                    },
                    {
                        path: ":bookingId",
                        element: <BookingDetails />,
                    },
                ],
            },
        ],
    },
    {
        element: <PublicRoute />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <SignUp />,
            },
            {
                path: "/verify-otp",
                element: <VerifyOtp />,
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "/forgot-password-verify-otp",
                element: <ForgotPasswordOTP />,
            },
            {
                path: "/reset-password",
                element: <ResetPassword />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
])
