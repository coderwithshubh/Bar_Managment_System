import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaArrowLeft,
    FaKey,
    FaLock,
    FaShieldAlt,
    FaCheckCircle,
    FaEye,
    FaEyeSlash
} from "react-icons/fa";

import apiClient from "../../../services/apiClient";

import "./ChangePassword.css";


function ChangePassword() {

    const navigate = useNavigate();


    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });


    const [showCurrent, setShowCurrent] =
        useState(false);

    const [showNew, setShowNew] =
        useState(false);

    const [showConfirm, setShowConfirm] =
        useState(false);


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));


        setError("");
        setSuccess("");
    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        setError("");
        setSuccess("");


        // ------------------------------------------
        // Current Password
        // ------------------------------------------

        if (!formData.currentPassword) {

            setError(
                "Please enter your current password."
            );

            return;
        }


        // ------------------------------------------
        // New Password
        // ------------------------------------------

        if (!formData.newPassword) {

            setError(
                "Please enter your new password."
            );

            return;
        }


        if (formData.newPassword.length < 8) {

            setError(
                "New password must contain at least 8 characters."
            );

            return;
        }


        // ------------------------------------------
        // Confirm Password
        // ------------------------------------------

        if (!formData.confirmPassword) {

            setError(
                "Please confirm your new password."
            );

            return;
        }


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
        // Same Password
        // ------------------------------------------

        if (
            formData.currentPassword ===
            formData.newPassword
        ) {

            setError(
                "New password must be different from current password."
            );

            return;
        }


        // ------------------------------------------
        // API
        // ------------------------------------------

        try {

            setLoading(true);


            await apiClient.post(
                "/api/auth/change-password",
                formData
            );


            setSuccess(
                "Password changed successfully."
            );


            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });


        } catch (err) {

            console.error(
                "Change password error:",
                err
            );


            const message =
                err?.response?.data;


            setError(
                typeof message === "string"
                    ? message
                    : "Unable to change password. Please try again."
            );


        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // JSX
    // ==========================================

    return (

        <div className="change-password-page">


            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="change-password-header">

                <div className="change-password-heading">

                    <div className="change-password-title-icon">

                        <FaKey />

                    </div>


                    <div>

                        <span className="change-password-kicker">
                            ACCOUNT SECURITY
                        </span>

                        <h1>
                            Change Password
                        </h1>

                        <p>
                            Update your password to keep
                            your account secure.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="change-password-back"
                    onClick={() =>
                        navigate("/bar/profile")
                    }
                >

                    <FaArrowLeft />

                    <span>
                        Back to Profile
                    </span>

                </button>

            </div>


            {/* ==========================================
                CONTENT
            ========================================== */}

            <div className="change-password-layout">


                {/* ==========================================
                    FORM
                ========================================== */}

                <section className="change-password-card">


                    <div className="change-password-card-header">

                        <div className="change-password-card-icon">

                            <FaLock />

                        </div>


                        <div>

                            <h2>
                                Update Password
                            </h2>

                            <p>
                                Enter your current password
                                and choose a new password.
                            </p>

                        </div>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="change-password-alert error">

                            <span>
                                !
                            </span>

                            {error}

                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div className="change-password-alert success">

                            <FaCheckCircle />

                            {success}

                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        noValidate
                    >


                        {/* CURRENT PASSWORD */}

                        <div className="password-field">

                            <label htmlFor="currentPassword">
                                Current Password
                            </label>


                            <div className="password-input-wrapper">

                                <FaLock />

                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type={
                                        showCurrent
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        formData.currentPassword
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                    autoComplete="current-password"
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowCurrent(
                                            previous =>
                                                !previous
                                        )
                                    }
                                    aria-label={
                                        showCurrent
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >

                                    {showCurrent
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                    }

                                </button>

                            </div>

                        </div>


                        {/* NEW PASSWORD */}

                        <div className="password-field">

                            <label htmlFor="newPassword">
                                New Password
                            </label>


                            <div className="password-input-wrapper">

                                <FaKey />

                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type={
                                        showNew
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        formData.newPassword
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    autoComplete="new-password"
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowNew(
                                            previous =>
                                                !previous
                                        )
                                    }
                                    aria-label={
                                        showNew
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >

                                    {showNew
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                    }

                                </button>

                            </div>


                            <span className="password-hint">
                                Minimum 8 characters
                            </span>

                        </div>


                        {/* CONFIRM PASSWORD */}

                        <div className="password-field">

                            <label htmlFor="confirmPassword">
                                Confirm New Password
                            </label>


                            <div className="password-input-wrapper">

                                <FaShieldAlt />

                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirm
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                    autoComplete="new-password"
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirm(
                                            previous =>
                                                !previous
                                        )
                                    }
                                    aria-label={
                                        showConfirm
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >

                                    {showConfirm
                                        ? <FaEyeSlash />
                                        : <FaEye />
                                    }

                                </button>

                            </div>

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="change-password-submit"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="button-spinner">
                                    </span>

                                    Updating Password...
                                </>

                            ) : (

                                <>
                                    <FaKey />

                                    Change Password
                                </>

                            )}

                        </button>

                    </form>

                </section>


                {/* ==========================================
                    SECURITY CARD
                ========================================== */}

                <aside className="password-security-card">

                    <div className="security-card-icon">

                        <FaShieldAlt />

                    </div>


                    <h3>
                        Password Security
                    </h3>


                    <p>
                        Use a strong password that is
                        difficult for others to guess.
                    </p>


                    <div className="security-rules">

                        <div>

                            <FaCheckCircle />

                            <span>
                                At least 8 characters
                            </span>

                        </div>


                        <div>

                            <FaCheckCircle />

                            <span>
                                Use a unique password
                            </span>

                        </div>


                        <div>

                            <FaCheckCircle />

                            <span>
                                Do not share your password
                            </span>

                        </div>


                        <div>

                            <FaCheckCircle />

                            <span>
                                Avoid simple passwords
                            </span>

                        </div>

                    </div>

                </aside>

            </div>

        </div>

    );
}


export default ChangePassword;