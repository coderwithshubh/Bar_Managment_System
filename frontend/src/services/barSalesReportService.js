import apiClient from "./apiClient";

const BAR_SALES_REPORT_URL = "/api/bar/reports/sales";

const getSalesReport = async (fromDate, toDate) => {
    const response = await apiClient.get(
        BAR_SALES_REPORT_URL,
        {
            params: {
                fromDate,
                toDate
            }
        }
    );

    return response.data;
};

export default {
    getSalesReport
};