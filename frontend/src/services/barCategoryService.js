import apiClient from "./apiClient";


// =====================================================
// BAR CATEGORY SERVICE
// =====================================================
// Handles all API operations related to Bar Categories.
//
// JWT authentication, base URL, common headers and
// authentication error handling are managed centrally
// by apiClient.js.
// =====================================================

const barCategoryService = {

    // =================================================
    // GET ALL CATEGORIES
    // GET /api/bar/categories
    // =================================================

    getAllCategories: () => {

        return apiClient.get("/api/bar/categories");

    },


    // =================================================
    // GET ACTIVE CATEGORIES
    // GET /api/bar/categories/active
    // =================================================

    getActiveCategories: () => {

        return apiClient.get(
            "/api/bar/categories/active"
        );

    },


    // =================================================
    // SEARCH CATEGORIES
    // GET /api/bar/categories/search?keyword=
    // =================================================

    searchCategories: (keyword) => {

        return apiClient.get(
            "/api/bar/categories/search",
            {
                params: {
                    keyword
                }
            }
        );

    },


    // =================================================
    // GET CATEGORY BY ID
    // GET /api/bar/categories/{id}
    // =================================================

    getCategoryById: (id) => {

        return apiClient.get(
            `/api/bar/categories/${id}`
        );

    },


    // =================================================
    // CREATE CATEGORY
    // POST /api/bar/categories
    // =================================================

    createCategory: (categoryData) => {

        return apiClient.post(
            "/api/bar/categories",
            categoryData
        );

    },


    // =================================================
    // UPDATE CATEGORY
    // PUT /api/bar/categories/{id}
    // =================================================

    updateCategory: (id, categoryData) => {

        return apiClient.put(
            `/api/bar/categories/${id}`,
            categoryData
        );

    },


    // =================================================
    // ACTIVATE CATEGORY
    // PATCH /api/bar/categories/{id}/activate
    // =================================================

    activateCategory: (id) => {

        return apiClient.patch(
            `/api/bar/categories/${id}/activate`
        );

    },


    // =================================================
    // DEACTIVATE CATEGORY
    // PATCH /api/bar/categories/{id}/deactivate
    // =================================================

    deactivateCategory: (id) => {

        return apiClient.patch(
            `/api/bar/categories/${id}/deactivate`
        );

    },


    // =================================================
    // DELETE CATEGORY
    // DELETE /api/bar/categories/{id}
    // =================================================

    deleteCategory: (id) => {

        return apiClient.delete(
            `/api/bar/categories/${id}`
        );

    }

};


// =====================================================
// EXPORT
// =====================================================

export default barCategoryService;