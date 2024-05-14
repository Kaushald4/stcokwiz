import React, { useEffect } from "react";
import LoginForm from "./LoginForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import privateAxios, { getToken } from "../app/axios";
import axios from "axios";
import toast from "react-hot-toast";
import { LoginSchema, TLogin } from "./types";

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<TLogin>({ resolver: zodResolver(LoginSchema) });

    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken();
        if (token) {
            navigate("/", { replace: true });
            navigate(0);
        }
    }, [navigate]);

    const loginMutation = useMutation({
        mutationKey: ["login"],
        mutationFn: async (data: TLogin) => {
            try {
                const res = await privateAxios.post("/login", data);
                return res.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const data = error.response?.data;
                    if (data?.data?.email) {
                        const message = data?.data?.email[0];
                        setError("email", { message: message });
                    }
                    if (data?.status === 400) {
                        const message = data?.message;
                        toast.error(message);
                    }
                }
            }
        },
        onSuccess: (data) => {
            if (data) {
                toast.success("Logged In...");
                localStorage.setItem("token", JSON.stringify(data));
                navigate("/", { replace: true });
            }
        },
    });

    const handleLogin: SubmitHandler<TLogin> = async (data) => {
        await loginMutation.mutateAsync(data);
    };

    return (
        <LoginForm
            errors={errors}
            handleLogin={handleLogin}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            register={register}
        />
    );
};

export default Login;
