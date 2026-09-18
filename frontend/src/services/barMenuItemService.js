import apiClient from "./apiClient";

// =====================================================
// BAR MENU ITEM SERVICE
// =====================================================

const barMenuItemService = {

    // =================================================
    // GET ALL MENU ITEMS
    // GET /api/bar/menu
    // =================================================

    getAllItems: () => {
        return apiClient.get("/api/bar/menu");
    },


    // =================================================
    // GET ACTIVE MENU ITEMS
    // GET /api/bar/menu/active
    // =================================================

    getActiveItems: () => {
        return apiClient.get("/api/bar/menu/active");
    },


    // =================================================
    // GET MENU ITEM BY ID
    // GET /api/bar/menu/{id}
    // =================================================

    getItemById: (id) => {
        return apiClient.get(`/api/bar/menu/${id}`);
    },


    // =================================================
    // GET ITEMS BY CATEGORY
    // GET /api/bar/menu/category/{categoryId}
    // =================================================

    getItemsByCategory: (categoryId) => {
        return apiClient.get(
            `/api/bar/menu/category/${categoryId}`
        );
    },


    // =================================================
    // GET ACTIVE ITEMS BY CATEGORY
    // GET /api/bar/menu/category/{categoryId}/active
    // =================================================

    getActiveItemsByCategory: (categoryId) => {
        return apiClient.get(
            `/api/bar/menu/category/${categoryId}/active`
        );
    },


    // =================================================
    // SEARCH MENU ITEMS
    // GET /api/bar/menu/search?keyword=
    // =================================================

    searchItems: (keyword) => {
        return apiClient.get(
            "/api/bar/menu/search",
            {
                params: {
                    keyword
                }
            }
        );
    },


    // =================================================
    // CREATE MENU ITEM
    // POST /api/bar/menu
    // =================================================

    createItem: (data) => {
        return apiClient.post(
            "/api/bar/menu",
            data
        );
    },


    // =================================================
    // UPDATE MENU ITEM
    // PUT /api/bar/menu/{id}
    // =================================================

    updateItem: (id, data) => {
        return apiClient.put(
            `/api/bar/menu/${id}`,
            data
        );
    },


    // =================================================
    // ACTIVATE MENU ITEM
    // PATCH /api/bar/menu/{id}/activate
    // =================================================

    activateItem: (id) => {
        return apiClient.patch(
            `/api/bar/menu/${id}/activate`
        );
    },


    // =================================================
    // DEACTIVATE MENU ITEM
    // PATCH /api/bar/menu/{id}/deactivate
    // =================================================

    deactivateItem: (id) => {
        return apiClient.patch(
            `/api/bar/menu/${id}/deactivate`
        );
    },


    // =================================================
    // DELETE MENU ITEM
    // DELETE /api/bar/menu/{id}
    // =================================================

    deleteItem: (id) => {
        return apiClient.delete(
            `/api/bar/menu/${id}`
        );
    }

};

export default barMenuItemService;