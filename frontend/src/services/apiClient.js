import axios from "axios";

// =====================================================
// API CLIENT
// =====================================================

const apiClient = axios.create({
    baseURL: "https://barmanagmentsystem-production-231c.up.railway.app",

    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});


// =====================================================
// REQUEST INTERCEPTOR
// =====================================================
// Automatically attaches JWT token from sessionStorage
// to every API request.
//
// Authorization:
// Bearer <JWT_TOKEN>
// =====================================================

apiClient.interceptors.request.use(
    (config) => {

        const token =
            sessionStorage.getItem("token");

        if (token) {

            if (!config.headers) {
                config.headers = {};
            }

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================
// Handles authentication failure.
//
// 401 = Unauthorized
//
// 403 is NOT treated as logout automatically because
// 403 can mean that the authenticated user does not have
// permission for a particular operation.
// =====================================================

apiClient.interceptors.response.use(

    (response) => {
        return response;
    },

    (error) => {

        const status =
            error.response?.status;

        // ---------------------------------------------
        // UNAUTHORIZED
        // ---------------------------------------------

        if (status === 401) {

            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            if (
                window.location.pathname !==
                "/login"
            ) {

                window.location.href =
                    "/login";
            }
        }

        // ---------------------------------------------
        // FORBIDDEN
        // ---------------------------------------------
        // Do not remove token here.
        //
        // The caller can handle 403 according to
        // the operation being performed.
        // ---------------------------------------------

        return Promise.reject(error);
    }
);


// =====================================================
// EXPORT
// =====================================================

export default apiClient;