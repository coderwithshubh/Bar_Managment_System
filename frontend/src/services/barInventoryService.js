import apiClient from "./apiClient";

const INVENTORY_BASE = "/api/bar/inventory";
const TRANSACTION_BASE = `${INVENTORY_BASE}/transactions`;

const barInventoryService = {

    // ==========================================
    // CREATE INVENTORY
    // ==========================================

    createInventory: (data) =>
        apiClient.post(
            INVENTORY_BASE,
            data
        ),


    // ==========================================
    // GET ALL INVENTORY
    // ==========================================

    getAllInventory: () =>
        apiClient.get(
            INVENTORY_BASE
        ),


    // ==========================================
    // GET ACTIVE INVENTORY
    // ==========================================

    getActiveInventory: () =>
        apiClient.get(
            `${INVENTORY_BASE}/active`
        ),


    // ==========================================
    // GET INVENTORY BY ID
    // ==========================================

    getInventoryById: (id) =>
        apiClient.get(
            `${INVENTORY_BASE}/${id}`
        ),


    // ==========================================
    // GET INVENTORY BY MENU ITEM
    // ==========================================

    getInventoryByMenuItem: (menuItemId) =>
        apiClient.get(
            `${INVENTORY_BASE}/menu-item/${menuItemId}`
        ),


    // ==========================================
    // GET INVENTORY BY QR CODE
    // ==========================================

    getInventoryByQrCode: (qrCode) =>
        apiClient.get(
            `${INVENTORY_BASE}/qr/${encodeURIComponent(qrCode)}`
        ),


    // ==========================================
    // UPDATE MINIMUM QUANTITY
    // ==========================================

    updateMinimumQuantity: (
        id,
        minimumQuantity
    ) =>
        apiClient.patch(
            `${INVENTORY_BASE}/${id}/minimum-quantity`,
            null,
            {
                params: {
                    minimumQuantity
                }
            }
        ),


    // ==========================================
    // ACTIVATE INVENTORY
    // ==========================================

    activateInventory: (id) =>
        apiClient.patch(
            `${INVENTORY_BASE}/${id}/activate`
        ),


    // ==========================================
    // DEACTIVATE INVENTORY
    // ==========================================

    deactivateInventory: (id) =>
        apiClient.patch(
            `${INVENTORY_BASE}/${id}/deactivate`
        ),


    // ==========================================
    // DELETE INVENTORY
    // ==========================================

    deleteInventory: (id) =>
        apiClient.delete(
            `${INVENTORY_BASE}/${id}`
        ),


    // ==========================================
    // CREATE INVENTORY TRANSACTION
    // ==========================================

    createTransaction: (data) =>
        apiClient.post(
            TRANSACTION_BASE,
            data
        ),


    // ==========================================
    // GET TRANSACTION BY ID
    // ==========================================

    getTransactionById: (id) =>
        apiClient.get(
            `${TRANSACTION_BASE}/${id}`
        ),


    // ==========================================
    // GET ALL TRANSACTIONS
    // ==========================================

    getAllTransactions: () =>
        apiClient.get(
            TRANSACTION_BASE
        ),


    // ==========================================
    // GET TRANSACTIONS BY INVENTORY
    // ==========================================

    getTransactionsByInventory: (
        inventoryId
    ) =>
        apiClient.get(
            `${TRANSACTION_BASE}/inventory/${inventoryId}`
        ),


    // ==========================================
    // GET TRANSACTIONS BY TYPE
    // ==========================================

    getTransactionsByType: (
        transactionType
    ) =>
        apiClient.get(
            `${TRANSACTION_BASE}/type/${transactionType}`
        )
};


// ==========================================
// EXPORT
// ==========================================

export default barInventoryService;