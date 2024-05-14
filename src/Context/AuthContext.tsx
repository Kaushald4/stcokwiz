import React, { PropsWithChildren, useContext } from "react";
import { useQuery } from "react-query";
import axios from "../app/axios";
import { Navigate } from "react-router-dom";

const UserContext = React.createContext({
    logout: () => {},
    isLoading: false,
    user: {
        name: "",
        email: "",
    },
});

const AuthProvider = ({ children }: PropsWithChildren) => {
    const { data, isLoading } = useQuery({
        queryKey: ["profile/me"],
        queryFn: async () => {
            const res = axios.get("/profile/me");
            return res;
        },
    });
    const logout = () => {
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    };
    return (
        <UserContext.Provider
            value={{
                isLoading,
                logout,
                user: {
                    email: data?.data?.data?.email,
                    name: data?.data?.data?.name,
                },
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(UserContext);
};

export default AuthProvider;
