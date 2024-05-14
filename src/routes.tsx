import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Home from "./Home";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        ),
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
]);

export default router;
