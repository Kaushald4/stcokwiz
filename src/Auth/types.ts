import {
    FieldErrors,
    SubmitHandler,
    UseFormHandleSubmit,
    UseFormRegister,
} from "react-hook-form";
import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(4, "Password must contain at least 4 character(s)"),
});

export type TLogin = z.infer<typeof LoginSchema>;

export type TLoginForm = {
    register: UseFormRegister<TLogin>;
    handleSubmit: UseFormHandleSubmit<TLogin>;
    handleLogin: SubmitHandler<TLogin>;
    errors: FieldErrors<TLogin>;
    isSubmitting: boolean;
};

export const SignupSchema = z
    .object({
        name: z.string().min(2, "Name must contain at least 2 character(s)"),
        email: z.string().email(),
        password: z
            .string()
            .min(4, "Password must contain at least 4 character(s)"),
        confirmPassword: z.string(),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ["password"],
            });
        }
    });

export type TSignup = z.infer<typeof SignupSchema>;

export type TSignupForm = {
    register: UseFormRegister<TSignup>;
    handleSubmit: UseFormHandleSubmit<TSignup>;
    handleSignup: SubmitHandler<TSignup>;
    errors: FieldErrors<TSignup>;
    isSubmitting: boolean;
};
