import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import "./ResetPassword.css";

function ResetPassword() {

    const navigate = useNavigate();

    // Email saved by Forgot Password page
    const email =
        sessionStorage.getItem("resetEmail") || "";

    const [formData, setFormData] = useState({
        token: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        // OTP: allow only numbers and maximum 6 digits
        if (name === "token") {

            const otpValue =
                value.replace(/\D/g, "").slice(0, 6);

            setFormData((prev) => ({
                ...prev,
                [name]: otpValue
            }));

        } else {

            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }

        setError("");
        setSuccess("");
    };


    // ==========================================
    // RESET PASSWORD
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // ------------------------------------------
        // Check Email
        // ------------------------------------------

        if (!email) {

            setError(
                "Email not found. Please request a new OTP."
            );

            return;
        }


        // ------------------------------------------
        // Check OTP
        // ------------------------------------------

        if (!/^\d{6}$/.test(formData.token)) {

            setError(
                "Please enter a valid 6-digit OTP."
            );

            return;
        }


        // ------------------------------------------
        // Check New Password
        // ------------------------------------------

        if (!formData.newPassword) {

            setError(
                "Please enter a new password."
            );

            return;
        }


        // ------------------------------------------
        // Check Password Length
        // ------------------------------------------

        if (formData.newPassword.length < 8) {

            setError(
                "Password must contain at least 8 characters."
            );

            return;
        }


        // ------------------------------------------
        // Check Confirm Password
        // ------------------------------------------

        if (!formData.confirmPassword) {

            setError(
                "Please confirm your new password."
            );

            return;
        }


        // ------------------------------------------
        // Compare Passwords
        // ------------------------------------------

        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {

            setError(
                "New password and confirm password do not match."
            );

            return;
        }


        // ------------------------------------------
        // Call Backend
        // ------------------------------------------

        try {

            setLoading(true);

            await resetPassword({

                email: email,

                token: formData.token,

                newPassword:
                    formData.newPassword,

                confirmPassword:
                    formData.confirmPassword

            });


            // ------------------------------------------
            // Success
            // ------------------------------------------

            setSuccess(
                "Password reset successfully. Redirecting to login..."
            );


            // Remove reset email
            sessionStorage.removeItem("resetEmail");


            // Redirect after success
            setTimeout(() => {

                navigate("/login");

            }, 1500);


        } catch (err) {

            console.error(
                "Reset password error:",
                err
            );


            // Get backend error message
            const backendMessage =
                err?.response?.data;


            let message =
                "Unable to reset password. Please try again.";


            if (typeof backendMessage === "string") {

                message = backendMessage;

            } else if (
                backendMessage &&
                typeof backendMessage.message === "string"
            ) {

                message =
                    backendMessage.message;

            } else if (
                typeof err?.message === "string"
            ) {

                message =
                    err.message;
            }


            setError(message);

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // EMAIL NOT FOUND
    // ==========================================

    if (!email) {

        return (

            <div className="reset-page">

                <div className="reset-card reset-no-email-card">

                    <div className="reset-welcome-label">
                        ACCOUNT SECURITY
                    </div>

                    <h2>
                        Reset Password
                    </h2>

                    <div className="reset-message reset-error">
                        Email not found. Please request a new OTP.
                    </div>

                    <button
                        type="button"
                        className="reset-button"
                        onClick={() =>
                            navigate("/forgot-password")
                        }
                    >
                        Request New OTP
                    </button>

                </div>

            </div>
        );
    }


    // ==========================================
    // MAIN PAGE
    // ==========================================

    return (

        <div className="reset-page">

            {/* ==========================================
                LEFT BRAND SECTION
            ========================================== */}

            <div className="reset-brand">

                <div className="reset-brand-content">

                    <div className="reset-brand-logo">
                        🍸
                    </div>

                    <div className="reset-brand-text">

                        <div className="reset-brand-overline">
                            SMART BAR OPERATIONS
                        </div>

                        <h1>
                            Bar Management
                            <span>
                                System
                            </span>
                        </h1>

                        <p className="reset-brand-description">
                            Securely reset your account password
                            using the verification OTP.
                        </p>

                        <div className="reset-brand-footer">

                            <span className="reset-status-dot"></span>

                            Account security enabled

                        </div>

                    </div>

                </div>

            </div>


            {/* ==========================================
                RIGHT RESET SECTION
            ========================================== */}

            <div className="reset-section">

                <div className="reset-card">

                    {/* ==========================================
                        HEADER
                    ========================================== */}

                    <div className="reset-header">

                        <div className="reset-welcome-label">
                            ACCOUNT SECURITY
                        </div>

                        <h2>
                            Reset Password
                        </h2>

                        <p>
                            Enter the OTP generated for your
                            account and create a new password.
                        </p>

                    </div>


                    {/* ==========================================
                        EMAIL
                    ========================================== */}

                    <div className="reset-email-box">

                        <span className="reset-email-label">
                            RESETTING PASSWORD FOR
                        </span>

                        <strong>
                            {email}
                        </strong>

                    </div>


                    {/* ==========================================
                        ERROR MESSAGE
                    ========================================== */}

                    {error && (

                        <div className="reset-message reset-error">
                            {error}
                        </div>

                    )}


                    {/* ==========================================
                        SUCCESS MESSAGE
                    ========================================== */}

                    {success && (

                        <div className="reset-message reset-success">
                            {success}
                        </div>

                    )}


                    {/* ==========================================
                        FORM
                    ========================================== */}

                    <form onSubmit={handleSubmit}>


                        {/* ==========================================
                            OTP
                        ========================================== */}

                        <div className="reset-form-group">

                            <label htmlFor="token">
                                OTP
                            </label>

                            <input
                                id="token"
                                type="text"
                                name="token"
                                value={formData.token}
                                onChange={handleChange}
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                            />

                            <small>
                                Enter the 6-digit OTP generated
                                for your account.
                            </small>

                        </div>


                        {/* ==========================================
                            NEW PASSWORD
                        ========================================== */}

                        <div className="reset-form-group">

                            <label htmlFor="newPassword">
                                New Password
                            </label>

                            <div className="password-wrapper">

                                <input
                                    id="newPassword"
                                    type={
                                        showNewPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="newPassword"
                                    value={
                                        formData.newPassword
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="password-eye-button"
                                    onClick={() =>
                                        setShowNewPassword(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                    aria-label={
                                        showNewPassword
                                            ? "Hide new password"
                                            : "Show new password"
                                    }
                                    title={
                                        showNewPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showNewPassword
                                        ? "🙈"
                                        : "👁️"}
                                </button>

                            </div>

                        </div>


                        {/* ==========================================
                            CONFIRM PASSWORD
                        ========================================== */}

                        <div className="reset-form-group">

                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>

                            <div className="password-wrapper">

                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="password-eye-button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                    title={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showConfirmPassword
                                        ? "🙈"
                                        : "👁️"}
                                </button>

                            </div>

                        </div>


                        {/* ==========================================
                            RESET BUTTON
                        ========================================== */}

                        <button
                            type="submit"
                            className="reset-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="reset-spinner"></span>
                                    Resetting...
                                </>
                            ) : (
                                <>
                                    Reset Password
                                    <span className="reset-button-arrow">
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </form>


                    {/* ==========================================
                        BACK TO LOGIN
                    ========================================== */}

                    <div className="reset-login-section">

                        <span>
                            Remember your password?
                        </span>

                        <button
                            type="button"
                            className="reset-login-link"
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            ← Back to Login
                        </button>

                    </div>


                    {/* ==========================================
                        SECURITY NOTE
                    ========================================== */}

                    <div className="reset-security-note">

                        <span>
                            🔒
                        </span>

                        <p>
                            Your password is securely encrypted
                            before it is saved to your account.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ResetPassword;