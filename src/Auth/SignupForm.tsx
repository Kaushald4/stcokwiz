import React from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { TSignupForm } from "./types";

const SignupForm = ({
    register,
    handleSubmit,
    handleSignup,
    errors,
    isSubmitting,
}: TSignupForm) => {
    return (
        <Box sx={{ maxWidth: "400px", p: "10px", mx: "auto" }}>
            <Paper sx={{ p: "20px" }}>
                <form onSubmit={handleSubmit(handleSignup)}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        <Typography pb={2} variant="h4">
                            Create Account
                        </Typography>
                        <TextField
                            label="Name"
                            size="small"
                            {...register("name")}
                            error={errors.name?.message ? true : false}
                            sx={{ width: "100%" }}
                            helperText={errors.name?.message}
                        />
                        <TextField
                            label="Email"
                            size="small"
                            {...register("email")}
                            error={errors.email?.message ? true : false}
                            helperText={errors.email?.message}
                            sx={{ width: "100%" }}
                        />
                        <TextField
                            label="Password"
                            size="small"
                            {...register("password")}
                            error={errors.password?.message ? true : false}
                            helperText={errors.password?.message}
                            sx={{ width: "100%" }}
                            type="password"
                        />
                        <TextField
                            label="Confirm Password"
                            size="small"
                            {...register("confirmPassword")}
                            helperText={errors.confirmPassword?.message}
                            error={
                                errors.confirmPassword?.message ? true : false
                            }
                            sx={{ width: "100%" }}
                            type="password"
                        />
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                            }}
                        >
                            <Typography>Already have an account?</Typography>
                            <Link to="/login">Login</Link>
                        </Box>
                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            sx={{ mt: "10px" }}
                            variant="contained"
                        >
                            Signup
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default SignupForm;
