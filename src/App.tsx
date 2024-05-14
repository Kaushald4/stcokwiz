import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./Context/AuthContext";

const App = () => {
    return (
        <AuthProvider>
            <Toaster />
            <RouterProvider router={router} />
        </AuthProvider>
    );
};

export default App;
