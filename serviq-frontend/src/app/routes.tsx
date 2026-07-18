
import {createBrowserRouter} from 'react-router-dom'
import Home from '../pages/Home'
import Navbar from '../components/layout/Navbar'
import Login from '../features/auth/pages/Login'
import SignUp from '../features/auth/pages/SignUp'

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
])
