"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginInput } from "../schemas/auth.schema";
import Link from "next/link";

export function LoginForm() {
    const { mutate: login, isPending, error } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
    });

    const onSubmit = (data: LoginInput) => {
        login({ email: data.email, password: data.password });
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="email">Email: </label>
                    <input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        {...register("email")}
                        style={{ border: "1px solid #ccc", padding: "5px" }}
                    />
                    {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="password">Password: </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                        style={{ border: "1px solid #ccc", padding: "5px" }}
                    />
                    {errors.password && <p style={{ color: "red" }}>{errors.password.message}</p>}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label>
                        <input type="checkbox" {...register("remember")} /> Remember me
                    </label>
                </div>

                {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error.message}</div>}

                <button type="submit" disabled={isPending}>
                    {isPending ? "Signing in..." : "Sign In"}
                </button>
            </form>
            <div style={{ marginTop: "1rem" }}>
                <Link href="/forgot-password">Forgot password?</Link>
            </div>
        </div>
    );
}
