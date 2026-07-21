import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      {/* Subtle dot-grid background */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">

        {/* LEFT PANEL – Branding */}
        <div className="flex flex-col justify-center bg-gray-50 px-8 py-16 lg:px-16 xl:px-20">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-xl font-bold text-white shadow-lg">
              U
            </div>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl lg:text-6xl">
            Welcome back!<span className="block text-black">Good to see you.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-600">
            Sign in to manage your bookings, connect with trusted professionals, and enjoy seamless home services — all in one place.
          </p>

          <div className="mt-10 space-y-5">
            {[
              { icon: "✓", text: "50K+ background-verified professionals" },
              { icon: "✓", text: "4.8★ average customer rating" },
              { icon: "✓", text: "Secure login & SSL protected sessions" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  {item.icon}
                </span>
                <span className="text-base font-medium text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-14 hidden w-24 border-t-2 border-black/10 lg:block" />
        </div>

        {/* RIGHT PANEL – Form */}
        <div className="flex items-center justify-center px-6 py-12 lg:px-10">
          <div className="w-full max-w-md">
            <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] sm:p-10">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-black">Welcome to UrbanCo</h2>
                <p className="mt-2 text-gray-500">Log in to continue your journey</p>
              </div>

              <LoginForm />

              <div className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="font-semibold text-black underline underline-offset-2 transition hover:text-gray-600"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default Login;