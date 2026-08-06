import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

const PublicRoute = () => {
    const isAuthenticated = useAppSelector((state) => Boolean(state.auth.session?.accessToken));

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;