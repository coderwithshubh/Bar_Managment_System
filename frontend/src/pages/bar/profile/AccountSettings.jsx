import { useEffect, useState } from "react";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaGlobe,
    FaClock,
    FaCheckCircle,
    FaSave
} from "react-icons/fa";

import "./AccountSettings.css";

function AccountSettings() {

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

    const user = getLoggedInUser();

    const [settings, setSettings] = useState({
        language:
            localStorage.getItem("accountLanguage") ||
            "English",

        timezone:
            localStorage.getItem("accountTimezone") ||
            "Asia/Kolkata",

        dateFormat:
            localStorage.getItem("accountDateFormat") ||
            "DD MMMM YYYY",

        timeFormat:
            localStorage.getItem("accountTimeFormat") ||
            "12-hour"
    });

    const [success, setSuccess] = useState("");

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setSettings((previous) => ({
            ...previous,
            [name]: value
        }));

        setSuccess("");
    };

    const handleSave = (event) => {

        event.preventDefault();

        localStorage.setItem(
            "accountLanguage",
            settings.language
        );

        localStorage.setItem(
            "accountTimezone",
            settings.timezone
        );

        localStorage.setItem(
            "accountDateFormat",
            settings.dateFormat
        );

        localStorage.setItem(
            "accountTimeFormat",
            settings.timeFormat
        );

        setSuccess(
            "Account settings saved successfully."
        );
    };

    useEffect(() => {

        if (!success) {
            return;
        }

        const timer =
            setTimeout(() => {
                setSuccess("");
            }, 3000);

        return () => clearTimeout(timer);

    }, [success]);


    const userName =
        user?.fullName ||
        user?.name ||
        "User";

    const userEmail =
        user?.email ||
        "Not available";

    const userMobile =
        user?.mobileNumber ||
        user?.mobile ||
        "Not available";

    const userRole =
        user?.role ||
        "NORMAL_USER";

    const userInitial =
        userName
            .trim()
            .charAt(0)
            .toUpperCase() || "U";


    return (

        <main className="account-settings-page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <section className="account-settings-header">

                <div>

                    <span className="account-settings-kicker">
                        ACCOUNT
                    </span>

                    <h1>
                        Account Settings
                    </h1>

                    <p>
                        Manage your account preferences
                        and regional settings.
                    </p>

                </div>

            </section>


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {success && (

                <div
                    className="account-settings-success"
                    role="status"
                >

                    <FaCheckCircle />

                    <span>
                        {success}
                    </span>

                </div>

            )}


            <div className="account-settings-grid">

                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================= */}

                <section className="account-settings-card">

                    <div className="account-card-header">

                        <div className="account-card-icon">
                            <FaUser />
                        </div>

                        <div>

                            <h2>
                                Account Information
                            </h2>

                            <p>
                                Your registered account details.
                            </p>

                        </div>

                    </div>


                    <div className="account-user-summary">

                        <div className="account-user-avatar">
                            {userInitial}
                        </div>

                        <div>

                            <h3>
                                {userName}
                            </h3>

                            <span>
                                {userRole}
                            </span>

                        </div>

                    </div>


                    <div className="account-information-list">

                        <div className="account-information-item">

                            <FaEnvelope />

                            <div>

                                <span>
                                    Email Address
                                </span>

                                <strong>
                                    {userEmail}
                                </strong>

                            </div>

                        </div>


                        <div className="account-information-item">

                            <FaPhone />

                            <div>

                                <span>
                                    Mobile Number
                                </span>

                                <strong>
                                    {userMobile}
                                </strong>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    PREFERENCES
                ================================================= */}

                <section className="account-settings-card">

                    <div className="account-card-header">

                        <div className="account-card-icon">
                            <FaGlobe />
                        </div>

                        <div>

                            <h2>
                                Preferences
                            </h2>

                            <p>
                                Customize your regional preferences.
                            </p>

                        </div>

                    </div>


                    <form
                        className="account-settings-form"
                        onSubmit={handleSave}
                    >

                        {/* LANGUAGE */}

                        <div className="account-form-group">

                            <label htmlFor="language">
                                Language
                            </label>

                            <div className="account-input-wrapper">

                                <FaGlobe />

                                <select
                                    id="language"
                                    name="language"
                                    value={settings.language}
                                    onChange={handleChange}
                                >

                                    <option value="English">
                                        English
                                    </option>

                                    <option value="Marathi">
                                        Marathi
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* TIMEZONE */}

                        <div className="account-form-group">

                            <label htmlFor="timezone">
                                Timezone
                            </label>

                            <div className="account-input-wrapper">

                                <FaClock />

                                <select
                                    id="timezone"
                                    name="timezone"
                                    value={settings.timezone}
                                    onChange={handleChange}
                                >

                                    <option value="Asia/Kolkata">
                                        India Standard Time
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* DATE FORMAT */}

                        <div className="account-form-group">

                            <label htmlFor="dateFormat">
                                Date Format
                            </label>

                            <div className="account-input-wrapper">

                                <FaClock />

                                <select
                                    id="dateFormat"
                                    name="dateFormat"
                                    value={settings.dateFormat}
                                    onChange={handleChange}
                                >

                                    <option value="DD MMMM YYYY">
                                        17 September 2026
                                    </option>

                                    <option value="DD/MM/YYYY">
                                        17/09/2026
                                    </option>

                                    <option value="MM/DD/YYYY">
                                        09/17/2026
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* TIME FORMAT */}

                        <div className="account-form-group">

                            <label htmlFor="timeFormat">
                                Time Format
                            </label>

                            <div className="account-input-wrapper">

                                <FaClock />

                                <select
                                    id="timeFormat"
                                    name="timeFormat"
                                    value={settings.timeFormat}
                                    onChange={handleChange}
                                >

                                    <option value="12-hour">
                                        12-hour
                                    </option>

                                    <option value="24-hour">
                                        24-hour
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* SAVE */}

                        <div className="account-settings-actions">

                            <button
                                type="submit"
                                className="account-save-button"
                            >

                                <FaSave />

                                <span>
                                    Save Changes
                                </span>

                            </button>

                        </div>

                    </form>

                </section>

            </div>

        </main>
    );
}

export default AccountSettings;