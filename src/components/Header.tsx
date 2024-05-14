import React from "react";
import { Box, Button, Paper } from "@mui/material";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    return (
        <Box sx={{ bgcolor: "blue" }}>
            <Paper
                sx={{
                    p: "10px",
                    display: "flex",
                    justifyContent: "flex-end",
                    borderRadius: "0px",
                }}
            >
                <Button
                    onClick={() => {
                        logout();
                        navigate(0);
                    }}
                    variant="contained"
                >
                    Logout
                </Button>
            </Paper>
        </Box>
    );
};

export default Header;
