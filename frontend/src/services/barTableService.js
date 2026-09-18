import apiClient from "./apiClient";

// ==========================================
// BAR TABLE API
// ==========================================

const BAR_TABLE_URL = "/api/bar/tables";

// ==========================================
// GET ALL TABLES
// GET /api/bar/tables
// ==========================================

const getAllTables = async () => {

    const response =
        await apiClient.get(BAR_TABLE_URL);

    return response.data;
};


// ==========================================
// GET TABLE BY ID
// GET /api/bar/tables/{id}
// ==========================================

const getTableById = async (id) => {

    const response =
        await apiClient.get(
            `${BAR_TABLE_URL}/${id}`
        );

    return response.data;
};


// ==========================================
// CREATE TABLE
// POST /api/bar/tables
// ==========================================

const createTable = async (tableData) => {

    const response =
        await apiClient.post(
            BAR_TABLE_URL,
            tableData
        );

    return response.data;
};


// ==========================================
// UPDATE TABLE
// PUT /api/bar/tables/{id}
// ==========================================

const updateTable = async (
    id,
    tableData
) => {

    const response =
        await apiClient.put(
            `${BAR_TABLE_URL}/${id}`,
            tableData
        );

    return response.data;
};


// ==========================================
// UPDATE TABLE STATUS
// PATCH
// /api/bar/tables/{id}/status?status=...
// ==========================================

const updateTableStatus = async (
    id,
    status
) => {

    const response =
        await apiClient.patch(

            `${BAR_TABLE_URL}/${id}/status`,

            null,

            {
                params: {
                    status: status
                }
            }
        );

    return response.data;
};


// ==========================================
// ACTIVATE TABLE
// PATCH
// /api/bar/tables/{id}/activate
// ==========================================

const activateTable = async (id) => {

    const response =
        await apiClient.patch(
            `${BAR_TABLE_URL}/${id}/activate`
        );

    return response.data;
};


// ==========================================
// DEACTIVATE TABLE
// PATCH
// /api/bar/tables/{id}/deactivate
// ==========================================

const deactivateTable = async (id) => {

    const response =
        await apiClient.patch(
            `${BAR_TABLE_URL}/${id}/deactivate`
        );

    return response.data;
};


// ==========================================
// DELETE TABLE
// DELETE /api/bar/tables/{id}
// ==========================================

const deleteTable = async (id) => {

    await apiClient.delete(
        `${BAR_TABLE_URL}/${id}`
    );
};


// ==========================================
// SERVICE OBJECT
// ==========================================

const barTableService = {

    getAllTables,

    getTableById,

    createTable,

    updateTable,

    updateTableStatus,

    activateTable,

    deactivateTable,

    deleteTable
};


export default barTableService;