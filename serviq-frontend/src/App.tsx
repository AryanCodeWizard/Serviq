import { RouterProvider } from "react-router-dom";
import "./App.css";
import { routes } from "./app/routes";
import {Toaster} from 'react-hot-toast'


function App() {
  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] text-[#1A1A1A] antialiased">
      <RouterProvider router={routes} />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            fontFamily: "'Manrope', sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            borderRadius: "14px",
            padding: "14px 18px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
            maxWidth: "380px",
            border: "1px solid rgba(0,0,0,0.06)",
          },
          success: {
            duration: 3500,
            style: {
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
            },
            iconTheme: {
              primary: "#16a34a",
              secondary: "#f0fdf4",
            },
          },
          error: {
            duration: 4500,
            style: {
              background: "#fff5f5",
              color: "#991b1b",
              border: "1px solid #fecaca",
            },
            iconTheme: {
              primary: "#dc2626",
              secondary: "#fff5f5",
            },
          },
          loading: {
            style: {
              background: "#eff6ff",
              color: "#1e40af",
              border: "1px solid #bfdbfe",
            },
            iconTheme: {
              primary: "#2563eb",
              secondary: "#eff6ff",
            },
          },
        }}
      />
    </div>
  );
}

export default App;