import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen bg-cinema-dark flex flex-col items-center justify-center p-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
                Movie <span className="text-cinema-red">Company</span>
            </h1>
            <p className="text-gray-400 mb-8 font-medium">Cinema Management System</p>
            <Link
                href="/login"
                className="bg-cinema-red text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-cinema-red/20 hover:opacity-90 transition-all active:scale-95"
            >
                Go to Login
            </Link>
        </div>
    );
}
