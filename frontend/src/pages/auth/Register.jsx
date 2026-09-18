import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "../../services/authService";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobileNumber: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Password visibility states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setSuccess("");
    };


    // ==========================================
    // VALIDATION
    // ==========================================

    const validateForm = () => {

        if (!formData.fullName.trim()) {
            return "Please enter your full name.";
        }

        if (!formData.email.trim()) {
            return "Please enter your email address.";
        }

        if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email.trim()
            )
        ) {
            return "Please enter a valid email address.";
        }

        if (!formData.mobileNumber.trim()) {
            return "Please enter your mobile number.";
        }

        if (
            !/^[6-9]\d{9}$/.test(
                formData.mobileNumber.trim()
            )
        ) {
            return "Please enter a valid 10-digit mobile number.";
        }

        if (!formData.password) {
            return "Please enter a password.";
        }

        if (formData.password.length < 8) {
            return "Password must contain at least 8 characters.";
        }

        if (!formData.confirmPassword) {
            return "Please confirm your password.";
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            return "Password and confirm password do not match.";
        }

        return null;
    };


    // ==========================================
    // REGISTER
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);

            const response = await registerUser({
                fullName: formData.fullName.trim(),
                email: formData.email.trim().toLowerCase(),
                mobileNumber: formData.mobileNumber.trim(),
                password: formData.password,
                confirmPassword: formData.confirmPassword
            });

            console.log(
                "Registration successful:",
                response
            );

            setSuccess(
                "Account created successfully. Redirecting to login..."
            );

            setFormData({
                fullName: "",
                email: "",
                mobileNumber: "",
                password: "",
                confirmPassword: ""
            });

            setShowPassword(false);
            setShowConfirmPassword(false);

            setTimeout(() => {
               navigate("/login");
            }, 2000);

            // Reset password visibility after successful registration
            setShowPassword(false);
            setShowConfirmPassword(false);

        } catch (error) {

            setError(
                error.message ||
                "Unable to create your account. Please try again."
            );

        } finally {

            setLoading(false);
        }
    };


    // ==========================================
    // PASSWORD TOGGLE
    // ==========================================

    const togglePasswordVisibility = () => {
        setShowPassword((previous) => !previous);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((previous) => !previous);
    };


    return (
        <main className="register-page">

            {/* ======================================
                BRAND SECTION
            ====================================== */}

            <section className="register-brand">

                <div className="register-brand-content">

                    <div className="brand-logo">
                        BM
                    </div>

                    <span className="brand-overline">
                        SMART BAR OPERATIONS
                    </span>

                    <h1>
                        Join the
                        <span>
                            Bar Management System
                        </span>
                    </h1>

                    <p>
                        Create your account and start managing
                        your bar operations from one powerful
                        platform.
                    </p>

                </div>

            </section>


            {/* ======================================
                REGISTER SECTION
            ====================================== */}

            <section className="register-section">

                <div className="register-card">

                    <div className="register-header">

                        <span className="welcome-label">
                            NEW ACCOUNT
                        </span>

                        <h2>
                            Create Account
                        </h2>

                        <p>
                            Enter your details to create
                            your staff account.
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
                        REGISTRATION FORM
                    ================================== */}

                    <form onSubmit={handleSubmit}>

                        {/* FULL NAME */}

                        <div className="form-group">

                            <label htmlFor="fullName">
                                Full Name
                            </label>

                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                autoComplete="name"
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                autoComplete="email"
                            />

                        </div>


                        {/* MOBILE */}

                        <div className="form-group">

                            <label htmlFor="mobileNumber">
                                Mobile Number
                            </label>

                            <input
                                id="mobileNumber"
                                type="tel"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                placeholder="Enter 10-digit mobile number"
                                maxLength={10}
                                autoComplete="tel"
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="register-password-wrapper">

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
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={togglePasswordVisibility}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    title={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} strokeWidth={2} />
                                    ) : (
                                        <Eye size={19} strokeWidth={2} />
                                    )}
                                </button>

                            </div>

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="form-group">

                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>

                            <div className="register-password-wrapper">

                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="register-password-toggle"
                                    onClick={toggleConfirmPasswordVisibility}
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                    title={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={19} strokeWidth={2} />
                                    ) : (
                                        <Eye size={19} strokeWidth={2} />
                                    )}
                                </button>

                            </div>

                        </div>


                        {/* REGISTER BUTTON */}

                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    Create Account

                                    <span className="button-arrow">
                                        →
                                    </span>
                                </>
                            )}

                        </button>

                    </form>


                    {/* ==================================
                        LOGIN LINK
                    ================================== */}

                    <div className="login-link-section">

                        <span>
                            Already have an account?
                        </span>

                        <button
                            type="button"
                            className="login-link"
                            onClick={() => navigate("/login")}
                        >
                            Sign In
                        </button>

                    </div>

                </div>

            </section>

        </main>
    );
}

export default Register;