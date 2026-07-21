
import {createBrowserRouter} from 'react-router-dom'
import Home from '../pages/Home'
import Navbar from '../components/layout/Navbar'
import Login from '../features/auth/pages/Login'
import SignUp from '../features/auth/pages/SignUp'
import VerifyOtp from '../features/auth/pages/verifyOtp'
import ForgotPassword from '../features/auth/pages/forgotPassword'
import ForgotPasswordOTP from '../features/auth/pages/forgotPasswordOTP'
import ResetPassword from '../features/auth/pages/resetPassword'

export const routes = createBrowserRouter([
    {
        path:"/",
        element: <><Navbar/><Home/></>
    },
    {
        path:"/login",
        element:<><Navbar/><Login></Login></>
    },
    {
        path:"/signup",
        element:<><Navbar/><SignUp></SignUp></>
    },
    {
        path:"/verify-otp",
        element:<><Navbar></Navbar><VerifyOtp></VerifyOtp></>
    },
    {
        path:"/forgot-password",
        element:<><Navbar></Navbar><ForgotPassword></ForgotPassword></>
    },
    {
        path:"/forgot-password-verify-otp",
        element:<><Navbar></Navbar><ForgotPasswordOTP></ForgotPasswordOTP></>
    },
    {
        path:"/reset-password",
        element:<><Navbar></Navbar><ResetPassword></ResetPassword></>
    }
])
