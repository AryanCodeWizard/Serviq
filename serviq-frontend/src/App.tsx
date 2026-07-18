import { RouterProvider } from "react-router-dom";
import "./App.css";
import { routes } from "./app/routes";
import {Toaster} from 'react-hot-toast'

function App() {
  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] text-[#1A1A1A] antialiased">
      <RouterProvider router={routes} />
      <Toaster></Toaster>
    </div>
  );
}

export default App;