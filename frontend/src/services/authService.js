// =========================================================
// API BASE URL
// =========================================================
// Production backend
// Works on:
// - Desktop
// - Mobile
// - Vercel deployed frontend
// =========================================================

const API_BASE_URL =
    "https://barmanagmentsystem-production-231c.up.railway.app/api/auth";


// =========================================================
// RESPONSE PARSER
// =========================================================

const parseResponse = async (response) => {

    const contentType =
        response.headers.get("content-type") || "";

    const responseText =
        await response.text();

    if (!responseText.trim()) {
        return null;
    }

    if (
        contentType
            .toLowerCase()
            .includes("application/json")
    ) {
        try {

            return JSON.parse(responseText);

        } catch {

            return {
                message: responseText.trim()
            };
        }
    }

    return {
        message: responseText.trim()
    };
};


// =========================================================
// ERROR MESSAGE
// =========================================================

const getErrorMessage = (
    data,
    defaultMessage
) => {

    if (!data) {
        return defaultMessage;
    }

    if (
        typeof data === "string" &&
        data.trim()
    ) {
        return data.trim();
    }

    if (
        typeof data.message === "string" &&
        data.message.trim()
    ) {
        return data.message.trim();
    }

    if (
        typeof data.error === "string" &&
        data.error.trim()
    ) {
        return data.error.trim();
    }

    if (
        typeof data.detail === "string" &&
        data.detail.trim()
    ) {
        return data.detail.trim();
    }

    return defaultMessage;
};


// =========================================================
// NETWORK ERROR
// =========================================================

const createNetworkError = (error) => {

    const message =
        error?.message ||
        "Network request failed.";

    const networkError = new Error(
        `Unable to connect to the backend. ${message}`,
        {
            cause: error
        }
    );

    return networkError;
};


// =========================================================
// LOGIN
// =========================================================

export const loginUser = async (loginData) => {

    if (!loginData) {

        throw new Error(
            "Login information is required."
        );
    }

    if (
        !loginData.email ||
        !loginData.email.trim()
    ) {

        throw new Error(
            "Email is required."
        );
    }

    if (!loginData.password) {

        throw new Error(
            "Password is required."
        );
    }

    let response;

    try {

        response = await fetch(
            `${API_BASE_URL}/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify({
                    email:
                        loginData.email
                            .trim()
                            .toLowerCase(),

                    password:
                        loginData.password
                })
            }
        );

    } catch (error) {

        console.error(
            "Login network error:",
            error
        );

        throw createNetworkError(error);
    }

    const data =
        await parseResponse(response);

    if (!response.ok) {

        const defaultMessage =
            response.status === 401
                ? "Invalid email or password."
                : "Unable to sign in. Please try again.";

        throw new Error(
            getErrorMessage(
                data,
                defaultMessage
            )
        );
    }

    if (!data) {

        throw new Error(
            "The server returned an empty response."
        );
    }

    return data;
};


// =========================================================
// REGISTER
// =========================================================

export const registerUser = async (
    registerData
) => {

    if (!registerData) {

        throw new Error(
            "Registration information is required."
        );
    }

    let response;

    try {

        response = await fetch(
            `${API_BASE_URL}/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify(
                    registerData
                )
            }
        );

    } catch (error) {

        console.error(
            "Registration network error:",
            error
        );

        throw createNetworkError(error);
    }

    const data =
        await parseResponse(response);

    if (!response.ok) {

        const defaultMessage =
            response.status === 409
                ? "An account with this email already exists."
                : "Unable to create your account. Please try again.";

        throw new Error(
            getErrorMessage(
                data,
                defaultMessage
            )
        );
    }

    return data;
};


// =========================================================
// UPDATE PROFILE
// =========================================================

export const updateProfile = async (
    profileData
) => {

    // ------------------------------------------
    // Validate profile data
    // ------------------------------------------

    if (!profileData) {

        throw new Error(
            "Profile information is required."
        );
    }

    if (
        !profileData.fullName ||
        !profileData.fullName.trim()
    ) {

        throw new Error(
            "Full name is required."
        );
    }

    if (
        !profileData.email ||
        !profileData.email.trim()
    ) {

        throw new Error(
            "Email is required."
        );
    }

    if (
        !profileData.mobileNumber ||
        !profileData.mobileNumber.trim()
    ) {

        throw new Error(
            "Mobile number is required."
        );
    }

    // ------------------------------------------
    // Get JWT token
    // ------------------------------------------

    const token =
        sessionStorage.getItem("token");

    if (!token) {

        throw new Error(
            "Your session has expired. Please login again."
        );
    }

    // ------------------------------------------
    // Prepare request body
    // ------------------------------------------

    const requestBody = {

        fullName:
            profileData.fullName.trim(),

        email:
            profileData.email
                .trim()
                .toLowerCase(),

        mobileNumber:
            profileData.mobileNumber.trim()
    };

    let response;

    try {

        response = await fetch(
            `${API_BASE_URL}/profile`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization":
                        `Bearer ${token}`
                },

                body: JSON.stringify(
                    requestBody
                )
            }
        );

    } catch (error) {

        console.error(
            "Update profile network error:",
            error
        );

        throw createNetworkError(error);
    }

    const data =
        await parseResponse(response);

    // ------------------------------------------
    // Handle unauthorized
    // ------------------------------------------

    if (response.status === 401) {

        throw new Error(
            "Your session has expired. Please login again."
        );
    }

    // ------------------------------------------
    // Handle other errors
    // ------------------------------------------

    if (!response.ok) {

        throw new Error(
            getErrorMessage(
                data,
                "Unable to update profile. Please try again."
            )
        );
    }

    // ------------------------------------------
    // Validate response
    // ------------------------------------------

    if (!data) {

        throw new Error(
            "The server returned an empty response."
        );
    }

    // ------------------------------------------
    // Update stored JWT token
    // ------------------------------------------

    if (data.token) {

        sessionStorage.setItem(
            "token",
            data.token
        );
    }

    // ------------------------------------------
    // Update stored user data
    // ------------------------------------------

    const currentUser =
        sessionStorage.getItem("user");

    let userData = {};

    if (currentUser) {

        try {

            userData =
                JSON.parse(currentUser);

        } catch {

            userData = {};
        }
    }

    const updatedUser = {

        ...userData,

        id:
            data.userId ??
            userData.id,

        userId:
            data.userId ??
            userData.userId,

        fullName:
            data.fullName ??
            userData.fullName,

        name:
            data.fullName ??
            userData.name,

        email:
            data.email ??
            userData.email,

        mobileNumber:
            data.mobileNumber ??
            userData.mobileNumber,

        mobile:
            data.mobileNumber ??
            userData.mobile,

        role:
            data.role ??
            userData.role,

        active:
            data.active ??
            userData.active
    };

    sessionStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
    );

    return data;
};


// =========================================================
// FORGOT PASSWORD
// GENERATE OTP
// =========================================================

export const forgotPassword = async (
    email
) => {

    if (
        !email ||
        !email.trim()
    ) {

        throw new Error(
            "Email is required."
        );
    }

    const cleanEmail =
        email
            .trim()
            .toLowerCase();

    let response;

    try {

        response = await fetch(
            `${API_BASE_URL}/forgot-password`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify({
                    email: cleanEmail
                })
            }
        );

    } catch (error) {

        console.error(
            "Forgot password network error:",
            error
        );

        throw createNetworkError(error);
    }

    const data =
        await parseResponse(response);

    if (!response.ok) {

        throw new Error(
            getErrorMessage(
                data,
                "Unable to generate OTP. Please try again."
            )
        );
    }

    return data;
};


// =========================================================
// RESET PASSWORD
// =========================================================

export const resetPassword = async ({
    email,
    token,
    newPassword,
    confirmPassword
}) => {

    // ------------------------------------------
    // Validate email
    // ------------------------------------------

    if (
        !email ||
        !email.trim()
    ) {

        throw new Error(
            "Email is required."
        );
    }

    const cleanEmail =
        email
            .trim()
            .toLowerCase();

    // ------------------------------------------
    // Validate OTP
    // ------------------------------------------

    if (
        !token ||
        !token.trim()
    ) {

        throw new Error(
            "OTP is required."
        );
    }

    const cleanToken =
        token.trim();

    if (!/^\d{6}$/.test(cleanToken)) {

        throw new Error(
            "OTP must contain exactly 6 digits."
        );
    }

    // ------------------------------------------
    // Validate new password
    // ------------------------------------------

    if (
        !newPassword ||
        !newPassword.trim()
    ) {

        throw new Error(
            "New password is required."
        );
    }

    if (newPassword.length < 8) {

        throw new Error(
            "Password must contain at least 8 characters."
        );
    }

    // ------------------------------------------
    // Validate confirm password
    // ------------------------------------------

    if (
        !confirmPassword ||
        !confirmPassword.trim()
    ) {

        throw new Error(
            "Confirm password is required."
        );
    }

    if (
        newPassword !==
        confirmPassword
    ) {

        throw new Error(
            "New password and confirm password do not match."
        );
    }

    // ------------------------------------------
    // Request body
    // ------------------------------------------

    const requestBody = {

        email: cleanEmail,

        token: cleanToken,

        newPassword: newPassword,

        confirmPassword: confirmPassword
    };

    let response;

    try {

        response = await fetch(
            `${API_BASE_URL}/reset-password`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify(
                    requestBody
                )
            }
        );

    } catch (error) {

        console.error(
            "RESET PASSWORD NETWORK ERROR:",
            error
        );

        throw createNetworkError(error);
    }

    const data =
        await parseResponse(response);

    if (!response.ok) {

        throw new Error(
            getErrorMessage(
                data,
                "Unable to reset password. Please try again."
            )
        );
    }

    return data;
};