import apiClient from "./apiClient";

const NOTIFICATION_URL = "/api/notifications";

// ==========================================
// GET ALL NOTIFICATIONS
// ==========================================

const getNotifications = async () => {
    const response = await apiClient.get(
        NOTIFICATION_URL
    );

    return response.data;
};


// ==========================================
// GET UNREAD NOTIFICATIONS
// ==========================================

const getUnreadNotifications = async () => {
    const response = await apiClient.get(
        `${NOTIFICATION_URL}/unread`
    );

    return response.data;
};


// ==========================================
// GET UNREAD COUNT
// ==========================================

const getUnreadCount = async () => {
    const response = await apiClient.get(
        `${NOTIFICATION_URL}/unread/count`
    );

    return response.data;
};


// ==========================================
// MARK ONE AS READ
// ==========================================

const markAsRead = async (id) => {
    const response = await apiClient.patch(
        `${NOTIFICATION_URL}/${id}/read`
    );

    return response.data;
};


// ==========================================
// MARK ALL AS READ
// ==========================================

const markAllAsRead = async () => {
    const response = await apiClient.patch(
        `${NOTIFICATION_URL}/read-all`
    );

    return response.data;
};


export default {
    getNotifications,
    getUnreadNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
};