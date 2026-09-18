// ================= RBAC =================
const getLoggedInUser = () => {
    try {
        const storedUser = sessionStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error("Unable to read logged-in user:", error);
        return null;
    }
};

import { useEffect, useMemo, useState } from "react";

import barTableService from "../../../services/barTableService";
import barMenuItemService from "../../../services/barMenuItemService";
import barOrderService from "../../../services/barOrderService";

import "./BarOrders.css";

const ORDER_TYPES = {
    DINE_IN: "DINE_IN",
    TAKEAWAY: "TAKEAWAY"
};

const BarOrders = () => {

    // ================= RBAC =================
    const user = getLoggedInUser();
    const userRole = user?.role || "NORMAL_USER";
    const canManageBar = userRole === "ADMIN" || userRole === "BAR_MANAGER";

    // =====================================================
    // DATA
    // =====================================================

    const [tables, setTables] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    // =====================================================
    // ORDER
    // =====================================================

    const [orderType, setOrderType] = useState(
        ORDER_TYPES.DINE_IN
    );

    const [selectedTableId, setSelectedTableId] = useState("");

    const [cart, setCart] = useState([]);

    const [discount, setDiscount] = useState("");
    const [notes, setNotes] = useState("");

    // =====================================================
    // UI
    // =====================================================

    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");

    // =====================================================
    // LOAD TABLES + MENU
    // =====================================================

    useEffect(() => {
        let isMounted = true;

        const loadOrderData = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    tablesResponse,
                    menuResponse
                ] = await Promise.all([
                    barTableService.getAllTables(),
                    barMenuItemService.getActiveItems()
                ]);

                const tableData = Array.isArray(tablesResponse)
                    ? tablesResponse
                    : tablesResponse?.data || [];

                const menuData = Array.isArray(menuResponse)
                    ? menuResponse
                    : menuResponse?.data || [];

                if (isMounted) {
                    setTables(tableData);
                    setMenuItems(menuData);
                }
            } catch (err) {
                console.error(
                    "Failed to load order data:",
                    err
                );

                if (isMounted) {
                    setError(
                        err.response?.data?.message ||
                        "Failed to load tables and menu items."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadOrderData();

        return () => {
            isMounted = false;
        };
    }, []);

    // =====================================================
    // AVAILABLE TABLES
    // =====================================================

    const availableTables = useMemo(() => {
        return tables.filter(
            (table) =>
                table.active !== false &&
                table.status === "AVAILABLE"
        );
    }, [tables]);

    // =====================================================
    // FILTER MENU
    // =====================================================

    const filteredMenuItems = useMemo(() => {
        const keyword = search
            .trim()
            .toLowerCase();

        if (!keyword) {
            return menuItems;
        }

        return menuItems.filter((item) => {
            const itemName =
                item.itemName?.toLowerCase() || "";

            const itemCode =
                item.itemCode?.toLowerCase() || "";

            const categoryName =
                item.categoryName?.toLowerCase() || "";

            return (
                itemName.includes(keyword) ||
                itemCode.includes(keyword) ||
                categoryName.includes(keyword)
            );
        });
    }, [menuItems, search]);

    // =====================================================
    // SUBTOTAL
    // =====================================================

    const subtotal = useMemo(() => {
        return cart.reduce(
            (total, item) =>
                total +
                item.unitPrice * item.quantity,
            0
        );
    }, [cart]);

    // =====================================================
    // DISCOUNT
    // =====================================================

    const discountAmount = useMemo(() => {
        const value = Number(discount) || 0;

        if (value < 0) {
            return 0;
        }

        return Math.min(value, subtotal);
    }, [discount, subtotal]);

    // =====================================================
    // TAX
    // Backend currently uses 0% tax.
    // =====================================================

    const tax = 0;

    // =====================================================
    // GRAND TOTAL
    // =====================================================

    const grandTotal = Math.max(
        subtotal - discountAmount + tax,
        0
    );

    // =====================================================
    // ADD ITEM TO CART
    // =====================================================

    const addToCart = (menuItem) => {
        if (!canManageBar) return;
        setError("");
        setSuccess("");

        setCart((currentCart) => {
            const existingItem = currentCart.find(
                (item) =>
                    item.menuItemId === menuItem.id
            );

            if (existingItem) {
                return currentCart.map((item) =>
                    item.menuItemId === menuItem.id
                        ? {
                            ...item,
                            quantity:
                                item.quantity + 1
                        }
                        : item
                );
            }

            return [
                ...currentCart,
                {
                    menuItemId: menuItem.id,
                    itemName: menuItem.itemName,
                    unitPrice:
                        Number(menuItem.price) || 0,
                    sellingUnit:
                        menuItem.sellingUnit,
                    quantity: 1
                }
            ];
        });
    };

    // =====================================================
    // INCREASE QUANTITY
    // =====================================================

    const increaseQuantity = (menuItemId) => {
        if (!canManageBar) return;
        setCart((currentCart) =>
            currentCart.map((item) =>
                item.menuItemId === menuItemId
                    ? {
                        ...item,
                        quantity:
                            item.quantity + 1
                    }
                    : item
            )
        );
    };

    // =====================================================
    // DECREASE QUANTITY
    // =====================================================

    const decreaseQuantity = (menuItemId) => {
        if (!canManageBar) return;
        setCart((currentCart) =>
            currentCart
                .map((item) =>
                    item.menuItemId === menuItemId
                        ? {
                            ...item,
                            quantity:
                                item.quantity - 1
                        }
                        : item
                )
                .filter(
                    (item) => item.quantity > 0
                )
        );
    };

    // =====================================================
    // REMOVE ITEM
    // =====================================================

    const removeFromCart = (menuItemId) => {
        if (!canManageBar) return;
        setCart((currentCart) =>
            currentCart.filter(
                (item) =>
                    item.menuItemId !== menuItemId
            )
        );
    };

    // =====================================================
    // ORDER TYPE CHANGE
    // =====================================================

    const handleOrderTypeChange = (type) => {
        if (!canManageBar) return;
        setOrderType(type);

        setError("");
        setSuccess("");

        if (type === ORDER_TYPES.TAKEAWAY) {
            setSelectedTableId("");
        }
    };

    // =====================================================
    // CLEAR ORDER
    // =====================================================

    const clearOrder = () => {
        if (!canManageBar) return;
        setCart([]);
        setSelectedTableId("");
        setDiscount("");
        setNotes("");
        setError("");
        setSuccess("");
    };

    // =====================================================
    // CREATE ORDER
    // =====================================================

    const handlePlaceOrder = async () => {
        if (!canManageBar) return;
        setError("");
        setSuccess("");

        // DINE IN requires table
        if (
            orderType === ORDER_TYPES.DINE_IN &&
            !selectedTableId
        ) {
            setError(
                "Please select an available table."
            );
            return;
        }

        // At least one item
        if (cart.length === 0) {
            setError(
                "Please add at least one menu item."
            );
            return;
        }

        // Discount validation
        if (Number(discount) < 0) {
            setError(
                "Discount cannot be negative."
            );
            return;
        }

        if (Number(discount) > subtotal) {
            setError(
                "Discount cannot be greater than subtotal."
            );
            return;
        }

        // Build backend request
        const orderData = {
            orderType,

            tableId:
                orderType === ORDER_TYPES.DINE_IN
                    ? Number(selectedTableId)
                    : null,

            discount:
                Number(discount) || 0,

            notes:
                notes.trim()
                    ? notes.trim()
                    : null,

            items: cart.map((item) => ({
                menuItemId:
                    item.menuItemId,

                quantity:
                    item.quantity
            }))
        };

        try {
            setPlacingOrder(true);

            const response =
                await barOrderService.createOrder(
                    orderData
                );

            const createdOrder =
                response?.data || response;

            setSuccess(
                `Order ${
                    createdOrder?.orderNumber || ""
                } created successfully.`
            );

            // Clear current order
            setCart([]);
            setSelectedTableId("");
            setDiscount("");
            setNotes("");

            // Refresh table status
            const tablesResponse =
                await barTableService.getAllTables();

            const tableData =
                Array.isArray(tablesResponse)
                    ? tablesResponse
                    : tablesResponse?.data || [];

            setTables(tableData);

        } catch (err) {
            console.error(
                "Failed to create order:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to create order."
            );
        } finally {
            setPlacingOrder(false);
        }
    };

    // =====================================================
    // FORMAT CURRENCY
    // =====================================================

    const formatCurrency = (amount) => {
        return `₹${Number(amount || 0).toFixed(2)}`;
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="bar-orders-page">
                <div className="orders-loading">
                    <div className="loading-spinner"></div>

                    <h3>
                        Loading Order Management
                    </h3>

                    <p>
                        Loading tables and menu items...
                    </p>
                </div>
            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="bar-orders-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="orders-header">

                <div>
                    <span className="page-label">
                        BAR POS
                    </span>

                    <h1>
                        Order Management
                    </h1>

                    <p>
                        Create and manage customer orders
                    </p>
                </div>

                <button
                    type="button"
                    className="clear-order-btn"
                    onClick={clearOrder}
                    disabled={
                        cart.length === 0 &&
                        !selectedTableId &&
                        !discount &&
                        !notes
                    }
                >
                    Clear Order
                </button>

            </div>

            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (
                <div className="order-alert error-alert">

                    <span className="alert-icon">
                        !
                    </span>

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        onClick={() => setError("")}
                        aria-label="Close error"
                    >
                        ×
                    </button>

                </div>
            )}

            {success && (
                <div className="order-alert success-alert">

                    <span className="alert-icon">
                        ✓
                    </span>

                    <span>
                        {success}
                    </span>

                    <button
                        type="button"
                        onClick={() => setSuccess("")}
                        aria-label="Close success message"
                    >
                        ×
                    </button>

                </div>
            )}

            {/* =================================================
                ORDER TYPE
            ================================================= */}

            <section className="order-type-section">

                <div className="section-heading">

                    <div>
                        <span className="section-label">
                            ORDER TYPE
                        </span>

                        <h2>
                            Select Order Type
                        </h2>
                    </div>

                </div>

                <div className="order-type-options">

                    <button
                        type="button"
                        className={`order-type-card ${
                            orderType ===
                            ORDER_TYPES.DINE_IN
                                ? "selected"
                                : ""
                        }`}
                        onClick={() =>
                            handleOrderTypeChange(
                                ORDER_TYPES.DINE_IN
                            )
                        }
                    >

                        <div className="order-type-icon">
                            🍽
                        </div>

                        <div className="order-type-content">

                            <strong>
                                Dine In
                            </strong>

                            <span>
                                Customer is seated at a table
                            </span>

                        </div>

                        <div className="selection-circle">
                            {orderType ===
                                ORDER_TYPES.DINE_IN &&
                                "✓"}
                        </div>

                    </button>

                    <button
                        type="button"
                        className={`order-type-card ${
                            orderType ===
                            ORDER_TYPES.TAKEAWAY
                                ? "selected"
                                : ""
                        }`}
                        onClick={() =>
                            handleOrderTypeChange(
                                ORDER_TYPES.TAKEAWAY
                            )
                        }
                    >

                        <div className="order-type-icon">
                            🛍
                        </div>

                        <div className="order-type-content">

                            <strong>
                                Takeaway
                            </strong>

                            <span>
                                Customer takes the order away
                            </span>

                        </div>

                        <div className="selection-circle">
                            {orderType ===
                                ORDER_TYPES.TAKEAWAY &&
                                "✓"}
                        </div>

                    </button>

                </div>

            </section>

            {/* =================================================
                MAIN POS LAYOUT
            ================================================= */}

            <div className="orders-layout">

                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="orders-main">

                    {/* =================================================
                        TABLE SELECTION
                    ================================================= */}

                    {orderType ===
                        ORDER_TYPES.DINE_IN && (
                        <section className="orders-card">

                            <div className="card-header">

                                <div>
                                    <span className="section-label">
                                        TABLE
                                    </span>

                                    <h2>
                                        Select Available Table
                                    </h2>
                                </div>

                                <span className="available-count">
                                    {availableTables.length}{" "}
                                    Available
                                </span>

                            </div>

                            {availableTables.length === 0 ? (

                                <div className="empty-state">

                                    <div className="empty-icon">
                                        🪑
                                    </div>

                                    <h3>
                                        No Available Tables
                                    </h3>

                                    <p>
                                        There are currently no
                                        available tables for a
                                        new dine-in order.
                                    </p>

                                </div>

                            ) : (

                                <div className="tables-grid">

                                    {availableTables.map(
                                        (table) => (
                                            <button
                                                type="button"
                                                key={table.id}
                                                className={`table-card ${
                                                    String(
                                                        selectedTableId
                                                    ) ===
                                                    String(
                                                        table.id
                                                    )
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setSelectedTableId(
                                                        table.id
                                                    )
                                                }
                                            >

                                                <div className="table-top">

                                                    <div className="table-number">
                                                        {
                                                            table.tableNumber
                                                        }
                                                    </div>

                                                    {String(
                                                        selectedTableId
                                                    ) ===
                                                        String(
                                                            table.id
                                                        ) && (
                                                            <span className="table-check">
                                                                ✓
                                                            </span>
                                                        )}

                                                </div>

                                                <div className="table-info">

                                                    <span>
                                                        {table.name ||
                                                            "Dining Table"}
                                                    </span>

                                                    <small>
                                                        Capacity:{" "}
                                                        {table.capacity}
                                                    </small>

                                                </div>

                                            </button>
                                        )
                                    )}

                                </div>
                            )}

                        </section>
                    )}

                    {/* =================================================
                        MENU
                    ================================================= */}

                    <section className="orders-card menu-section">

                        <div className="card-header menu-header">

                            <div>
                                <span className="section-label">
                                    MENU
                                </span>

                                <h2>
                                    Available Menu Items
                                </h2>
                            </div>

                            <div className="menu-search">

                                <span className="search-icon">
                                    ⌕
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search item, code or category..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>

                        {filteredMenuItems.length === 0 ? (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    🔍
                                </div>

                                <h3>
                                    No Menu Items Found
                                </h3>

                                <p>
                                    Try searching with another
                                    item name or category.
                                </p>

                            </div>

                        ) : (

                            <div className="menu-grid">

                                {filteredMenuItems.map(
                                    (item) => (
                                        <div
                                            className="menu-item-card"
                                            key={item.id}
                                        >

                                            <div className="menu-item-top">

                                                <div className="menu-item-icon">
                                                    🍹
                                                </div>

                                                <span className="menu-category">
                                                    {item.categoryName ||
                                                        "General"}
                                                </span>

                                            </div>

                                            <div className="menu-item-content">

                                                <h3>
                                                    {item.itemName}
                                                </h3>

                                                {item.itemCode && (
                                                    <span className="item-code">
                                                        {item.itemCode}
                                                    </span>
                                                )}

                                                {item.description && (
                                                    <p>
                                                        {
                                                            item.description
                                                        }
                                                    </p>
                                                )}

                                            </div>

                                            <div className="menu-item-bottom">

                                                <div className="price-area">

                                                    <strong>
                                                        {formatCurrency(
                                                            item.price
                                                        )}
                                                    </strong>

                                                    {item.sellingUnit && (
                                                        <span>
                                                            /{" "}
                                                            {
                                                                item.sellingUnit
                                                            }
                                                        </span>
                                                    )}

                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        addToCart(
                                                            item
                                                        )
                                                    }
                                                >
                                                    + Add
                                                </button>

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </section>

                </div>

                {/* =================================================
                    RIGHT SIDE - ORDER SUMMARY
                ================================================= */}

                <aside className="order-summary">

                    <div className="summary-header">

                        <div>
                            <span className="section-label">
                                CURRENT ORDER
                            </span>

                            <h2>
                                Order Summary
                            </h2>
                        </div>

                        <span className="cart-count">
                            {cart.length}
                        </span>

                    </div>

                    {/* =================================================
                        ORDER INFO
                    ================================================= */}

                    <div className="summary-order-info">

                        <div>
                            <span>
                                Order Type
                            </span>

                            <strong>
                                {orderType ===
                                    ORDER_TYPES.DINE_IN
                                    ? "Dine In"
                                    : "Takeaway"}
                            </strong>
                        </div>

                        {orderType ===
                            ORDER_TYPES.DINE_IN && (
                            <div>

                                <span>
                                    Table
                                </span>

                                <strong>
                                    {selectedTableId
                                        ? tables.find(
                                            (table) =>
                                                String(
                                                    table.id
                                                ) ===
                                                String(
                                                    selectedTableId
                                                )
                                        )?.tableNumber ||
                                        "-"
                                        : "Not Selected"}
                                </strong>

                            </div>
                        )}

                    </div>

                    {/* =================================================
                        CART ITEMS
                    ================================================= */}

                    <div className="cart-items">

                        {cart.length === 0 ? (

                            <div className="cart-empty">

                                <div className="cart-empty-icon">
                                    🛒
                                </div>

                                <h3>
                                    Your order is empty
                                </h3>

                                <p>
                                    Select menu items to add
                                    them to the current order.
                                </p>

                            </div>

                        ) : (

                            cart.map((item) => (

                                <div
                                    className="cart-item"
                                    key={item.menuItemId}
                                >

                                    <div className="cart-item-details">

                                        <h3>
                                            {item.itemName}
                                        </h3>

                                        <span>
                                            {formatCurrency(
                                                item.unitPrice
                                            )}{" "}
                                            ×{" "}
                                            {item.quantity}
                                        </span>

                                    </div>

                                    <div className="cart-item-right">

                                        <strong>
                                            {formatCurrency(
                                                item.unitPrice *
                                                item.quantity
                                            )}
                                        </strong>

                                        <div className="quantity-controls">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    decreaseQuantity(
                                                        item.menuItemId
                                                    )
                                                }
                                                aria-label="Decrease quantity"
                                            >
                                                −
                                            </button>

                                            <span>
                                                {item.quantity}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    increaseQuantity(
                                                        item.menuItemId
                                                    )
                                                }
                                                aria-label="Increase quantity"
                                            >
                                                +
                                            </button>

                                            <button
                                                type="button"
                                                className="remove-item"
                                                onClick={() =>
                                                    removeFromCart(
                                                        item.menuItemId
                                                    )
                                                }
                                                aria-label="Remove item"
                                            >
                                                ×
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                    {/* =================================================
                        NOTES
                    ================================================= */}

                    <div className="summary-field">

                        <label htmlFor="order-notes">
                            Order Notes
                        </label>

                        <textarea
                            id="order-notes"
                            rows="3"
                            maxLength="500"
                            placeholder="Special instructions..."
                            value={notes}
                            onChange={(event) =>
                                setNotes(
                                    event.target.value
                                )
                            }
                        />

                        <div className="character-count">
                            {notes.length}/500
                        </div>

                    </div>

                    {/* =================================================
                        DISCOUNT
                    ================================================= */}

                    <div className="summary-field">

                        <label htmlFor="discount">
                            Discount
                        </label>

                        <div className="discount-input">

                            <span>
                                ₹
                            </span>

                            <input
                                id="discount"
                                type="number"
                                min="0"
                                max={subtotal}
                                step="0.01"
                                placeholder="0.00"
                                value={discount}
                                onChange={(event) =>
                                    setDiscount(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                    {/* =================================================
                        TOTALS
                    ================================================= */}

                    <div className="summary-totals">

                        <div className="total-row">
                            <span>
                                Subtotal
                            </span>

                            <strong>
                                {formatCurrency(
                                    subtotal
                                )}
                            </strong>
                        </div>

                        <div className="total-row">
                            <span>
                                Discount
                            </span>

                            <strong className="discount-value">
                                -{" "}
                                {formatCurrency(
                                    discountAmount
                                )}
                            </strong>
                        </div>

                        <div className="total-row">
                            <span>
                                Tax
                            </span>

                            <strong>
                                {formatCurrency(tax)}
                            </strong>
                        </div>

                        <div className="grand-total">
                            <span>
                                Grand Total
                            </span>

                            <strong>
                                {formatCurrency(
                                    grandTotal
                                )}
                            </strong>
                        </div>

                    </div>

                    {/* =================================================
                        PLACE ORDER
                    ================================================= */}

                    <button
                        type="button"
                        className="place-order-btn"
                        onClick={handlePlaceOrder}
                        disabled={
                            placingOrder ||
                            cart.length === 0
                        }
                    >

                        {placingOrder ? (
                            <>
                                <span className="button-spinner"></span>
                                Creating Order...
                            </>
                        ) : (
                            <>
                                <span>
                                    Place Order
                                </span>

                                <strong>
                                    {formatCurrency(
                                        grandTotal
                                    )}
                                </strong>
                            </>
                        )}

                    </button>

                </aside>

            </div>

        </div>
    );
};

export default BarOrders;