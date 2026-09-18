import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaCalendarAlt,
    FaBell,
    FaUser,
    FaKey,
    FaCog,
    FaSignOutAlt,
    FaChevronDown,
} from "react-icons/fa";

import "./BarNavbar.css";


function BarNavbar() {

    const navigate = useNavigate();

    // =====================================================
    // USER STATE
    // =====================================================

    const [user, setUser] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const profileRef = useRef(null);


    // =====================================================
    // LOAD LOGGED-IN USER
    // =====================================================

    useEffect(() => {

        const loadUser = () => {

            try {

                const storedUser =
                    sessionStorage.getItem("user");

                if (storedUser) {

                    setUser(
                        JSON.parse(storedUser)
                    );

                } else {

                    setUser(null);

                }

            } catch (error) {

                console.error(
                    "Unable to load logged-in user:",
                    error
                );

                setUser(null);

            }

        };


        loadUser();


        window.addEventListener(
            "storage",
            loadUser
        );


        return () => {

            window.removeEventListener(
                "storage",
                loadUser
            );

        };

    }, []);


    // =====================================================
    // CLOSE PROFILE MENU ON OUTSIDE CLICK
    // =====================================================

    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {

                setProfileOpen(false);

            }

        };


        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    // =====================================================
    // CLOSE PROFILE MENU WITH ESC
    // =====================================================

    useEffect(() => {

        const handleEscape = (event) => {

            if (event.key === "Escape") {

                setProfileOpen(false);

            }

        };


        document.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);


    // =====================================================
    // DATE
    // =====================================================

    const currentDate = new Date();

    const formattedDate =
        currentDate.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );


    // =====================================================
    // USER NAME
    // =====================================================

    const userName =
        user?.fullName ||
        user?.name ||
        user?.email ||
        "User";


    // =====================================================
    // USER ROLE
    // =====================================================

    const rawRole =
        user?.role || "NORMAL_USER";


    const roleNames = {

        ADMIN: "Administrator",

        BAR_MANAGER: "Bar Manager",

        BARTENDER: "Bartender",

        CASHIER: "Cashier",

        NORMAL_USER: "User",

        MANAGER: "Manager",

        INVENTORY_MANAGER: "Inventory Manager"

    };


    const userRole =
        roleNames[rawRole] ||
        rawRole
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                char => char.toUpperCase()
            );


    // =====================================================
    // ROLE-BASED SUBTITLE
    // =====================================================

    const roleSubtitle = {

        ADMIN:
            "Full system access",

        BAR_MANAGER:
            "Manage bar operations",

        BARTENDER:
            "View bar operations",

        CASHIER:
            "View billing operations",

        NORMAL_USER:
            "View bar information",

        MANAGER:
            "Manage bar operations",

        INVENTORY_MANAGER:
            "Manage inventory operations"

    };


    const subtitle =
        roleSubtitle[rawRole] ||
        "Bar Management";


    // =====================================================
    // AVATAR INITIAL
    // =====================================================

    const avatarInitial =
        userName
            .trim()
            .charAt(0)
            .toUpperCase() || "U";


    // =====================================================
    // PROFILE MENU
    // =====================================================

    const openProfileMenu = () => {

        setProfileOpen(
            previous => !previous
        );

    };


    // =====================================================
    // NAVIGATION
    // =====================================================

    const handleProfileNavigation = (path) => {

        setProfileOpen(false);

        navigate(path);

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogoutClick = () => {

        setProfileOpen(false);
        setShowLogoutModal(true);

    };

    const handleCancelLogout = () => {

        setShowLogoutModal(false);

    };

    const handleConfirmLogout = () => {

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        setShowLogoutModal(false);
        setProfileOpen(false);

        navigate("/login", {
            replace: true
        });

    };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <header className="bar-navbar">

            {/* =========================================
                PAGE TITLE
            ========================================= */}

            <div className="bar-navbar-title">

                <span className="bar-navbar-kicker">
                    BAR MANAGEMENT
                </span>

                <h1>
                    Bar Management
                </h1>

                <p>
                    {subtitle}
                </p>

            </div>


            {/* =========================================
                RIGHT SIDE
            ========================================= */}

            <div className="bar-navbar-right">


                {/* =====================================
                    DATE
                ===================================== */}

                <div
                    className="bar-navbar-date"
                    title={formattedDate}
                >

                    <FaCalendarAlt />

                    <span>
                        {formattedDate}
                    </span>

                </div>


                {/* =====================================
                    NOTIFICATION
                ===================================== */}

                <button
                    type="button"
                    className="bar-navbar-notification"
                    aria-label="Notifications"
                    title="Notifications"
                    onClick={() =>
                        handleProfileNavigation(
                            "/bar/notifications"
                        )
                    }
                >

                    <FaBell />

                    <span className="bar-notification-dot">
                    </span>

                </button>


                {/* =====================================
                    USER PROFILE
                ===================================== */}

                <div
                    className="bar-navbar-profile-wrapper"
                    ref={profileRef}
                >

                    <button
                        type="button"
                        className={`bar-navbar-user ${
                            profileOpen
                                ? "profile-open"
                                : ""
                        }`}
                        onClick={openProfileMenu}
                        aria-expanded={profileOpen}
                        aria-haspopup="menu"
                    >

                        <div
                            className="bar-navbar-avatar"
                            title={userName}
                        >

                            {avatarInitial}

                        </div>


                        <div className="bar-navbar-user-info">

                            <strong>
                                {userName}
                            </strong>

                            <span>
                                {userRole}
                            </span>

                        </div>


                        <FaChevronDown
                            className={`bar-navbar-profile-arrow ${
                                profileOpen
                                    ? "arrow-open"
                                    : ""
                            }`}
                        />

                    </button>


                    {/* =================================
                        PROFILE DROPDOWN
                    ================================= */}

                    {profileOpen && (

                        <div
                            className="bar-profile-dropdown"
                            role="menu"
                        >

                            {/* USER HEADER */}

                            <div className="bar-profile-header">

                                <div className="bar-profile-avatar">

                                    {avatarInitial}

                                </div>


                                <div className="bar-profile-header-info">

                                    <strong>
                                        {userName}
                                    </strong>

                                    <span>
                                        {user?.email || ""}
                                    </span>

                                    <small>
                                        {userRole}
                                    </small>

                                </div>

                            </div>


                            {/* MENU */}

                            <div className="bar-profile-menu">


                                {/* MY PROFILE */}

                                <button
                                    type="button"
                                    className="bar-profile-menu-item"
                                    onClick={() =>
                                        handleProfileNavigation(
                                            "/bar/profile"
                                        )
                                    }
                                >

                                    <span className="bar-profile-menu-icon">
                                        <FaUser />
                                    </span>

                                    <span className="bar-profile-menu-content">

                                        <strong>
                                            My Profile
                                        </strong>

                                        <small>
                                            View your personal information
                                        </small>

                                    </span>

                                </button>


                                {/* CHANGE PASSWORD */}

                                <button
                                    type="button"
                                    className="bar-profile-menu-item"
                                    onClick={() =>
                                        handleProfileNavigation(
                                            "/bar/change-password"
                                        )
                                    }
                                >

                                    <span className="bar-profile-menu-icon">
                                        <FaKey />
                                    </span>

                                    <span className="bar-profile-menu-content">

                                        <strong>
                                            Change Password
                                        </strong>

                                        <small>
                                            Update your account password
                                        </small>

                                    </span>

                                </button>


                                {/* ACCOUNT SETTINGS */}

                                <button
                                    type="button"
                                    className="bar-profile-menu-item"
                                    onClick={() =>
                                        handleProfileNavigation(
                                            "/bar/account-settings"
                                        )
                                    }
                                >

                                    <span className="bar-profile-menu-icon">
                                        <FaCog />
                                    </span>

                                    <span className="bar-profile-menu-content">

                                        <strong>
                                            Account Settings
                                        </strong>

                                        <small>
                                            Manage account preferences
                                        </small>

                                    </span>

                                </button>


                                {/* NOTIFICATIONS */}

                                <button
                                    type="button"
                                    className="bar-profile-menu-item"
                                    onClick={() =>
                                        handleProfileNavigation(
                                            "/bar/notifications"
                                        )
                                    }
                                >

                                    <span className="bar-profile-menu-icon">
                                        <FaBell />
                                    </span>

                                    <span className="bar-profile-menu-content">

                                        <strong>
                                            Notifications
                                        </strong>

                                        <small>
                                            View system notifications
                                        </small>

                                    </span>

                                </button>

                            </div>


                            {/* LOGOUT */}

                            <div className="bar-profile-logout-section">

                                <button
                                    type="button"
                                    className="bar-profile-logout"
                                    onClick={handleLogoutClick}
                                >

                                    <span className="bar-profile-logout-icon">
                                        <FaSignOutAlt />
                                    </span>

                                    <span>
                                        Logout
                                    </span>

                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>


        {/* =================================================
            LOGOUT CONFIRMATION MODAL
        ================================================= */}

        {showLogoutModal && (

            <div
                className="bar-logout-modal-overlay"
                role="presentation"
                onMouseDown={(event) => {

                    if (event.target === event.currentTarget) {
                        handleCancelLogout();
                    }

                }}
            >

                <div
                    className="bar-logout-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="bar-logout-modal-title"
                    aria-describedby="bar-logout-modal-description"
                    onMouseDown={(event) => event.stopPropagation()}
                >

                    <div className="bar-logout-modal-top">

                        <div className="bar-logout-modal-icon">
                            <FaSignOutAlt />
                        </div>

                        <div className="bar-logout-modal-badge">
                            Secure Logout
                        </div>

                    </div>

                    <div className="bar-logout-modal-content">

                        <h2 id="bar-logout-modal-title">
                            Sign out of your account?
                        </h2>

                        <p id="bar-logout-modal-description">
                            You are about to leave the Bar Management
                            System. Your current session will be securely
                            ended.
                        </p>

                    </div>

                    <div className="bar-logout-modal-divider">
                    </div>

                    <div className="bar-logout-modal-actions">

                        <button
                            type="button"
                            className="bar-logout-modal-cancel"
                            onClick={handleCancelLogout}
                        >
                            Stay Signed In
                        </button>

                        <button
                            type="button"
                            className="bar-logout-modal-confirm"
                            onClick={handleConfirmLogout}
                        >
                            <FaSignOutAlt />
                            <span>Yes, Logout</span>
                        </button>

                    </div>

                    <button
                        type="button"
                        className="bar-logout-modal-close"
                        aria-label="Close logout confirmation"
                        title="Close"
                        onClick={handleCancelLogout}
                    >
                        ×
                    </button>

                </div>

            </div>

        )}

        </header>

    );

}
export default BarNavbar;