import React from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { TLoginForm } from "./types";

const LoginForm = ({
    register,
    handleSubmit,
    handleLogin,
    errors,
    isSubmitting,
}: TLoginForm) => {
    return (
        <Box sx={{ maxWidth: "400px", p: "10px", mx: "auto", mt: 14 }}>
            <Paper sx={{ p: "20px" }}>
                <form onSubmit={handleSubmit(handleLogin)}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        <Typography pb={2} variant="h4">
                            Login
                        </Typography>

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

                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                            }}
                        >
                            <Typography>Don't have an account?</Typography>
                            <Link to="/signup">Signup</Link>
                        </Box>
                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            sx={{ mt: "10px" }}
                            variant="contained"
                        >
                            Login
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default LoginForm;
