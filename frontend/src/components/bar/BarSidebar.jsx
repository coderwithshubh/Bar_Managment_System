import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
    FaWineGlassAlt,
    FaChartPie,
    FaTags,
    FaCocktail,
    FaBoxes,
    FaChair,
    FaClipboardList,
    FaFileInvoiceDollar,
    FaChartBar,
    FaSignOutAlt,
    FaTimes,
    FaBars,
    FaChevronRight
} from "react-icons/fa";

import "./BarSidebar.css";


function BarSidebar() {

    const navigate = useNavigate();

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // ==========================================
    // CURRENT LOGGED-IN USER
    // ==========================================

    const getLoggedInUser = () => {

        try {

            const storedUser =
                sessionStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "Unable to read logged-in user:",
                error
            );

            return null;
        }
    };


    const [user, setUser] = useState(
        getLoggedInUser()
    );


    // ==========================================
    // FORMAT ROLE
    // ==========================================

    const formatRole = (role) => {

        if (!role) {
            return "User";
        }

        const roleMap = {

            ADMIN: "Admin",

            BAR_MANAGER: "Bar Manager",

            BARTENDER: "Bartender",

            CASHIER: "Cashier",

            NORMAL_USER: "Normal User",

            MANAGER: "Manager",

            INVENTORY_MANAGER:
                "Inventory Manager"
        };

        return (
            roleMap[role] ||
            role
                .replaceAll("_", " ")
                .toLowerCase()
                .replace(/\b\w/g, letter =>
                    letter.toUpperCase()
                )
        );
    };


    // ==========================================
    // USER NAME
    // ==========================================

    const userName =
        user?.fullName ||
        user?.name ||
        "User";


    // ==========================================
    // USER ROLE
    // ==========================================

    const userRole =
        formatRole(user?.role);


    // ==========================================
    // USER AVATAR
    // ==========================================

    const userInitial =
        userName
            .trim()
            .charAt(0)
            .toUpperCase() || "U";


    // ==========================================
    // ACTIVE LINK CLASS
    // ==========================================

    const linkClass = ({ isActive }) =>
        isActive
            ? "bar-sidebar-link active"
            : "bar-sidebar-link";


    // ==========================================
    // CLOSE MOBILE SIDEBAR
    // ==========================================

    const closeMobileSidebar = () => {
        setMobileOpen(false);
    };


    // ==========================================
    // NAVIGATION WITH MOBILE CLOSE
    // ==========================================

    const handleNavigation = () => {
        setMobileOpen(false);
    };


    // ==========================================
    // OPEN LOGOUT MODAL
    // ==========================================

    const handleLogoutClick = () => {

        setShowLogoutModal(true);

        setMobileOpen(false);
    };


    // ==========================================
    // CLOSE LOGOUT MODAL
    // ==========================================

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };


    // ==========================================
    // CONFIRM LOGOUT
    // ==========================================

    const handleConfirmLogout = () => {

        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");

        setUser(null);
        setShowLogoutModal(false);
        setMobileOpen(false);

        navigate("/login", {
            replace: true
        });
    };


    // ==========================================
    // REFRESH USER FROM SESSION STORAGE
    // ==========================================

    useEffect(() => {

        const refreshUser = () => {

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
                    "Unable to refresh user:",
                    error
                );

                setUser(null);
            }
        };


        window.addEventListener(
            "storage",
            refreshUser
        );


        return () => {

            window.removeEventListener(
                "storage",
                refreshUser
            );

        };

    }, []);


    // ==========================================
    // ESCAPE KEY
    // ==========================================

    useEffect(() => {

        const handleKeyDown = (event) => {

            if (event.key === "Escape") {

                if (showLogoutModal) {
                    setShowLogoutModal(false);
                    return;
                }

                if (mobileOpen) {
                    setMobileOpen(false);
                }
            }
        };


        document.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [
        showLogoutModal,
        mobileOpen
    ]);


    // ==========================================
    // BODY SCROLL LOCK
    // ==========================================

    useEffect(() => {

        if (
            showLogoutModal ||
            mobileOpen
        ) {

            document.body.style.overflow =
                "hidden";

        } else {

            document.body.style.overflow =
                "";
        }


        return () => {

            document.body.style.overflow =
                "";

        };

    }, [
        showLogoutModal,
        mobileOpen
    ]);


    // ==========================================
    // RENDER
    // ==========================================

    return (
        <>
            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}

            <button
                type="button"
                className="bar-mobile-menu-button"
                onClick={() =>
                    setMobileOpen(true)
                }
                aria-label="Open navigation menu"
            >
                <FaBars />
            </button>


            {/* =================================================
                MOBILE OVERLAY
            ================================================= */}

            {mobileOpen && (
                <div
                    className="bar-sidebar-overlay"
                    onClick={closeMobileSidebar}
                    aria-hidden="true"
                />
            )}


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                className={
                    mobileOpen
                        ? "bar-sidebar mobile-open"
                        : "bar-sidebar"
                }
            >

                {/* =========================================
                    BRAND
                ========================================= */}

                <div className="bar-sidebar-brand">

                    <div className="bar-brand-icon">
                        <FaWineGlassAlt />
                    </div>


                    <div className="bar-brand-text">

                        <h2>
                            MANGAL BAR
                        </h2>

                        <span>
                            Bar Management
                        </span>

                    </div>


                    {/* MOBILE CLOSE */}

                    <button
                        type="button"
                        className="bar-mobile-close"
                        onClick={
                            closeMobileSidebar
                        }
                        aria-label="Close navigation menu"
                    >
                        <FaTimes />
                    </button>

                </div>


                {/* =========================================
                    USER MINI CARD
                ========================================= */}

                <div className="bar-sidebar-user-mini">

                    <div className="bar-mini-avatar">
                        {userInitial}
                    </div>

                    <div className="bar-mini-user-info">

                        <strong>
                            {userName}
                        </strong>

                        <span>
                            {userRole}
                        </span>

                    </div>

                    <span className="bar-online-dot" />

                </div>


                {/* =========================================
                    NAVIGATION
                ========================================= */}

                <nav className="bar-sidebar-nav">

                    <div className="bar-menu-section">

                        <p className="bar-menu-title">
                            OPERATIONS
                        </p>


                        {/* OVERVIEW */}

                        <NavLink
                            to="/bar"
                            end
                            className={linkClass}
                            onClick={
                                handleNavigation
                            }
                        >

                            <FaChartPie
                                className="bar-menu-icon"
                            />

                            <span>
                                Overview
                            </span>

                            <FaChevronRight
                                className="bar-link-arrow"
                            />

                        </NavLink>


                        {/* CATEGORIES */}

                        <NavLink
                            to="/bar/categories"
                            className={linkClass}
                            onClick={
                                handleNavigation
                            }
                        >

                            <FaTags
                                className="bar-menu-icon"
                            />

                            <span>
                                Categories
                            </span>

                            <FaChevronRight
                                className="bar-link-arrow"
                            />

                        </NavLink>


                        {/* MENU */}

                        <NavLink
                            to="/bar/menu"
                            className={linkClass}
                            onClick={
                                handleNavigation
                            }
                        >

                            <FaCocktail
                                className="bar-menu-icon"
                            />

                            <span>
                                Menu / Drinks
                            </span>

                            <FaChevronRight
                                className="bar-link-arrow"
                            />

                        </NavLink>


                        {/* INVENTORY */}

                        <NavLink
                            to="/bar/inventory"
                            className={linkClass}
                            onClick={
                                handleNavigation
                            }
                        >

                            <FaBoxes
                                className="bar-menu-icon"
                            />

                            <span>
                                Inventory
                            </span>

                            <FaChevronRight
                                className="bar-link-arrow"
                            />

                        </NavLink>


                        {/* TABLES */}

                        <NavLink
                            to="/bar/tables"
                            className={linkClass}
                            onClick={
                                handleNavigation
                            }
                        >

                            <FaChair
                                className="bar-menu-icon"
                            />

                            <span>
                                Tables / Tabs
                            </span>

                            <FaChevronRight
                                className="bar-link-arrow"
                            />

                        </NavLink>


                        {/* ORDERS */}

                        <NavLink
                            to="/bar/orders"
                            className={linkClass}
                            onClick={
                                handleNavigation
                            }
                        >

                            <FaClipboardList
                                className="bar-menu-icon"
                            />

                            <span>
                                Orders
                            </span>

                            <FaChevronRight
                                className="bar-link-arrow"
                            />

                        </NavLink>


                        {/* BILLS */}

                        <NavLink
                            to="/bar/bills"
                            className={linkClass}
                            onClick={
                                handleNavigation
                            }
                        >

                            <FaFileInvoiceDollar
                                className="bar-menu-icon"
                            />

                            <span>
                                Bills
                            </span>

                            <FaChevronRight
                                className="bar-link-arrow"
                            />

                        </NavLink>


                        {/* REPORTS */}

                        <NavLink
                            to="/bar/reports"
                            className={linkClass}
                            onClick={
                                handleNavigation
                            }
                        >

                            <FaChartBar
                                className="bar-menu-icon"
                            />

                            <span>
                                Reports
                            </span>

                            <FaChevronRight
                                className="bar-link-arrow"
                            />

                        </NavLink>

                    </div>

                </nav>


                {/* =========================================
                    USER FOOTER
                ========================================= */}

                <div className="bar-sidebar-footer">

                    {/* USER PROFILE */}

                    <div className="bar-user-profile">

                        <div className="bar-user-avatar">
                            {userInitial}
                        </div>


                        <div className="bar-user-info">

                            <strong>
                                {userName}
                            </strong>

                            <span>
                                {userRole}
                            </span>

                        </div>

                    </div>


                    {/* LOGOUT */}

                    <button
                        type="button"
                        className="bar-logout"
                        onClick={
                            handleLogoutClick
                        }
                    >

                        <FaSignOutAlt />

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </aside>


            {/* =================================================
                LOGOUT CONFIRMATION MODAL
            ================================================= */}

            {showLogoutModal && (

                <div
                    className="logout-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {

                            handleCancelLogout();
                        }

                    }}
                >

                    <div
                        className="logout-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="logout-modal-title"
                    >

                        {/* CLOSE */}

                        <button
                            type="button"
                            className="logout-modal-close"
                            onClick={
                                handleCancelLogout
                            }
                            aria-label="Close"
                        >
                            <FaTimes />
                        </button>


                        {/* ICON */}

                        <div className="logout-modal-icon">
                            <FaSignOutAlt />
                        </div>


                        {/* CONTENT */}

                        <div className="logout-modal-content">

                            <span className="logout-modal-kicker">
                                ACCOUNT
                            </span>

                            <h2 id="logout-modal-title">
                                Logout?
                            </h2>

                            <p>
                                Are you sure you want
                                to logout from your
                                account?
                            </p>

                        </div>


                        {/* USER */}

                        <div className="logout-modal-user">

                            <div className="logout-modal-avatar">
                                {userInitial}
                            </div>

                            <div>
                                <strong>
                                    {userName}
                                </strong>

                                <span>
                                    {userRole}
                                </span>
                            </div>

                        </div>


                        {/* ACTIONS */}

                        <div className="logout-modal-actions">

                            <button
                                type="button"
                                className="logout-cancel-button"
                                onClick={
                                    handleCancelLogout
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="logout-confirm-button"
                                onClick={
                                    handleConfirmLogout
                                }
                            >

                                <FaSignOutAlt />

                                Logout

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
}


export default BarSidebar;