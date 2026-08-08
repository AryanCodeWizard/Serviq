import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-slate-950 antialiased">
      <Navbar />
      <main
        className="flex-1 pt-16 transition-opacity duration-200"
        aria-label="Main content"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;