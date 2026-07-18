import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `transition-colors duration-200 ${
      isActive
        ? "text-blue-600 font-semibold"
        : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-lg">
            S
          </div>

          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              ServiQ
            </h1>

            <p className="-mt-1 text-xs text-slate-500">
              Home Services
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/login" className={navLinkClass}>
            Login
          </NavLink>

          <NavLink
            to="/signup"
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
          >
            Sign Up
          </NavLink>
        </nav>

        {/* Mobile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 transition hover:bg-slate-100 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 7h16M4 12h16M4 17h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          isOpen ? "max-h-64 border-t border-slate-200" : "max-h-0"
        }`}
      >
        <div className="space-y-2 bg-white px-5 py-4">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
          >
            Home
          </NavLink>

          <NavLink
            to="/login"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100"
          >
            Login
          </NavLink>

          <NavLink
            to="/signup"
            onClick={() => setIsOpen(false)}
            className="block rounded-lg bg-blue-600 px-3 py-2 text-center font-semibold text-white hover:bg-blue-700"
          >
            Create Account
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Navbar;