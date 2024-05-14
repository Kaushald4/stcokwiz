import React, { useLayoutEffect } from "react";
import SignupForm from "./SignupForm";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "react-query";
import privateAxios, { getToken } from "../app/axios";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SignupSchema, TSignup } from "./types";

const Signup = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<TSignup>({ resolver: zodResolver(SignupSchema) });

    const navigate = useNavigate();

    useLayoutEffect(() => {
        const token = getToken();
        if (token) {
            navigate("/", { replace: true });
            navigate(0);
        }
    }, [navigate]);

    const signupMutation = useMutation({
        mutationKey: ["signup"],
        mutationFn: async (data: TSignup) => {
            try {
                const res = await privateAxios.post("/register", data);
                return res.data;
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const data = error.response?.data;

                    if (data?.data?.email) {
                        const message = data?.data?.email[0];
                        console.log(message);
                        setError("email", { message: message });
                    }
                }
            }
        },
        onSuccess: (data) => {
            if (data) {
                toast.success("Account created successfully...");
                navigate("/login", { replace: true });
            }
        },
    });

    const handleSignup: SubmitHandler<TSignup> = async (data) => {
        await signupMutation.mutateAsync(data);
    };

    return (
        <SignupForm
            register={register}
            handleSubmit={handleSubmit}
            handleSignup={handleSignup}
            errors={errors}
            isSubmitting={isSubmitting}
        />
    );
};

export default Signup;
