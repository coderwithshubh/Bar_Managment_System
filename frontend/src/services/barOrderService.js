import apiClient from "./apiClient";

const BAR_ORDER_URL = "/api/bar/orders";

// =====================================================
// CREATE ORDER
// =====================================================

const createOrder = async (orderData) => {
    const response = await apiClient.post(
        BAR_ORDER_URL,
        orderData
    );

    return response.data;
};


// =====================================================
// GET ALL ORDERS
// =====================================================

const getAllOrders = async () => {
    const response = await apiClient.get(
        BAR_ORDER_URL
    );

    return response.data;
};


// =====================================================
// GET ORDER BY ID
// =====================================================

const getOrderById = async (id) => {
    if (!id) {
        throw new Error("Order ID is required.");
    }

    const response = await apiClient.get(
        `${BAR_ORDER_URL}/${id}`
    );

    return response.data;
};


// =====================================================
// UPDATE ORDER STATUS
//
// Supported flow:
//
// OPEN
//   ↓
// CONFIRMED
//   ↓
// PREPARING
//   ↓
// READY
//   ↓
// SERVED
//   ↓
// COMPLETED
//
// Backend validates the transition.
// =====================================================

const updateOrderStatus = async (id, status) => {
    if (!id) {
        throw new Error("Order ID is required.");
    }

    if (!status) {
        throw new Error("Order status is required.");
    }

    const response = await apiClient.patch(
        `${BAR_ORDER_URL}/${id}/status`,
        null,
        {
            params: {
                status: String(status).toUpperCase()
            }
        }
    );

    return response.data;
};


// =====================================================
// CONFIRM ORDER
// OPEN → CONFIRMED
// =====================================================

const confirmOrder = async (id) => {
    return updateOrderStatus(
        id,
        "CONFIRMED"
    );
};


// =====================================================
// START PREPARING
// CONFIRMED → PREPARING
// =====================================================

const startPreparing = async (id) => {
    return updateOrderStatus(
        id,
        "PREPARING"
    );
};


// =====================================================
// MARK READY
// PREPARING → READY
// =====================================================

const markReady = async (id) => {
    return updateOrderStatus(
        id,
        "READY"
    );
};


// =====================================================
// MARK SERVED
// READY → SERVED
// =====================================================

const markServed = async (id) => {
    return updateOrderStatus(
        id,
        "SERVED"
    );
};


// =====================================================
// CANCEL ORDER
//
// Allowed by backend from the applicable early states.
// =====================================================

const cancelOrder = async (id) => {
    if (!id) {
        throw new Error("Order ID is required.");
    }

    const response = await apiClient.patch(
        `${BAR_ORDER_URL}/${id}/cancel`
    );

    return response.data;
};


// =====================================================
// COMPLETE ORDER
//
// SERVED → COMPLETED
//
// This is intentionally kept separate because
// completion is the point at which the order becomes
// eligible for bill generation.
// =====================================================

const completeOrder = async (id) => {
    if (!id) {
        throw new Error("Order ID is required.");
    }

    const response = await apiClient.patch(
        `${BAR_ORDER_URL}/${id}/complete`
    );

    return response.data;
};


// =====================================================
// EXPORT SERVICE
// =====================================================

const barOrderService = {
    createOrder,
    getAllOrders,
    getOrderById,

    // Generic status update
    updateOrderStatus,

    // Step-by-step order workflow
    confirmOrder,
    startPreparing,
    markReady,
    markServed,
    completeOrder,

    // Cancellation
    cancelOrder
};

export default barOrderService;