import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaEye,
    FaTrash,
    FaSyncAlt,
    FaTags,
    FaCheckCircle,
    FaTimesCircle
} from "react-icons/fa";

import barCategoryService
    from "../../../services/barCategoryService";

import "./BarCategories.css";


function BarCategories() {

    const navigate = useNavigate();


    // =====================================================
    // CURRENT USER / ROLE
    // =====================================================

    const getLoggedInUser = () => {

        try {

            const storedUser =
                sessionStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(storedUser);

        } catch (error) {

            console.error(
                "Unable to read logged-in user:",
                error
            );

            return null;
        }
    };


    const user = getLoggedInUser();

    const userRole =
        user?.role || "NORMAL_USER";


    // ADMIN + BAR_MANAGER can modify bar data
    const canManageBar =
        userRole === "ADMIN" ||
        userRole === "BAR_MANAGER";


    // =====================================================
    // STATE
    // =====================================================

    const [categories, setCategories] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [deletingId, setDeletingId] =
        useState(null);


    // =====================================================
    // FETCH CATEGORIES
    // =====================================================

    const fetchCategories = useCallback(
        async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await barCategoryService
                        .getAllCategories();

                setCategories(
                    Array.isArray(response?.data)
                        ? response.data
                        : []
                );

            } catch (error) {

                console.error(
                    "Bar Categories Error:",
                    error
                );

                setCategories([]);

                setError(
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error?.response?.data?.detail ||
                    "Unable to load bar categories."
                );

            } finally {

                setLoading(false);
            }
        },
        []
    );


    // =====================================================
    // INITIAL LOAD
    // =====================================================
    //
    // setTimeout prevents the React 19
    // set-state-in-effect warning.
    //
    // =====================================================

    useEffect(() => {

        const timer = setTimeout(() => {

            fetchCategories();

        }, 0);


        return () => {

            clearTimeout(timer);

        };

    }, [fetchCategories]);


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredCategories = useMemo(() => {

        const keyword =
            search.trim().toLowerCase();


        if (!keyword) {
            return categories;
        }


        return categories.filter(
            (category) => {

                const name =
                    category.categoryName
                        ?.toLowerCase() || "";

                const description =
                    category.description
                        ?.toLowerCase() || "";

                const code =
                    category.categoryCode
                        ?.toLowerCase() || "";


                return (
                    name.includes(keyword) ||
                    description.includes(keyword) ||
                    code.includes(keyword)
                );
            }
        );

    }, [categories, search]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalCategories =
        categories.length;


    const activeCategories =
        categories.filter(
            (category) =>
                category.active === true
        ).length;


    const inactiveCategories =
        categories.filter(
            (category) =>
                category.active === false
        ).length;


    // =====================================================
    // DELETE CATEGORY
    // =====================================================

    const deleteCategory = async (id) => {

        // Frontend RBAC protection
        if (!canManageBar) {
            return;
        }


        if (!id || deletingId !== null) {
            return;
        }


        const confirmed =
            window.confirm(
                "Are you sure you want to delete this category?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(id);
            setError("");

            await barCategoryService
                .deleteCategory(id);

            await fetchCategories();

        } catch (error) {

            console.error(
                "Delete Category Error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to delete the category."
            );

        } finally {

            setDeletingId(null);
        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="bar-category-page">

                <div className="bar-category-loader">

                    <div className="loader-spinner"></div>

                    <p>
                        Loading bar categories...
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="bar-category-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="bar-category-header">

                <div className="bar-category-title">

                    <div
                        className="title-icon"
                        aria-hidden="true"
                    >
                        <FaTags />
                    </div>


                    <div>

                        <h1>
                            Bar Categories
                        </h1>

                        <p>
                            Manage drink categories for your bar
                        </p>

                    </div>

                </div>


                <div className="header-actions">


                    {/* REFRESH - ALL ROLES */}

                    <button
                        type="button"
                        className="bar-refresh-btn"
                        onClick={fetchCategories}
                        disabled={loading}
                    >

                        <FaSyncAlt />

                        <span>
                            Refresh
                        </span>

                    </button>


                    {/* ADD - ADMIN + BAR_MANAGER ONLY */}

                    {canManageBar && (

                        <button
                            type="button"
                            className="bar-add-btn"
                            onClick={() =>
                                navigate(
                                    "/bar/categories/add"
                                )
                            }
                        >

                            <FaPlus />

                            <span>
                                Add Category
                            </span>

                        </button>

                    )}

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div
                    className="bar-category-error"
                    role="alert"
                >

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={fetchCategories}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="category-stat-grid">


                <div className="category-stat-card total">

                    <div className="stat-icon">
                        <FaTags />
                    </div>

                    <div>

                        <span>
                            Total Categories
                        </span>

                        <strong>
                            {totalCategories}
                        </strong>

                    </div>

                </div>


                <div className="category-stat-card active">

                    <div className="stat-icon">
                        <FaCheckCircle />
                    </div>

                    <div>

                        <span>
                            Active
                        </span>

                        <strong>
                            {activeCategories}
                        </strong>

                    </div>

                </div>


                <div className="category-stat-card inactive">

                    <div className="stat-icon">
                        <FaTimesCircle />
                    </div>

                    <div>

                        <span>
                            Inactive
                        </span>

                        <strong>
                            {inactiveCategories}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="bar-category-content">


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div className="category-toolbar">

                    <div>

                        <h2>
                            Category List
                        </h2>

                        <p>

                            {filteredCategories.length}

                            {" "}

                            {filteredCategories.length === 1
                                ? "category"
                                : "categories"}

                            {" "}
                            found

                        </p>

                    </div>


                    <div className="bar-search-box">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            aria-label="Search categories"
                        />


                        {search && (

                            <button
                                type="button"
                                className="clear-search"
                                onClick={() =>
                                    setSearch("")
                                }
                                title="Clear search"
                                aria-label="Clear search"
                            >
                                ×
                            </button>

                        )}

                    </div>

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="bar-table-wrapper">

                    <table className="bar-category-table">

                        <thead>

                            <tr>

                                <th>#</th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Description
                                </th>

                                <th>
                                    Display Order
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredCategories.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="bar-no-data"
                                    >

                                        <div className="empty-state">

                                            <div className="empty-icon">
                                                <FaTags />
                                            </div>

                                            <h3>
                                                No Categories Found
                                            </h3>

                                            <p>
                                                {search
                                                    ? "Try changing your search."
                                                    : "Start by adding your first bar category."
                                                }
                                            </p>


                                            {!search &&
                                                canManageBar && (

                                                    <button
                                                        type="button"
                                                        className="empty-add-btn"
                                                        onClick={() =>
                                                            navigate(
                                                                "/bar/categories/add"
                                                            )
                                                        }
                                                    >

                                                        <FaPlus />

                                                        Add Category

                                                    </button>

                                                )}

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredCategories.map(
                                    (category, index) => (

                                        <tr
                                            key={category.id}
                                        >


                                            {/* NUMBER */}

                                            <td>

                                                <span className="row-number">
                                                    {index + 1}
                                                </span>

                                            </td>


                                            {/* CATEGORY */}

                                            <td>

                                                <div className="category-name-cell">

                                                    <div className="category-small-icon">
                                                        <FaTags />
                                                    </div>


                                                    <div>

                                                        <strong>
                                                            {
                                                                category.categoryName
                                                            }
                                                        </strong>

                                                        <small>
                                                            {
                                                                category.categoryCode ||
                                                                `ID: ${category.id}`
                                                            }
                                                        </small>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* DESCRIPTION */}

                                            <td>

                                                <span className="category-description">

                                                    {
                                                        category.description ||
                                                        "No description"
                                                    }

                                                </span>

                                            </td>


                                            {/* DISPLAY ORDER */}

                                            <td>

                                                <span className="display-order">

                                                    {
                                                        category.displayOrder ??
                                                        0
                                                    }

                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        category.active
                                                            ? "bar-status active"
                                                            : "bar-status inactive"
                                                    }
                                                >

                                                    <span className="status-dot"></span>

                                                    {
                                                        category.active
                                                            ? "Active"
                                                            : "Inactive"
                                                    }

                                                </span>

                                            </td>


                                            {/* =================================================
                                                ACTIONS
                                            ================================================= */}

                                            <td>

                                                <div className="table-actions">


                                                    {/* VIEW - ALL ROLES */}

                                                    <button
                                                        type="button"
                                                        className="table-action view"
                                                        title="View Category"
                                                        onClick={() =>
                                                            navigate(
                                                                `/bar/categories/view/${category.id}`
                                                            )
                                                        }
                                                    >

                                                        <FaEye />

                                                    </button>


                                                    {/* EDIT - ADMIN + BAR_MANAGER */}

                                                    {canManageBar && (

                                                        <button
                                                            type="button"
                                                            className="table-action edit"
                                                            title="Edit Category"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/bar/categories/edit/${category.id}`
                                                                )
                                                            }
                                                        >

                                                            <FaEdit />

                                                        </button>

                                                    )}


                                                    {/* DELETE - ADMIN + BAR_MANAGER */}

                                                    {canManageBar && (

                                                        <button
                                                            type="button"
                                                            className="table-action delete"
                                                            title="Delete Category"
                                                            disabled={
                                                                deletingId ===
                                                                category.id
                                                            }
                                                            onClick={() =>
                                                                deleteCategory(
                                                                    category.id
                                                                )
                                                            }
                                                        >

                                                            {deletingId ===
                                                            category.id
                                                                ? "..."
                                                                : <FaTrash />}

                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}


export default BarCategories;