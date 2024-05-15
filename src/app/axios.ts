import axios from "axios";

const instance = axios.create({
    baseURL: "https://stockwiz-server.onrender.com/api/v1",
});

instance.defaults.headers.common["Content-Type"] = "application/json";

const getRefreshToken = async (access_token: string) => {
    try {
        const res = await instance.post("/refresh", { access_token });
        const newToken = res.data;
        console.log(res.data);
        // Update the token in localStorage or wherever you store it
        localStorage.setItem("token", newToken);
        return newToken;
    } catch (error) {
        return error;
    }
};

export const getToken = () => {
    return JSON.parse(localStorage.getItem("token") || "{}")?.access;
};

instance.interceptors.request.use(
    async (config) => {
        const token = JSON.parse(localStorage.getItem("token") || "{}")?.access;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.log(originalRequest!._retry, "asss");
        if (error.response.status === 401 && originalRequest!._retry) {
            originalRequest._retry = true;
            try {
                const access_token = JSON.parse(
                    localStorage.getItem("token") || "{}"
                )?.refresh;

                const newToken = await getRefreshToken(access_token);
                originalRequest.headers.Authorization = `Bearer ${newToken.access}`;
                return instance.request(originalRequest);
            } catch (refreshError) {
                console.log("first");
                // request._retry = true;

                // Handle token refresh error
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
