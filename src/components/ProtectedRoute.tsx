import { PropsWithChildren } from "react";
import { getToken } from "../app/axios";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: PropsWithChildren) => {
    const token = getToken();
    if (!token) {
        return <Navigate to="/login" replace />;
    } else {
        return <>{children}</>;
    }
};

export default ProtectedRoute;
