import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import "./ForgotPassword.css";


function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // =====================================================
    // HANDLE EMAIL CHANGE
    // =====================================================

    const handleChange = (e) => {

        setEmail(e.target.value);

        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }
    };


    // =====================================================
    // SEND OTP
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // =================================================
        // EMAIL VALIDATION
        // =================================================

        const trimmedEmail = email.trim();

        if (!trimmedEmail) {

            setError(
                "Please enter your registered email address."
            );

            return;
        }


        // =================================================
        // EMAIL FORMAT VALIDATION
        // =================================================

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(trimmedEmail)) {

            setError(
                "Please enter a valid email address."
            );

            return;
        }


        try {

            setLoading(true);


            // =================================================
            // FORGOT PASSWORD API
            // =================================================

            const response =
                await forgotPassword(trimmedEmail);


            // =================================================
            // STORE EMAIL FOR RESET PASSWORD
            // =================================================

            sessionStorage.setItem(
                "resetEmail",
                trimmedEmail
            );


            // =================================================
            // SUCCESS MESSAGE
            // =================================================

            setSuccess(
                response?.message ||
                "OTP generated successfully."
            );


            // =================================================
            // REDIRECT TO RESET PASSWORD
            // =================================================

            setTimeout(() => {

                navigate(
                    "/reset-password",
                    {
                        replace: true
                    }
                );

            }, 1200);


        } catch (error) {

            setError(
                error?.message ||
                "Unable to generate OTP. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <main className="forgot-page">


            {/* =================================================
                BRANDING SECTION
            ================================================= */}

            <section className="forgot-brand">

                <div className="forgot-brand-content">


                    {/* =================================================
                        LOGO
                    ================================================= */}

                    <div className="forgot-brand-logo">
                        BM
                    </div>


                    {/* =================================================
                        BRAND TEXT
                    ================================================= */}

                    <div className="forgot-brand-text">

                        <p className="forgot-brand-overline">
                            SMART BAR OPERATIONS
                        </p>


                        <h1>
                            Bar Management
                            <span>
                                System
                            </span>
                        </h1>


                        <p className="forgot-brand-description">
                            Manage your bar operations,
                            inventory, staff and billing
                            from one powerful platform.
                        </p>

                    </div>


                    {/* =================================================
                        SECURITY STATUS
                    ================================================= */}

                    <div className="forgot-brand-footer">

                        <span className="forgot-status-dot"></span>

                        Secure Management Platform

                    </div>

                </div>

            </section>


            {/* =================================================
                FORGOT PASSWORD SECTION
            ================================================= */}

            <section className="forgot-section">

                <div className="forgot-card">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="forgot-header">

                        <span className="forgot-welcome-label">
                            ACCOUNT RECOVERY
                        </span>


                        <h2>
                            Forgot Password?
                        </h2>


                        <p>
                            Enter your registered email address
                            and we'll help you reset your password.
                        </p>

                    </div>


                    {/* =================================================
                        ERROR MESSAGE
                    ================================================= */}

                    {error && (

                        <div
                            className="forgot-message forgot-error"
                            role="alert"
                        >

                            <span className="forgot-message-icon">
                                !
                            </span>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        SUCCESS MESSAGE
                    ================================================= */}

                    {success && (

                        <div
                            className="forgot-message forgot-success"
                            role="status"
                        >

                            <span className="forgot-message-icon">
                                ✓
                            </span>

                            <span>
                                {success}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form onSubmit={handleSubmit}>


                        {/* =================================================
                            EMAIL
                        ================================================= */}

                        <div className="forgot-form-group">

                            <label htmlFor="forgot-email">
                                Email Address
                            </label>


                            <div className="forgot-input-wrapper">

                                <span className="forgot-input-icon">
                                    @
                                </span>


                                <input
                                    id="forgot-email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your registered email"
                                    value={email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    disabled={loading}
                                />

                            </div>

                        </div>


                        {/* =================================================
                            SEND OTP BUTTON
                        ================================================= */}

                        <button
                            type="submit"
                            className="forgot-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="forgot-spinner"></span>
                                    Sending OTP...
                                </>

                            ) : (

                                <>
                                    Send OTP
                                    <span className="forgot-button-arrow">
                                        →
                                    </span>
                                </>

                            )}

                        </button>

                    </form>


                    {/* =================================================
                        BACK TO LOGIN
                    ================================================= */}

                    <div className="forgot-back-section">

                        <button
                            type="button"
                            className="forgot-back-link"
                            onClick={() =>
                                navigate("/login")
                            }
                            disabled={loading}
                        >

                            <span className="forgot-back-arrow">
                                ←
                            </span>

                            Back to Login

                        </button>

                    </div>


                    {/* =================================================
                        SECURITY NOTE
                    ================================================= */}

                    <div className="forgot-security-note">

                        <span className="forgot-lock-icon">
                            🔒
                        </span>

                        Your connection is protected and
                        your account information remains secure.

                    </div>

                </div>

            </section>

        </main>
    );
}


export default ForgotPassword;