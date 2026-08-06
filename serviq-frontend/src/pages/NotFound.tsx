import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
            <div className="max-w-xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">404</p>
                <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl">Page not found</h1>
                <p className="mt-4 text-base leading-7 text-gray-600">
                    The page you are looking for does not exist or has moved.
                </p>
                <Link
                    to="/"
                    className="mt-8 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                    Go home
                </Link>
            </div>
        </main>
    );
};

export default NotFound;