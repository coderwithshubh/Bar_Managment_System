import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    FaBell,
    FaCheck,
    FaCheckDouble,
    FaInfoCircle,
    FaExclamationTriangle,
    FaTimesCircle,
    FaClipboardList,
    FaMoneyBillWave,
    FaBoxes,
    FaChair,
    FaSyncAlt
} from "react-icons/fa";

import notificationService
    from "../../../services/notificationService";

import "./BarNotifications.css";


// =====================================================
// TYPE ICON
// =====================================================

const getNotificationIcon = (type) => {

    switch (type) {

        case "SUCCESS":
            return <FaCheck />;

        case "WARNING":
            return <FaExclamationTriangle />;

        case "ERROR":
            return <FaTimesCircle />;

        case "ORDER":
            return <FaClipboardList />;

        case "BILL":
            return <FaMoneyBillWave />;

        case "INVENTORY":
            return <FaBoxes />;

        case "TABLE":
            return <FaChair />;

        case "SYSTEM":
            return <FaBell />;

        case "INFO":
        default:
            return <FaInfoCircle />;
    }
};


// =====================================================
// TYPE CLASS
// =====================================================

const getNotificationClass = (type) => {

    switch (type) {

        case "SUCCESS":
            return "success";

        case "WARNING":
            return "warning";

        case "ERROR":
            return "error";

        case "ORDER":
            return "order";

        case "BILL":
            return "bill";

        case "INVENTORY":
            return "inventory";

        case "TABLE":
            return "table";

        case "SYSTEM":
            return "system";

        case "INFO":
        default:
            return "info";
    }
};


// =====================================================
// TIME FORMAT
// =====================================================

const formatNotificationTime = (createdAt) => {

    if (!createdAt) {
        return "";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
};


// =====================================================
// COMPONENT
// =====================================================

function BarNotifications() {

    // =================================================
    // STATE
    // =================================================

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [activeFilter, setActiveFilter] =
        useState("ALL");

    const [processingId, setProcessingId] =
        useState(null);

    const [markingAll, setMarkingAll] =
        useState(false);


    // =================================================
    // FETCH NOTIFICATIONS
    // =================================================

    const fetchNotifications = useCallback(
        async (showRefresh = false) => {

            try {

                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError("");

                const data =
                    await notificationService
                        .getNotifications();

                setNotifications(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Notifications Error:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Unable to load notifications."
                );

            } finally {

                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );


    // =================================================
    // INITIAL LOAD
    // =================================================
    // IMPORTANT:
    // Do not call fetchNotifications() synchronously
    // inside the effect body.
    // =================================================

    useEffect(() => {

        let cancelled = false;

        const loadNotifications = async () => {

            if (cancelled) {
                return;
            }

            await fetchNotifications(false);
        };

        Promise.resolve().then(
            loadNotifications
        );

        return () => {
            cancelled = true;
        };

    }, [fetchNotifications]);


    // =================================================
    // STATISTICS
    // =================================================

    const unreadCount = useMemo(
        () =>
            notifications.filter(
                (notification) =>
                    notification.read !== true
            ).length,
        [notifications]
    );


    const readCount =
        notifications.length - unreadCount;


    // =================================================
    // FILTERED NOTIFICATIONS
    // =================================================

    const filteredNotifications =
        useMemo(() => {

            if (activeFilter === "UNREAD") {

                return notifications.filter(
                    (notification) =>
                        notification.read !== true
                );
            }

            if (activeFilter === "READ") {

                return notifications.filter(
                    (notification) =>
                        notification.read === true
                );
            }

            return notifications;

        }, [
            notifications,
            activeFilter
        ]);


    // =================================================
    // MARK ONE AS READ
    // =================================================

    const handleMarkAsRead = async (id) => {

        if (!id || processingId !== null) {
            return;
        }

        try {

            setProcessingId(id);

            setError("");

            await notificationService
                .markAsRead(id);

            setNotifications(
                (currentNotifications) =>
                    currentNotifications.map(
                        (notification) =>
                            notification.id === id
                                ? {
                                    ...notification,
                                    read: true
                                }
                                : notification
                    )
            );

        } catch (error) {

            console.error(
                "Mark Notification Error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to mark notification as read."
            );

        } finally {

            setProcessingId(null);
        }
    };


    // =================================================
    // MARK ALL AS READ
    // =================================================

    const handleMarkAllAsRead = async () => {

        if (
            markingAll ||
            unreadCount === 0
        ) {
            return;
        }

        try {

            setMarkingAll(true);

            setError("");

            await notificationService
                .markAllAsRead();

            setNotifications(
                (currentNotifications) =>
                    currentNotifications.map(
                        (notification) => ({
                            ...notification,
                            read: true
                        })
                    )
            );

        } catch (error) {

            console.error(
                "Mark All Notifications Error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to mark all notifications as read."
            );

        } finally {

            setMarkingAll(false);
        }
    };


    // =================================================
    // LOADING
    // =================================================

    if (loading) {

        return (
            <div className="bar-notifications-page">

                <div className="bar-notifications-loader">

                    <div className="bar-notifications-spinner">
                    </div>

                    <p>
                        Loading notifications...
                    </p>

                </div>

            </div>
        );
    }


    // =================================================
    // MAIN UI
    // =================================================

    return (

        <div className="bar-notifications-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="bar-notifications-header">

                <div>

                    <div className="bar-notifications-title-row">

                        <div className="bar-notifications-title-icon">
                            <FaBell />
                        </div>

                        <div>

                            <h1>
                                Notifications
                            </h1>

                            <p>
                                Stay updated with your
                                bar management activities.
                            </p>

                        </div>

                    </div>

                </div>


                <div className="bar-notifications-header-actions">

                    <button
                        type="button"
                        className="bar-notifications-refresh"
                        onClick={() =>
                            fetchNotifications(true)
                        }
                        disabled={refreshing}
                        title="Refresh notifications"
                    >

                        <FaSyncAlt
                            className={
                                refreshing
                                    ? "notification-refresh-spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>


                    <button
                        type="button"
                        className="bar-notifications-mark-all"
                        onClick={handleMarkAllAsRead}
                        disabled={
                            markingAll ||
                            unreadCount === 0
                        }
                    >

                        <FaCheckDouble />

                        {markingAll
                            ? "Marking..."
                            : "Mark all as read"
                        }

                    </button>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="bar-notifications-error">

                    <FaExclamationTriangle />

                    <span>
                        {error}
                    </span>

                </div>
            )}


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="bar-notifications-stats">

                <div className="notification-stat-card">

                    <div className="notification-stat-icon total">
                        <FaBell />
                    </div>

                    <div>

                        <span>
                            Total
                        </span>

                        <strong>
                            {notifications.length}
                        </strong>

                    </div>

                </div>


                <div className="notification-stat-card">

                    <div className="notification-stat-icon unread">
                        <FaExclamationTriangle />
                    </div>

                    <div>

                        <span>
                            Unread
                        </span>

                        <strong>
                            {unreadCount}
                        </strong>

                    </div>

                </div>


                <div className="notification-stat-card">

                    <div className="notification-stat-icon read">
                        <FaCheckDouble />
                    </div>

                    <div>

                        <span>
                            Read
                        </span>

                        <strong>
                            {readCount}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                FILTERS
            ================================================= */}

            <div className="bar-notifications-toolbar">

                <div className="bar-notification-filters">

                    <button
                        type="button"
                        className={
                            activeFilter === "ALL"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveFilter("ALL")
                        }
                    >
                        All
                    </button>

                    <button
                        type="button"
                        className={
                            activeFilter === "UNREAD"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveFilter("UNREAD")
                        }
                    >
                        Unread

                        {unreadCount > 0 && (
                            <span>
                                {unreadCount}
                            </span>
                        )}

                    </button>

                    <button
                        type="button"
                        className={
                            activeFilter === "READ"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveFilter("READ")
                        }
                    >
                        Read
                    </button>

                </div>

            </div>


            {/* =================================================
                NOTIFICATION LIST
            ================================================= */}

            <section className="bar-notifications-card">

                <div className="bar-notifications-card-header">

                    <div>

                        <h2>
                            Notification Center
                        </h2>

                        <span>
                            {filteredNotifications.length}
                            {" "}
                            notification
                            {filteredNotifications.length !== 1
                                ? "s"
                                : ""
                            }
                        </span>

                    </div>

                </div>


                <div className="bar-notifications-list">

                    {filteredNotifications.length === 0 ? (

                        <div className="bar-notifications-empty">

                            <div className="empty-notification-icon">
                                <FaBell />
                            </div>

                            <h3>
                                No notifications
                            </h3>

                            <p>
                                There are no notifications
                                to display right now.
                            </p>

                        </div>

                    ) : (

                        filteredNotifications.map(
                            (notification) => {

                                const type =
                                    notification.type ||
                                    "INFO";

                                const notificationClass =
                                    getNotificationClass(
                                        type
                                    );

                                const isUnread =
                                    notification.read !== true;

                                return (

                                    <div
                                        key={notification.id}
                                        className={
                                            `bar-notification-item ${
                                                isUnread
                                                    ? "unread"
                                                    : "read"
                                            }`
                                        }
                                    >

                                        <div
                                            className={
                                                `bar-notification-type-icon ${notificationClass}`
                                            }
                                        >
                                            {getNotificationIcon(
                                                type
                                            )}
                                        </div>


                                        <div className="bar-notification-content">

                                            <div className="bar-notification-top">

                                                <div>

                                                    <h3>
                                                        {
                                                            notification.title ||
                                                            "Notification"
                                                        }
                                                    </h3>

                                                    {isUnread && (
                                                        <span className="notification-unread-badge">
                                                            Unread
                                                        </span>
                                                    )}

                                                </div>

                                                <span className="bar-notification-time">
                                                    {formatNotificationTime(
                                                        notification.createdAt
                                                    )}
                                                </span>

                                            </div>


                                            <p>
                                                {
                                                    notification.message ||
                                                    ""
                                                }
                                            </p>


                                            <div className="bar-notification-bottom">

                                                <span
                                                    className={
                                                        `notification-type-label ${notificationClass}`
                                                    }
                                                >
                                                    {type}
                                                </span>


                                                {isUnread && (

                                                    <button
                                                        type="button"
                                                        className="notification-read-button"
                                                        onClick={() =>
                                                            handleMarkAsRead(
                                                                notification.id
                                                            )
                                                        }
                                                        disabled={
                                                            processingId ===
                                                            notification.id
                                                        }
                                                    >

                                                        <FaCheck />

                                                        {processingId ===
                                                        notification.id
                                                            ? "Marking..."
                                                            : "Mark as read"
                                                        }

                                                    </button>

                                                )}

                                            </div>

                                        </div>

                                    </div>
                                );
                            }
                        )
                    )}

                </div>

            </section>

        </div>
    );
}


export default BarNotifications;