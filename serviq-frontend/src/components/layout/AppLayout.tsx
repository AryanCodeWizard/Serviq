import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const AppLayout = () => {
    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#111111]">
            <Navbar />
            <Outlet />
        </div>
    );
};

export default AppLayout;