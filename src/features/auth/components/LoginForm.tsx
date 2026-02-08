"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginInput } from "../schemas/auth.schema";
import Link from "next/link";
import { Input, Button, Checkbox, Spinner, addToast } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
    const { mutate: login, isPending, error } = useLogin();
    const [isVisible, setIsVisible] = React.useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    useEffect(() => {
        if (error) {
            addToast({
                title: "Login Failed",
                description: error.message,
                color: "danger",
                variant: "flat",
                shouldShowTimeoutProgress: true,
            });
        }
    }, [error]);

    const onSubmit = (data: LoginInput) => {
        login(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2.5">
                <label className="text-sm font-semibold text-cinema-dark dark:text-gray-200 flex items-center gap-1">
                    Email <span className="text-cinema-red">*</span>
                </label>
                <Input
                    placeholder="info@gmail.com"
                    variant="bordered"
                    radius="md"
                    {...register("email")}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                    classNames={{
                        inputWrapper:
                            "border-1 border-gray-200 dark:border-white/10 group-data-[focus=true]:border-cinema-red transition-all h-12 px-4 !shadow-none",
                        input: "text-sm placeholder:text-gray-400 font-medium dark:text-white",
                    }}
                />
            </div>

            <div className="flex flex-col gap-2.5">
                <label className="text-sm font-semibold text-cinema-dark dark:text-gray-200 flex items-center gap-1">
                    Password <span className="text-cinema-red">*</span>
                </label>
                <Input
                    placeholder="Enter your password"
                    variant="bordered"
                    radius="md"
                    type={isVisible ? "text" : "password"}
                    {...register("password")}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                    endContent={
                        <button
                            className="focus:outline-none opacity-40 hover:opacity-100 transition-opacity dark:text-gray-400"
                            type="button"
                            onClick={toggleVisibility}
                        >
                            {isVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    }
                    classNames={{
                        inputWrapper:
                            "border-1 border-gray-200 dark:border-white/10 group-data-[focus=true]:border-cinema-red transition-all h-12 px-4 !shadow-none",
                        input: "text-sm placeholder:text-gray-400 font-medium dark:text-white",
                    }}
                />
            </div>

            <div className="flex items-center justify-between mb-2">
                <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => (
                        <Checkbox
                            isSelected={field.value}
                            onValueChange={field.onChange}
                            classNames={{
                                label: "text-sm text-gray-500 dark:text-gray-400 font-medium",
                                wrapper:
                                    "after:bg-cinema-red before:border-gray-100 dark:before:border-white/10",
                            }}
                        >
                            Keep me logged in
                        </Checkbox>
                    )}
                />
                <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-cinema-red hover:underline decoration-1"
                >
                    Forgot password?
                </Link>
            </div>

            <Button
                type="submit"
                size="lg"
                fullWidth
                isLoading={isPending}
                spinner={<Spinner color="white" size="sm" />}
                className="bg-cinema-red text-white font-bold text-sm h-12 rounded-md shadow-2xl shadow-cinema-red/20 hover:opacity-90 transition-opacity"
            >
                {!isPending && "Sign in"}
            </Button>
        </form>
    );
}
