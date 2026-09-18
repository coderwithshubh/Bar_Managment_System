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
    FaCocktail,
    FaCheckCircle,
    FaTimesCircle,
    FaTags,
    FaChevronDown,
    FaMoneyBillWave,
    FaWineBottle,
    FaBoxes
} from "react-icons/fa";

import barMenuItemService
    from "../../../services/barMenuItemService";

import "./BarMenu.css";


function BarMenu() {

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


    // ADMIN + BAR_MANAGER can modify menu
    const canManageBar =
        userRole === "ADMIN" ||
        userRole === "BAR_MANAGER";


    // =====================================================
    // STATE
    // =====================================================

    const [items, setItems] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [categoryFilter, setCategoryFilter] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [deletingId, setDeletingId] =
        useState(null);


    // =====================================================
    // FETCH MENU ITEMS
    // =====================================================

    const fetchItems = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await barMenuItemService.getAllItems();

            setItems(
                Array.isArray(response?.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Bar Menu Error:",
                error
            );

            setItems([]);

            setError(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to load bar menu items."
            );

        } finally {

            setLoading(false);
        }

    }, []);


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        let cancelled = false;


        const loadInitialItems = async () => {

            try {

                const response =
                    await barMenuItemService.getAllItems();


                if (cancelled) {
                    return;
                }


                setItems(
                    Array.isArray(response?.data)
                        ? response.data
                        : []
                );


            } catch (error) {

                if (cancelled) {
                    return;
                }


                console.error(
                    "Initial Bar Menu Error:",
                    error
                );


                setError(
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    "Unable to load bar menu items."
                );


            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        };


        loadInitialItems();


        return () => {

            cancelled = true;

        };

    }, []);


    // =====================================================
    // CATEGORY LIST
    // =====================================================

    const categories = useMemo(() => {

        const categoryMap = new Map();


        items.forEach((item) => {

            if (
                item.categoryId !== null &&
                item.categoryId !== undefined &&
                item.categoryName
            ) {

                categoryMap.set(
                    String(item.categoryId),
                    {
                        id: item.categoryId,
                        name: item.categoryName
                    }
                );

            }

        });


        return Array
            .from(categoryMap.values())
            .sort((a, b) =>
                a.name.localeCompare(b.name)
            );

    }, [items]);


    // =====================================================
    // FILTER MENU ITEMS
    // =====================================================

    const filteredItems = useMemo(() => {

        const keyword =
            search
                .trim()
                .toLowerCase();


        return items.filter((item) => {

            const matchesSearch =
                !keyword ||

                item.itemName
                    ?.toLowerCase()
                    .includes(keyword) ||

                item.itemCode
                    ?.toLowerCase()
                    .includes(keyword) ||

                item.categoryName
                    ?.toLowerCase()
                    .includes(keyword) ||

                item.description
                    ?.toLowerCase()
                    .includes(keyword) ||

                item.sellingUnit
                    ?.toLowerCase()
                    .includes(keyword);


            const matchesCategory =
                !categoryFilter ||
                String(item.categoryId) ===
                    String(categoryFilter);


            return (
                matchesSearch &&
                matchesCategory
            );

        });

    }, [
        items,
        search,
        categoryFilter
    ]);


    // =====================================================
    // GROUP ITEMS BY CATEGORY
    // =====================================================

    const groupedItems = useMemo(() => {

        const groups = new Map();


        filteredItems.forEach((item) => {

            const categoryId =
                item.categoryId ??
                "uncategorized";


            const categoryName =
                item.categoryName ||
                "Uncategorized";


            if (!groups.has(categoryId)) {

                groups.set(
                    categoryId,
                    {
                        id: categoryId,
                        name: categoryName,
                        items: []
                    }
                );

            }


            groups
                .get(categoryId)
                .items
                .push(item);

        });


        return Array
            .from(groups.values())
            .map((group) => ({

                ...group,

                items: [...group.items].sort(
                    (a, b) => {

                        const orderA =
                            a.displayOrder ?? 0;

                        const orderB =
                            b.displayOrder ?? 0;


                        if (
                            orderA !==
                            orderB
                        ) {

                            return (
                                orderA -
                                orderB
                            );

                        }


                        return (
                            (a.itemName || "")
                                .localeCompare(
                                    b.itemName || ""
                                )
                        );

                    }
                )

            }))
            .sort((a, b) =>
                a.name.localeCompare(b.name)
            );

    }, [filteredItems]);


    // =====================================================
    // STATISTICS
    // =====================================================

    const totalItems =
        items.length;


    const activeItems =
        items.filter(
            (item) =>
                item.active === true
        ).length;


    const inactiveItems =
        items.filter(
            (item) =>
                item.active === false
        ).length;


    // =====================================================
    // DELETE MENU ITEM
    // =====================================================

    const deleteItem = async (id) => {

        // Frontend RBAC protection
        if (!canManageBar) {
            return;
        }


        if (!id || deletingId !== null) {
            return;
        }


        const confirmed =
            window.confirm(
                "Are you sure you want to delete this menu item?"
            );


        if (!confirmed) {
            return;
        }


        try {

            setDeletingId(id);
            setError("");

            await barMenuItemService
                .deleteItem(id);

            await fetchItems();

        } catch (error) {

            console.error(
                "Delete Menu Item Error:",
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Unable to delete menu item."
            );

        } finally {

            setDeletingId(null);
        }
    };


    // =====================================================
    // CLEAR FILTERS
    // =====================================================

    const clearFilters = () => {

        setSearch("");
        setCategoryFilter("");

    };


    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (

            <div className="bar-menu-page">

                <div className="bar-menu-loader">

                    <div className="bar-menu-spinner"></div>

                    <p>
                        Loading bar menu...
                    </p>

                </div>

            </div>

        );
    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="bar-menu-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="bar-menu-header">

                <div className="bar-menu-title">

                    <div className="bar-menu-title-icon">
                        <FaCocktail />
                    </div>


                    <div>

                        <h1>
                            Bar Menu
                        </h1>

                        <p>
                            Manage drinks and menu items
                        </p>

                    </div>

                </div>


                <div className="bar-menu-header-actions">


                    {/* REFRESH - ALL ROLES */}

                    <button
                        type="button"
                        className="bar-menu-refresh-btn"
                        onClick={fetchItems}
                        disabled={loading}
                    >

                        <FaSyncAlt />

                        <span>
                            Refresh
                        </span>

                    </button>


                    {/* ADD - ADMIN + BAR_MANAGER */}

                    {canManageBar && (

                        <button
                            type="button"
                            className="bar-menu-add-btn"
                            onClick={() =>
                                navigate(
                                    "/bar/menu/add"
                                )
                            }
                        >

                            <FaPlus />

                            <span>
                                Add Menu Item
                            </span>

                        </button>

                    )}

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="bar-menu-error">

                    <span>
                        {error}
                    </span>


                    <button
                        type="button"
                        onClick={fetchItems}
                    >

                        Try Again

                    </button>

                </div>

            )}


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="bar-menu-stat-grid">


                {/* TOTAL */}

                <div className="bar-menu-stat-card total">

                    <div className="bar-menu-stat-icon">
                        <FaCocktail />
                    </div>


                    <div>

                        <span>
                            Total Items
                        </span>

                        <strong>
                            {totalItems}
                        </strong>

                    </div>

                </div>


                {/* ACTIVE */}

                <div className="bar-menu-stat-card active">

                    <div className="bar-menu-stat-icon">
                        <FaCheckCircle />
                    </div>


                    <div>

                        <span>
                            Active
                        </span>

                        <strong>
                            {activeItems}
                        </strong>

                    </div>

                </div>


                {/* INACTIVE */}

                <div className="bar-menu-stat-card inactive">

                    <div className="bar-menu-stat-icon">
                        <FaTimesCircle />
                    </div>


                    <div>

                        <span>
                            Inactive
                        </span>

                        <strong>
                            {inactiveItems}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="bar-menu-content">


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div className="bar-menu-toolbar">

                    <div>

                        <h2>
                            Menu Items
                        </h2>

                        <p>

                            {filteredItems.length}

                            {" "}

                            {
                                filteredItems.length === 1
                                    ? "item"
                                    : "items"
                            }

                            {" "}
                            found

                        </p>

                    </div>


                    <div className="bar-menu-filters">


                        {/* SEARCH */}

                        <div className="bar-menu-search">

                            <FaSearch />


                            <input
                                type="text"
                                placeholder="Search drinks..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                            />


                            {search && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    aria-label="Clear search"
                                >

                                    ×

                                </button>

                            )}

                        </div>


                        {/* CATEGORY FILTER */}

                        <div className="bar-menu-category-filter">

                            <FaTags />


                            <select
                                value={categoryFilter}
                                onChange={(event) =>
                                    setCategoryFilter(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="">
                                    All Categories
                                </option>


                                {categories.map(
                                    (category) => (

                                        <option
                                            key={
                                                category.id
                                            }
                                            value={
                                                category.id
                                            }
                                        >

                                            {
                                                category.name
                                            }

                                        </option>

                                    )
                                )}

                            </select>


                            <FaChevronDown
                                className="bar-menu-select-arrow"
                            />

                        </div>


                        {/* CLEAR FILTER */}

                        {(search ||
                            categoryFilter) && (

                            <button
                                type="button"
                                className="bar-menu-clear-filter"
                                onClick={clearFilters}
                            >

                                Clear

                            </button>

                        )}

                    </div>

                </div>


                {/* =================================================
                    MENU GROUPS
                ================================================= */}

                <div className="bar-menu-groups">


                    {/* =================================================
                        EMPTY STATE
                    ================================================= */}

                    {groupedItems.length === 0 ? (

                        <div className="bar-menu-empty">

                            <div className="bar-menu-empty-icon">
                                <FaCocktail />
                            </div>


                            <h3>
                                No Menu Items Found
                            </h3>


                            <p>

                                {search ||
                                categoryFilter

                                    ? "Try changing your search or category filter."

                                    : "Start by adding your first menu item."
                                }

                            </p>


                            {!search &&
                                !categoryFilter &&
                                canManageBar && (

                                    <button
                                        type="button"
                                        className="bar-menu-empty-add"
                                        onClick={() =>
                                            navigate(
                                                "/bar/menu/add"
                                            )
                                        }
                                    >

                                        <FaPlus />

                                        Add Menu Item

                                    </button>

                                )}

                        </div>

                    ) : (


                        /* =================================================
                           CATEGORY GROUPS
                        ================================================= */

                        groupedItems.map(
                            (group) => (

                                <section
                                    className="bar-menu-category-section"
                                    key={group.id}
                                >


                                    {/* CATEGORY HEADER */}

                                    <div className="bar-menu-category-header">

                                        <div className="bar-menu-category-heading">

                                            <div className="bar-menu-category-icon">
                                                <FaCocktail />
                                            </div>


                                            <div>

                                                <h3>
                                                    {group.name}
                                                </h3>

                                                <span>

                                                    {
                                                        group.items.length
                                                    }

                                                    {" "}

                                                    {
                                                        group.items.length === 1
                                                            ? "item"
                                                            : "items"
                                                    }

                                                </span>

                                            </div>

                                        </div>


                                        <span className="bar-menu-category-count">

                                            {
                                                group.items.length
                                            }

                                        </span>

                                    </div>


                                    {/* MENU TABLE */}

                                    <div className="bar-menu-table-wrapper">

                                        <table className="bar-menu-table">

                                            <thead>

                                                <tr>

                                                    <th>
                                                        #
                                                    </th>

                                                    <th>
                                                        Menu Item
                                                    </th>

                                                    <th>
                                                        Price
                                                    </th>

                                                    <th>
                                                        Unit
                                                    </th>

                                                    <th>
                                                        Consumption
                                                    </th>

                                                    <th>
                                                        Order
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

                                                {group.items.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (

                                                        <tr
                                                            key={
                                                                item.id
                                                            }
                                                        >


                                                            {/* NUMBER */}

                                                            <td>

                                                                <span className="bar-menu-row-number">

                                                                    {
                                                                        index + 1
                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* MENU ITEM */}

                                                            <td>

                                                                <div className="bar-menu-item-cell">

                                                                    <div className="bar-menu-item-icon">
                                                                        <FaCocktail />
                                                                    </div>


                                                                    <div>

                                                                        <strong>

                                                                            {
                                                                                item.itemName
                                                                            }

                                                                        </strong>


                                                                        <small>

                                                                            {
                                                                                item.itemCode ||
                                                                                `ID: ${item.id}`
                                                                            }

                                                                        </small>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            {/* PRICE */}

                                                            <td>

                                                                <span className="bar-menu-price">

                                                                    <FaMoneyBillWave />

                                                                    ₹

                                                                    {
                                                                        item.price !== null &&
                                                                        item.price !== undefined
                                                                            ? Number(
                                                                                item.price
                                                                            ).toFixed(2)
                                                                            : "0.00"
                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* SELLING UNIT */}

                                                            <td>

                                                                <span className="bar-menu-unit">

                                                                    <FaWineBottle />

                                                                    {
                                                                        item.sellingUnit ||
                                                                        "-"
                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* CONSUMPTION */}

                                                            <td>

                                                                <span className="bar-menu-consumption">

                                                                    <FaBoxes />

                                                                    {
                                                                        item.consumptionQuantity ??
                                                                        "-"
                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* DISPLAY ORDER */}

                                                            <td>

                                                                <span className="bar-menu-order">

                                                                    {
                                                                        item.displayOrder ??
                                                                        0
                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* STATUS */}

                                                            <td>

                                                                <span
                                                                    className={
                                                                        item.active
                                                                            ? "bar-menu-status active"
                                                                            : "bar-menu-status inactive"
                                                                    }
                                                                >

                                                                    <span className="bar-menu-status-dot"></span>


                                                                    {
                                                                        item.active
                                                                            ? "Active"
                                                                            : "Inactive"
                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* ACTIONS */}

                                                            <td>

                                                                <div className="bar-menu-actions">


                                                                    {/* VIEW - ALL ROLES */}

                                                                    <button
                                                                        type="button"
                                                                        className="bar-menu-action view"
                                                                        title="View"
                                                                        onClick={() =>
                                                                            navigate(
                                                                                `/bar/menu/view/${item.id}`
                                                                            )
                                                                        }
                                                                    >

                                                                        <FaEye />

                                                                    </button>


                                                                    {/* EDIT - ADMIN + BAR_MANAGER */}

                                                                    {canManageBar && (

                                                                        <button
                                                                            type="button"
                                                                            className="bar-menu-action edit"
                                                                            title="Edit"
                                                                            onClick={() =>
                                                                                navigate(
                                                                                    `/bar/menu/edit/${item.id}`
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
                                                                            className="bar-menu-action delete"
                                                                            title="Delete"
                                                                            disabled={
                                                                                deletingId ===
                                                                                item.id
                                                                            }
                                                                            onClick={() =>
                                                                                deleteItem(
                                                                                    item.id
                                                                                )
                                                                            }
                                                                        >

                                                                            {
                                                                                deletingId ===
                                                                                item.id
                                                                                    ? "..."
                                                                                    : <FaTrash />
                                                                            }

                                                                        </button>

                                                                    )}

                                                                </div>

                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                </section>

                            )
                        )

                    )}

                </div>

            </div>

        </div>

    );
}


export default BarMenu;