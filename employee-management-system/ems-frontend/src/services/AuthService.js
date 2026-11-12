
import axios from "axios";

const AUTH_API = "http://localhost:8080/api/auth";

const AuthService = {
    register: (adminData) => {
        return axios.post(
            `${AUTH_API}/register`,
            adminData,
            { withCredentials: true }
        );
    },

    login: (loginData) => {
        return axios.post(
            `${AUTH_API}/login`,
            loginData,
            { withCredentials: true }
        );
    },

    getCurrentAdmin: () => {
        return axios.get(
            `${AUTH_API}/me`,
            { withCredentials: true }
        );
    },

    logout: () => {
        return axios.post(
            `${AUTH_API}/logout`,
            {},
            { withCredentials: true }
        );
    }
};

export default AuthService;

