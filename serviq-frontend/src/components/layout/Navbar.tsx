import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { clearAuth } from "../../features/auth/authSlice";
import { logoutAPICall } from "../../features/auth/services/auth";
import { useAppDispatch, useAppSelector } from "../../app/hooks";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const session = useAppSelector((state) => state.auth.session);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Add shadow when scrolling for depth
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await logoutAPICall(session?.accessToken);
    } catch (_) {
      // Even if the API call fails, we still clear local state
    } finally {
      dispatch(clearAuth());
      setIsOpen(false);
      toast.success("Logged out successfully!");
      navigate("/login");
      setLogoutLoading(false);
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition duration-200 px-1 py-2 ${
      isActive
        ? "text-slate-950 font-semibold after:absolute after:-bottom-px after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-slate-950"
        : "text-slate-500 hover:text-slate-900"
    }`;

  const activeMobileClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-2xl px-4 py-3 text-sm font-medium transition duration-200 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
      isActive
        ? "bg-slate-950 text-white shadow-md"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          aria-label="ServiQ Home"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-base font-bold text-white shadow-md transition group-hover:shadow-lg group-hover:scale-105 duration-200">
            S
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-gray-900">
              ServiQ
            </span>
            <p className="-mt-0.5 text-[10px] font-medium tracking-widest text-gray-400 uppercase">
              Home Services
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="Main navigation"
        >
          <NavLink to="/" end className={navLinkClass} aria-current={undefined}>
            Home
          </NavLink>
          <NavLink to="/services" className={navLinkClass}>
            Services
          </NavLink>
          <NavLink to="/bookings" className={navLinkClass}>
            My Bookings
          </NavLink>
          {session?.accessToken && (
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          {session?.accessToken ? (
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {logoutLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    role="status"
                    aria-label="Loading"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Logging out...
                </span>
              ) : (
                "Log Out"
              )}
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-semibold text-gray-600 transition hover:text-black rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                Log in
              </NavLink>
              <NavLink
                to="/bookings"
                className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-gray-800 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 active:scale-[0.98]"
              >
                Book a Service
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="rounded-xl p-2 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
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
        id="mobile-menu"
        className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${
          isOpen ? "max-h-96 border-t border-gray-100 opacity-100 shadow-md" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="space-y-1 bg-white px-4 py-4" aria-label="Main navigation">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={activeMobileClass}
            end
          >
            Home
          </NavLink>

          {session?.accessToken ? (
            <>
              <NavLink
                to="/services"
                onClick={() => setIsOpen(false)}
                className={activeMobileClass}
              >
                Services
              </NavLink>
              <NavLink
                to="/bookings"
                onClick={() => setIsOpen(false)}
                className={activeMobileClass}
              >
                My Bookings
              </NavLink>
              <NavLink
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className={activeMobileClass}
              >
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="mt-2 block w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {logoutLoading ? "Logging out..." : "Log Out"}
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setIsOpen(false)}
                className={activeMobileClass}
              >
                Log in
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="mt-2 block rounded-xl bg-black px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              >
                Get Started
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;