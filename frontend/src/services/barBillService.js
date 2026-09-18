import apiClient from "./apiClient";

const BAR_BILL_URL = "/api/bar/bills";

const barBillService = {

    // Get all bills
    getAllBills: async () => {
        const response = await apiClient.get(BAR_BILL_URL);
        return response.data;
    },

    // Get bill by ID
    getBillById: async (id) => {
        const response = await apiClient.get(
            `${BAR_BILL_URL}/${id}`
        );
        return response.data;
    },

    // Get bill by bill number
    getBillByNumber: async (billNumber) => {
        const response = await apiClient.get(
            `${BAR_BILL_URL}/number/${encodeURIComponent(billNumber)}`
        );
        return response.data;
    },

    // Get bill by order ID
    getBillByOrderId: async (orderId) => {
        const response = await apiClient.get(
            `${BAR_BILL_URL}/order/${orderId}`
        );
        return response.data;
    },

    // Get bills by payment status
    getBillsByPaymentStatus: async (status) => {
        const response = await apiClient.get(
            `${BAR_BILL_URL}/status/${status}`
        );
        return response.data;
    },

    // Create bill
    createBill: async (billData) => {
        const response = await apiClient.post(
            BAR_BILL_URL,
            billData
        );
        return response.data;
    },

    // Mark bill as paid
    updatePayment: async (id, paymentData) => {
        const response = await apiClient.patch(
            `${BAR_BILL_URL}/${id}/payment`,
            paymentData
        );
        return response.data;
    },

    // Void bill
    voidBill: async (id, reason) => {
        const response = await apiClient.patch(
            `${BAR_BILL_URL}/${id}/void`,
            null,
            {
                params: {
                    reason
                }
            }
        );

        return response.data;
    }
};

export default barBillService;