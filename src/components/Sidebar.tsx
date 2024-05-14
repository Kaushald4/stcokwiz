import React from "react";
import { Box, Link, Paper } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Sidebar = () => {
    return (
        <Box width={"260px"} sx={{ position: "fixed" }}>
            <Paper sx={{ p: "20px", height: "100vh" }}>
                <Link
                    component={RouterLink}
                    to="/"
                    sx={{
                        textDecoration: "none",
                        color: "black",
                        fontWeight: 500,
                        fontSize: "24px",
                    }}
                >
                    StockWiz
                </Link>
            </Paper>
        </Box>
    );
};

export default Sidebar;
