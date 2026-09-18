import apiClient from "./apiClient";

const BAR_REPORT_URL = "/api/bar/reports";

const getSummary = async (fromDate, toDate) => {
    const response = await apiClient.get(
        `${BAR_REPORT_URL}/summary`,
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
    getSummary
};