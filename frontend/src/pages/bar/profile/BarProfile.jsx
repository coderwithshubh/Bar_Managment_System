import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaShieldAlt,
    FaCheckCircle,
    FaArrowLeft,
    FaKey,
    FaEdit,
    FaTimes,
    FaSave
} from "react-icons/fa";

import { updateProfile } from "../../../services/authService";
import "./BarProfile.css";


function BarProfile() {

    const navigate = useNavigate();

    // =====================================================
    // LOAD LOGGED-IN USER
    // =====================================================

    const getStoredUser = () => {

        try {

            const storedUser =
                sessionStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "Unable to load profile:",
                error
            );

            return null;
        }
    };


    const [user, setUser] = useState(getStoredUser);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const [formData, setFormData] = useState(() => {

        const storedUser = getStoredUser();

        return {
            fullName:
                storedUser?.fullName ||
                storedUser?.name ||
                "",

            email:
                storedUser?.email ||
                "",

            mobileNumber:
                storedUser?.mobileNumber ||
                storedUser?.mobile ||
                ""
        };
    });

    const [formErrors, setFormErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSaving, setIsSaving] = useState(false);


    // =====================================================
    // REDIRECT IF USER IS NOT LOGGED IN
    // =====================================================

    useEffect(() => {

        if (!user) {

            navigate("/login", {
                replace: true
            });
        }

    }, [user, navigate]);


    // =====================================================
    // OPEN EDIT PROFILE
    // =====================================================

    const handleOpenEdit = () => {
        setFormData({
            fullName: user?.fullName || user?.name || "",
            email: user?.email || "",
            mobileNumber: user?.mobileNumber || user?.mobile || ""
        });
        setFormErrors({});
        setSubmitError("");
        setSuccessMessage("");
        setIsEditOpen(true);
    };

    const handleCloseEdit = () => {
        if (isSaving) return;
        setIsEditOpen(false);
        setFormErrors({});
        setSubmitError("");
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
        setFormErrors((previous) => ({ ...previous, [name]: "" }));
        setSubmitError("");
    };

    const validateForm = () => {
        const errors = {};
        const fullName = formData.fullName.trim();
        const email = formData.email.trim().toLowerCase();
        const mobileNumber = formData.mobileNumber.trim();

        if (!fullName) {
            errors.fullName = "Full name is required.";
        } else if (fullName.length < 2 || fullName.length > 100) {
            errors.fullName = "Full name must contain 2 to 100 characters.";
        }

        if (!email) {
            errors.email = "Email address is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = "Please enter a valid email address.";
        }

        if (!mobileNumber) {
            errors.mobileNumber = "Mobile number is required.";
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            errors.mobileNumber = "Mobile number must contain exactly 10 digits.";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveProfile = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        setIsSaving(true);
        setSubmitError("");
        setSuccessMessage("");

        try {
            const updatedUser = await updateProfile({
                fullName: formData.fullName,
                email: formData.email,
                mobileNumber: formData.mobileNumber
            });

            setUser(updatedUser);
            setIsEditOpen(false);
            setFormErrors({});
            setSuccessMessage("Profile updated successfully.");

            window.dispatchEvent(
                new CustomEvent("profileUpdated", {
                    detail: updatedUser
                })
            );
        } catch (error) {
            console.error("Profile update failed:", error);

            if (error?.message?.toLowerCase().includes("session") ||
                error?.message?.toLowerCase().includes("authenticated")) {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
                navigate("/login", { replace: true });
                return;
            }

            setSubmitError(
                error?.message ||
                "Unable to update profile. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (!user) {

        return (

            <div className="bar-profile-page">

                <div className="bar-profile-loading">

                    <div className="bar-profile-spinner"></div>

                    <p>
                        Loading profile...
                    </p>

                </div>

            </div>

        );

    }


    // =====================================================
    // USER DATA
    // =====================================================

    const userName =
        user.fullName ||
        user.name ||
        "User";


    const email =
        user.email ||
        "Not available";


    const mobileNumber =
        user.mobileNumber ||
        user.mobile ||
        "Not available";


    const rawRole =
        user.role ||
        "NORMAL_USER";


    const roleNames = {

        ADMIN: "Administrator",

        BAR_MANAGER: "Bar Manager",

        BARTENDER: "Bartender",

        CASHIER: "Cashier",

        NORMAL_USER: "User",

        MANAGER: "Manager",

        INVENTORY_MANAGER:
            "Inventory Manager"

    };


    const userRole =
        roleNames[rawRole] ||
        rawRole
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                char =>
                    char.toUpperCase()
            );


    const isActive =
        user.active !== false;


    const avatarInitial =
        userName
            .trim()
            .charAt(0)
            .toUpperCase() || "U";


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="bar-profile-page">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="bar-profile-page-header">

                <div className="bar-profile-heading">

                    <div className="bar-profile-title-icon">
                        <FaUser />
                    </div>

                    <div>

                        <span className="bar-profile-kicker">
                            ACCOUNT
                        </span>

                        <h1>
                            My Profile
                        </h1>

                        <p>
                            View your account information
                            and profile details.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="bar-profile-back-button"
                    onClick={() =>
                        navigate("/bar")
                    }
                >

                    <FaArrowLeft />

                    <span>
                        Back to Overview
                    </span>

                </button>

            </div>


            {successMessage && (
                <div className="bar-profile-alert bar-profile-alert-success" role="alert">
                    <FaCheckCircle />
                    <span>{successMessage}</span>
                    <button
                        type="button"
                        onClick={() => setSuccessMessage("")}
                        aria-label="Close success message"
                    >
                        <FaTimes />
                    </button>
                </div>
            )}

            {/* =================================================
                PROFILE CONTENT
            ================================================= */}

            <div className="bar-profile-content">


                {/* =================================================
                    PROFILE CARD
                ================================================= */}

                <section className="bar-profile-main-card">


                    {/* PROFILE HERO */}

                    <div className="bar-profile-hero">

                        <div className="bar-profile-large-avatar">

                            {avatarInitial}

                        </div>


                        <div className="bar-profile-hero-info">

                            <h2>
                                {userName}
                            </h2>

                            <p>
                                {email}
                            </p>

                            <span className="bar-profile-role-badge">

                                <FaShieldAlt />

                                {userRole}

                            </span>

                        </div>

                        <button
                            type="button"
                            className="bar-profile-edit-button"
                            onClick={handleOpenEdit}
                        >
                            <FaEdit />
                            <span>Edit Profile</span>
                        </button>


                    </div>


                    {/* PERSONAL INFORMATION */}

                    <div className="bar-profile-section">

                        <div className="bar-profile-section-heading">

                            <div>

                                <h3>
                                    Personal Information
                                </h3>

                                <p>
                                    Your registered account details
                                </p>

                            </div>

                        </div>


                        <div className="bar-profile-info-grid">


                            {/* FULL NAME */}

                            <div className="bar-profile-info-item">

                                <div className="bar-profile-info-icon">

                                    <FaUser />

                                </div>

                                <div>

                                    <span>
                                        Full Name
                                    </span>

                                    <strong>
                                        {userName}
                                    </strong>

                                </div>

                            </div>


                            {/* EMAIL */}

                            <div className="bar-profile-info-item">

                                <div className="bar-profile-info-icon">

                                    <FaEnvelope />

                                </div>

                                <div>

                                    <span>
                                        Email Address
                                    </span>

                                    <strong>
                                        {email}
                                    </strong>

                                </div>

                            </div>


                            {/* MOBILE */}

                            <div className="bar-profile-info-item">

                                <div className="bar-profile-info-icon">

                                    <FaPhone />

                                </div>

                                <div>

                                    <span>
                                        Mobile Number
                                    </span>

                                    <strong>
                                        {mobileNumber}
                                    </strong>

                                </div>

                            </div>


                            {/* ROLE */}

                            <div className="bar-profile-info-item">

                                <div className="bar-profile-info-icon">

                                    <FaShieldAlt />

                                </div>

                                <div>

                                    <span>
                                        Account Role
                                    </span>

                                    <strong>
                                        {userRole}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ACCOUNT STATUS */}

                    <div className="bar-profile-section">

                        <div className="bar-profile-section-heading">

                            <div>

                                <h3>
                                    Account Status
                                </h3>

                                <p>
                                    Current account security status
                                </p>

                            </div>

                        </div>


                        <div className="bar-profile-status-card">

                            <div className="bar-profile-status-icon">

                                <FaCheckCircle />

                            </div>


                            <div className="bar-profile-status-content">

                                <strong>
                                    Account is {isActive ? "Active" : "Inactive"}
                                </strong>

                                <span>
                                    {isActive
                                        ? "Your account is currently active and available for use."
                                        : "Your account has been disabled. Please contact the administrator."
                                    }
                                </span>

                            </div>

                        </div>

                    </div>


                </section>


                {/* =================================================
                    SECURITY CARD
                ================================================= */}

                <aside className="bar-profile-security-card">

                    <div className="bar-profile-security-icon">

                        <FaShieldAlt />

                    </div>


                    <h3>
                        Account Security
                    </h3>


                    <p>
                        Keep your account secure by
                        regularly updating your password.
                    </p>


                    <div className="bar-profile-security-divider">
                    </div>


                    <div className="bar-profile-security-item">

                        <div className="bar-profile-security-item-icon">

                            <FaKey />

                        </div>

                        <div>

                            <strong>
                                Password
                            </strong>

                            <span>
                                Keep your password private
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="bar-profile-change-password"
                        onClick={() =>
                            navigate(
                                "/bar/change-password"
                            )
                        }
                    >

                        <FaKey />

                        Change Password

                    </button>

                </aside>


            </div>


        {/* EDIT PROFILE MODAL */}
        {isEditOpen && (
            <div
                className="bar-profile-modal-overlay"
                role="presentation"
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget) {
                        handleCloseEdit();
                    }
                }}
            >
                <div
                    className="bar-profile-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="edit-profile-title"
                >
                    <div className="bar-profile-modal-header">
                        <div>
                            <span className="bar-profile-modal-kicker">ACCOUNT</span>
                            <h2 id="edit-profile-title">Edit Profile</h2>
                            <p>Update your personal account information.</p>
                        </div>

                        <button
                            type="button"
                            className="bar-profile-modal-close"
                            onClick={handleCloseEdit}
                            disabled={isSaving}
                            aria-label="Close edit profile"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {submitError && (
                        <div className="bar-profile-alert bar-profile-alert-error" role="alert">
                            <span>{submitError}</span>
                        </div>
                    )}

                    <form className="bar-profile-edit-form" onSubmit={handleSaveProfile} noValidate>
                        <div className="bar-profile-form-group">
                            <label htmlFor="profile-full-name">Full Name</label>
                            <div className="bar-profile-input-wrapper">
                                <FaUser />
                                <input
                                    id="profile-full-name"
                                    name="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    maxLength={100}
                                    autoComplete="name"
                                    disabled={isSaving}
                                />
                            </div>
                            {formErrors.fullName && (
                                <small className="bar-profile-field-error">{formErrors.fullName}</small>
                            )}
                        </div>

                        <div className="bar-profile-form-group">
                            <label htmlFor="profile-email">Email Address</label>
                            <div className="bar-profile-input-wrapper">
                                <FaEnvelope />
                                <input
                                    id="profile-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    maxLength={150}
                                    autoComplete="email"
                                    disabled={isSaving}
                                />
                            </div>
                            {formErrors.email && (
                                <small className="bar-profile-field-error">{formErrors.email}</small>
                            )}
                        </div>

                        <div className="bar-profile-form-group">
                            <label htmlFor="profile-mobile-number">Mobile Number</label>
                            <div className="bar-profile-input-wrapper">
                                <FaPhone />
                                <input
                                    id="profile-mobile-number"
                                    name="mobileNumber"
                                    type="tel"
                                    value={formData.mobileNumber}
                                    onChange={handleInputChange}
                                    maxLength={10}
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    disabled={isSaving}
                                />
                            </div>
                            {formErrors.mobileNumber && (
                                <small className="bar-profile-field-error">{formErrors.mobileNumber}</small>
                            )}
                        </div>

                        <div className="bar-profile-modal-actions">
                            <button type="button" className="bar-profile-cancel-button" onClick={handleCloseEdit} disabled={isSaving}>
                                <FaTimes />
                                Cancel
                            </button>
                            <button type="submit" className="bar-profile-save-button" disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <span className="bar-profile-button-spinner"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        </div>

    );

}

export default BarProfile;