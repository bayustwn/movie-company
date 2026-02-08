import Link from "next/link";

export default function Home() {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Movie Company</h1>
            <p>Cinema Management System</p>
            <div style={{ marginTop: "20px" }}>
                <Link href="/login">Go to Login</Link>
            </div>
        </div>
    );
}
