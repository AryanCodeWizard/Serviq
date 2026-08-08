import AuthPageShell from "../../../components/layout/AuthPageShell";
import SignUpForm from "../components/SignUpForm";

const SignUp = () => {
  return (
    <AuthPageShell
      title="Create your ServiQ account"
      description="Join ServiQ to book trusted professionals, manage appointments, and keep your home services running smoothly."
      ctaText="New here"
      ctaLink="/login"
      ctaLabel="Log in"
      ctaPrompt="Already signed up?"
      features={[
        { icon: "✓", text: "Trusted local pros" },
        { icon: "✓", text: "Fast booking and reminders" },
        { icon: "✓", text: "Secure, encrypted sessions" },
      ]}
    >
      <div className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:p-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-black">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign up once and manage every service from your dashboard.
          </p>
        </div>

        <SignUpForm />
      </div>
    </AuthPageShell>
  );
};

export default SignUp;