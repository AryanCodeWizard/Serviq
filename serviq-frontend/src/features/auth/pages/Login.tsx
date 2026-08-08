import AuthPageShell from "../../../components/layout/AuthPageShell";
import LoginForm from "../components/LoginForm";

const Login = () => {
  return (
    <AuthPageShell
      title="Welcome back"
      description="Sign in to manage your bookings, connect with trusted professionals, and enjoy seamless home services—all in one place."
      ctaText="Secure access"
      ctaLink="/signup"
      ctaLabel="Create account"
      features={[
        { icon: "✓", text: "Background-verified experts" },
        { icon: "✓", text: "Instant booking history" },
        { icon: "✓", text: "Secure sessions with OTP" },
      ]}
    >
      <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-black">
            Sign in to ServiQ
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Enter your details to continue.
          </p>
        </div>

        <LoginForm />
      </div>
    </AuthPageShell>
  );
};

export default Login;