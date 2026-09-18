import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function Login() {

    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });


    // =====================================================
    // UI STATE
    // =====================================================

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    const navigate = useNavigate();


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));


        // Clear old messages while typing

        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }
    };


    // =====================================================
    // LOGIN
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // Clear previous messages

        setError("");
        setSuccess("");


        // =================================================
        // EMAIL VALIDATION
        // =================================================

        const email = formData.email.trim();


        if (!email) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        // =================================================
        // PASSWORD VALIDATION
        // =================================================

        if (!formData.password) {

            setError(
                "Please enter your password."
            );

            return;
        }


        try {

            setLoading(true);


            // =================================================
            // LOGIN API
            // =================================================

            const response = await loginUser({
                email,
                password: formData.password
            });


            // =================================================
            // CHECK TOKEN
            // =================================================

            if (!response?.token) {

                throw new Error(
                    "Login was unsuccessful. The server did not return a valid session."
                );
            }


            // =================================================
            // STORE JWT TOKEN
            // =================================================

            sessionStorage.setItem(
                "token",
                response.token
            );


            // =================================================
            // STORE USER
            // =================================================

            sessionStorage.setItem(
                "user",
                JSON.stringify(response)
            );


            // =================================================
            // SUCCESS MESSAGE
            // =================================================

            const userName =
                response.fullName ||
                response.name ||
                "User";


            setSuccess(
                `Welcome back, ${userName}!`
            );


            // =================================================
            // REDIRECT TO BAR OVERVIEW
            // =================================================

            setTimeout(() => {

                navigate("/bar", {
                    replace: true
                });

            }, 800);


        } catch (error) {

            // =================================================
            // ERROR
            // =================================================

            setError(
                error?.message ||
                "Unable to sign in. Please check your credentials and try again."
            );


        } finally {

            setLoading(false);
        }
    };


    return (

        <main className="login-page">


            {/* ======================================
                BRANDING SECTION
            ====================================== */}

            <section className="login-brand">

                <div className="brand-content">


                    {/* LOGO */}

                    <div className="brand-logo">
                        BM
                    </div>


                    {/* BRAND TEXT */}

                    <div className="brand-text">

                        <p className="brand-overline">
                            SMART BAR OPERATIONS
                        </p>


                        <h1>

                            Bar Management

                            <span>
                                System
                            </span>

                        </h1>


                        <p className="brand-description">

                            Manage your bar operations,
                            inventory, staff and billing
                            from one powerful platform.

                        </p>

                    </div>


                    {/* SECURITY STATUS */}

                    <div className="brand-footer">

                        <span className="status-dot"></span>

                        Secure Management Platform

                    </div>

                </div>

            </section>


            {/* ======================================
                LOGIN SECTION
            ====================================== */}

            <section className="login-section">

                <div className="login-card">


                    {/* ==================================
                        LOGIN HEADER
                    ================================== */}

                    <div className="login-header">

                        <span className="welcome-label">
                            ACCOUNT LOGIN
                        </span>


                        <h2>
                            Welcome Back
                        </h2>


                        <p>
                            Sign in to continue to your
                            management dashboard.
                        </p>

                    </div>


                    {/* ==================================
                        ERROR MESSAGE
                    ================================== */}

                    {error && (

                        <div
                            className="message error-message"
                            role="alert"
                        >

                            <span className="message-icon">
                                !
                            </span>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* ==================================
                        SUCCESS MESSAGE
                    ================================== */}

                    {success && (

                        <div
                            className="message success-message"
                            role="status"
                        >

                            <span className="message-icon">
                                ✓
                            </span>

                            <span>
                                {success}
                            </span>

                        </div>

                    )}


                    {/* ==================================
                        LOGIN FORM
                    ================================== */}

                    <form onSubmit={handleSubmit}>


                        {/* ==================================
                            EMAIL
                        ================================== */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>


                            <div className="input-wrapper">

                                <span className="input-icon">
                                    @
                                </span>


                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    disabled={loading}
                                    required
                                />

                            </div>

                        </div>


                        {/* ==================================
                            PASSWORD
                        ================================== */}

                        <div className="form-group">

                            <div className="password-label">

                                <label htmlFor="password">
                                    Password
                                </label>


                                {/* ==================================
                                    FORGOT PASSWORD
                                ================================== */}

                                <button
                                    type="button"
                                    className="forgot-link"
                                    onClick={() =>
                                        navigate("/forgot-password")
                                    }
                                    disabled={loading}
                                >
                                    Forgot Password?
                                </button>

                            </div>


                            <div className="input-wrapper">

                                <span className="input-icon">
                                    •
                                </span>


                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    disabled={loading}
                                    required
                                />


                                {/* ==================================
                                    SHOW / HIDE PASSWORD
                                ================================== */}

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    disabled={loading}
                                >

                                    {
                                        showPassword
                                            ? "Hide"
                                            : "Show"
                                    }

                                </button>

                            </div>

                        </div>


                        {/* ==================================
                            LOGIN BUTTON
                        ================================== */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>

                                    <span className="spinner"></span>

                                    Signing in...

                                </>

                            ) : (

                                <>

                                    Sign In

                                    <span className="button-arrow">
                                        →
                                    </span>

                                </>

                            )}

                        </button>

                    </form>


                    {/* ==================================
                        REGISTER LINK
                    ================================== */}

                    <div className="login-register-section">

                        <span>
                            Don't have an account?
                        </span>


                        <button
                            type="button"
                            className="register-link"
                            onClick={() =>
                                navigate("/register")
                            }
                            disabled={loading}
                        >

                            Create Account

                        </button>

                    </div>


                    {/* ==================================
                        SECURITY NOTE
                    ================================== */}

                    <div className="security-note">

                        Your connection is protected and
                        your credentials are securely processed.

                    </div>

                </div>

            </section>

        </main>
    );
}


export default Login;