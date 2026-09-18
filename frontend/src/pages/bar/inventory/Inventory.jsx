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

import {
    Search,
    Plus,
    Package,
    AlertTriangle,
    CheckCircle2,
    RefreshCw,
    MoreVertical,
    ArrowDownToLine,
    ArrowUpFromLine,
    SlidersHorizontal,
    History,
    X,
    QrCode,
    ScanLine
} from "lucide-react";

import barInventoryService from "../../../services/barInventoryService";
import AddInventory from "./AddInventory";
import InventoryHistory from "./InventoryHistory";
import QrScanner from "./QrScanner";

import "./Inventory.css";


function Inventory() {

    // ================= RBAC =================
    const user = getLoggedInUser();
    const userRole = user?.role || "NORMAL_USER";
    const canManageBar = userRole === "ADMIN" || userRole === "BAR_MANAGER";


    // ==========================================
    // STATE
    // ==========================================

    const [inventory, setInventory] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [categoryFilter, setCategoryFilter] =
        useState("ALL");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [actionMenu, setActionMenu] =
        useState(null);

    const [showAddInventory, setShowAddInventory] =
        useState(false);

    const [showQrScanner, setShowQrScanner] =
        useState(false);

    const [qrLoading, setQrLoading] =
        useState(false);

    const [qrError, setQrError] =
        useState("");

    const [qrResult, setQrResult] =
        useState(null);

    const [unregisteredQrCode, setUnregisteredQrCode] =
        useState("");

    const [historyItem, setHistoryItem] =
        useState(null);

    const [transactionModal, setTransactionModal] =
        useState(null);

    const [transactionLoading, setTransactionLoading] =
        useState(false);

    const [transactionError, setTransactionError] =
        useState("");

    const [transactionForm, setTransactionForm] =
        useState({
            quantity: "",
            reason: "",
            referenceNumber: "",
            increaseStock: true
        });


    // ==========================================
    // INITIAL INVENTORY LOAD
    // ==========================================

    useEffect(() => {

        let cancelled = false;

        const loadInventory = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await barInventoryService
                        .getAllInventory();

                if (cancelled) {
                    return;
                }

                setInventory(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (err) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to load inventory:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load inventory."
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        };

        loadInventory();

        return () => {
            cancelled = true;
        };

    }, []);


    // ==========================================
    // REFRESH INVENTORY
    // ==========================================

    const fetchInventory = async () => {

        try {

            setError("");

            const response =
                await barInventoryService
                    .getAllInventory();

            const items =
                Array.isArray(response.data)
                    ? response.data
                    : [];

            setInventory(items);

            return items;

        } catch (err) {

            console.error(
                "Failed to refresh inventory:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to refresh inventory."
            );

        }

    };


    // ==========================================
    // EXISTING MENU ITEM IDS
    // ==========================================

    const existingMenuItemIds = useMemo(() => {

        return inventory
            .map(item => item.menuItemId)
            .filter(
                id =>
                    id !== null &&
                    id !== undefined
            );

    }, [inventory]);


    // ==========================================
    // CATEGORY LIST
    // ==========================================

    const categories = useMemo(() => {

        const uniqueCategories =
            inventory
                .map(item => item.categoryName)
                .filter(Boolean);

        return [
            ...new Set(uniqueCategories)
        ];

    }, [inventory]);


    // ==========================================
    // FILTER INVENTORY
    // ==========================================

    const filteredInventory = useMemo(() => {

        return inventory.filter(item => {

            const search =
                searchTerm
                    .toLowerCase()
                    .trim();

            const matchesSearch =
                !search ||
                item.itemName
                    ?.toLowerCase()
                    .includes(search) ||
                item.itemCode
                    ?.toLowerCase()
                    .includes(search);

            const matchesCategory =
                categoryFilter === "ALL" ||
                item.categoryName ===
                    categoryFilter;

            const matchesStatus =
                statusFilter === "ALL" ||

                (
                    statusFilter === "LOW" &&
                    item.lowStock
                ) ||

                (
                    statusFilter === "AVAILABLE" &&
                    !item.lowStock &&
                    item.active
                ) ||

                (
                    statusFilter === "INACTIVE" &&
                    !item.active
                );

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );

        });

    }, [
        inventory,
        searchTerm,
        categoryFilter,
        statusFilter
    ]);


    // ==========================================
    // SUMMARY
    // ==========================================

    const totalItems =
        inventory.length;

    const lowStockItems =
        inventory.filter(
            item => item.lowStock
        ).length;

    const activeItems =
        inventory.filter(
            item => item.active
        ).length;

    const inactiveItems =
        inventory.filter(
            item => !item.active
        ).length;


    // ==========================================
    // OPEN HISTORY
    // ==========================================

    const openHistory = (item) => {

        setActionMenu(null);

        setHistoryItem(item);

    };


    // ==========================================
    // OPEN TRANSACTION MODAL
    // ==========================================

    const openTransactionModal = (
        item,
        type
    ) => {
        if (!canManageBar) {
            return;
        }

        setActionMenu(null);

        setTransactionError("");

        setTransactionForm({
            quantity: "",
            reason:
                type === "STOCK_IN"
                    ? "New Purchase"
                    : "",
            referenceNumber: "",
            increaseStock: true
        });

        setTransactionModal({
            item,
            type
        });

    };


    // ==========================================
    // QR SCAN RESULT
    // ==========================================

    const handleQrScan = async (qrCode) => {

        const normalizedQrCode =
            String(qrCode || "").trim();

        setShowQrScanner(false);
        setQrLoading(true);
        setQrError("");
        setQrResult(null);
        setUnregisteredQrCode("");

        if (!normalizedQrCode) {

            setQrLoading(false);
            setQrError("The scanned QR code is empty.");
            return;

        }

        try {

            const response =
                await barInventoryService
                    .getInventoryByQrCode(normalizedQrCode);

            setQrResult({
                code: normalizedQrCode,
                item: response.data
            });

        } catch (err) {

            console.error(
                "QR inventory lookup failed:",
                err
            );

            const status = err.response?.status;

            if (status === 404) {
                setUnregisteredQrCode(normalizedQrCode);
            } else {
                setQrError(
                    err.response?.data?.message ||
                    "Unable to look up this QR code. Please try again."
                );
            }

        } finally {

            setQrLoading(false);

        }
    };


    const closeQrResult = () => {
        setQrResult(null);
        setQrError("");
        setUnregisteredQrCode("");
    };


    const openInventoryForQr = () => {

        if (!canManageBar || !unregisteredQrCode) {
            return;
        }

        setQrResult(null);
        setQrError("");
        setShowAddInventory(true);

    };


    // ==========================================
    // CLOSE TRANSACTION MODAL
    // ==========================================

    const closeTransactionModal = () => {

        if (transactionLoading) {
            return;
        }

        setTransactionModal(null);

        setTransactionError("");

    };


    // ==========================================
    // TRANSACTION FORM CHANGE
    // ==========================================

    const handleTransactionChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;

        setTransactionForm(previous => ({

            ...previous,

            [name]:
                name === "increaseStock"
                    ? value === "true"
                    : value

        }));

    };


    // ==========================================
    // SUBMIT TRANSACTION
    // ==========================================

    const handleTransactionSubmit =
        async (event) => {

            event.preventDefault();

            if (!canManageBar || !transactionModal) {
                return;
            }

            const quantity =
                Number(
                    transactionForm.quantity
                );


            // --------------------------------------
            // QUANTITY VALIDATION
            // --------------------------------------

            if (
                !quantity ||
                quantity <= 0
            ) {

                setTransactionError(
                    "Please enter a valid quantity."
                );

                return;
            }


            // --------------------------------------
            // STOCK OUT VALIDATION
            // --------------------------------------

            if (
                transactionModal.type ===
                    "STOCK_OUT" &&
                quantity >
                    Number(
                        transactionModal
                            .item
                            .currentQuantity
                    )
            ) {

                setTransactionError(
                    `Insufficient stock. Available stock: ${
                        Number(
                            transactionModal
                                .item
                                .currentQuantity
                        ).toLocaleString()
                    } ${
                        transactionModal
                            .item
                            .unit
                    }`
                );

                return;
            }


            // --------------------------------------
            // ADJUSTMENT VALIDATION
            // --------------------------------------

            if (
                transactionModal.type ===
                    "ADJUSTMENT" &&
                !transactionForm.reason.trim()
            ) {

                setTransactionError(
                    "Reason is required for adjustment."
                );

                return;
            }


            try {

                setTransactionLoading(true);

                setTransactionError("");


                // --------------------------------------
                // PAYLOAD
                // --------------------------------------

                const payload = {

                    inventoryId:
                        transactionModal
                            .item
                            .id,

                    transactionType:
                        transactionModal.type,

                    quantity,

                    reason:
                        transactionForm.reason
                            .trim() || null,

                    referenceNumber:
                        transactionForm.referenceNumber
                            .trim() || null

                };


                // --------------------------------------
                // ADJUSTMENT
                // --------------------------------------

                if (
                    transactionModal.type ===
                    "ADJUSTMENT"
                ) {

                    payload.increaseStock =
                        transactionForm
                            .increaseStock;

                }


                // --------------------------------------
                // CREATE TRANSACTION
                // --------------------------------------

                await barInventoryService
                    .createTransaction(
                        payload
                    );


                // --------------------------------------
                // REFRESH
                // --------------------------------------

                const refreshedInventory =
                    await fetchInventory();


                // --------------------------------------
                // REFRESH QR RESULT IF NEEDED
                // --------------------------------------

                if (qrResult?.item?.id === transactionModal.item.id) {

                    const refreshedItem =
                        refreshedInventory?.find(
                            item =>
                                item.id === transactionModal.item.id
                        );

                    if (refreshedItem) {
                        setQrResult(previous => ({
                            ...previous,
                            item: refreshedItem
                        }));
                    }
                }


                // --------------------------------------
                // CLOSE
                // --------------------------------------

                setTransactionModal(null);

                setTransactionError("");

            } catch (err) {

                console.error(
                    "Transaction failed:",
                    err
                );

                setTransactionError(
                    err.response?.data?.message ||
                    "Transaction failed."
                );

            } finally {

                setTransactionLoading(false);

            }

        };


    // ==========================================
    // ACTION MENU
    // ==========================================

    const toggleActionMenu = (id) => {

        setActionMenu(previous =>
            previous === id
                ? null
                : id
        );

    };


    // ==========================================
    // ADD INVENTORY SUCCESS
    // ==========================================

    const handleInventoryCreated =
        async () => {
            if (!canManageBar) {
                return;
            }

            await fetchInventory();

            setShowAddInventory(false);
            setUnregisteredQrCode("");
            setQrError("");

        };


    // ==========================================
    // LOADING SCREEN
    // ==========================================

    if (loading) {

        return (

            <div className="inventory-loading">

                <RefreshCw
                    size={24}
                    className="spin"
                />

                <span>
                    Loading inventory...
                </span>

            </div>

        );

    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div className="inventory-page">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="inventory-header">

                <div>

                    <div className="inventory-title-row">

                        <Package size={28} />

                        <h1>
                            Bar Inventory
                        </h1>

                    </div>

                    <p>
                        Manage stock levels,
                        purchases and inventory
                        movements.
                    </p>

                </div>


                <div className="inventory-header-actions">

                    <button
                        className="inventory-secondary-btn"
                        onClick={fetchInventory}
                    >

                        <RefreshCw size={17} />

                        Refresh

                    </button>


                    {canManageBar && (
                        <button
                            className="inventory-secondary-btn inventory-scan-btn"
                            onClick={() => {
                                setQrError("");
                                setQrResult(null);
                                setShowQrScanner(true);
                            }}
                        >
                            <ScanLine size={17} />
                            Scan QR
                        </button>
                    )}

                    {canManageBar && (
                        <button
                            className="inventory-primary-btn"
                            onClick={() => setShowAddInventory(true)}
                        >
                            <Plus size={17} />
                            Add Inventory
                        </button>
                    )}

                </div>

            </div>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <div className="inventory-error">

                    <AlertTriangle size={18} />

                    <span>
                        {error}
                    </span>

                    <button
                        onClick={() =>
                            setError("")
                        }
                    >

                        <X size={16} />

                    </button>

                </div>

            )}


            {/* ==================================
                SUMMARY
            ================================== */}

            <div className="inventory-summary">

                <div className="summary-card">

                    <div className="summary-icon">

                        <Package size={20} />

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


                <div className="summary-card">

                    <div className="summary-icon warning">

                        <AlertTriangle size={20} />

                    </div>

                    <div>

                        <span>
                            Low Stock
                        </span>

                        <strong>
                            {lowStockItems}
                        </strong>

                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon success">

                        <CheckCircle2 size={20} />

                    </div>

                    <div>

                        <span>
                            Active Items
                        </span>

                        <strong>
                            {activeItems}
                        </strong>

                    </div>

                </div>


                <div className="summary-card">

                    <div className="summary-icon">

                        <SlidersHorizontal size={20} />

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


            {/* ==================================
                FILTER TOOLBAR
            ================================== */}

            <div className="inventory-toolbar">

                <div className="inventory-search">

                    <Search size={18} />

                    <input
                        type="text"
                        placeholder="Search item or code..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(
                                event.target.value
                            )
                        }
                    />

                </div>


                <select
                    value={categoryFilter}
                    onChange={(event) =>
                        setCategoryFilter(
                            event.target.value
                        )
                    }
                >

                    <option value="ALL">
                        All Categories
                    </option>

                    {categories.map(category => (

                        <option
                            key={category}
                            value={category}
                        >
                            {category}
                        </option>

                    ))}

                </select>


                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(
                            event.target.value
                        )
                    }
                >

                    <option value="ALL">
                        All Status
                    </option>

                    <option value="AVAILABLE">
                        Available
                    </option>

                    <option value="LOW">
                        Low Stock
                    </option>

                    <option value="INACTIVE">
                        Inactive
                    </option>

                </select>

            </div>


            {/* ==================================
                INVENTORY TABLE
            ================================== */}

            <div className="inventory-table-card">

                <div className="table-header">

                    <div>

                        <h2>
                            Current Stock
                        </h2>

                        <span>
                            {filteredInventory.length}
                            {" "}items
                        </span>

                    </div>

                </div>


                {filteredInventory.length === 0 ? (

                    <div className="inventory-empty">

                        <Package size={42} />

                        <h3>
                            No inventory found
                        </h3>

                        <p>
                            Try changing your
                            search or filters.
                        </p>

                    </div>

                ) : (

                    <div className="inventory-table-wrapper">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Item
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Current Stock
                                    </th>

                                    <th>
                                        Minimum Stock
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

                                {filteredInventory.map(
                                    item => (

                                        <tr
                                            key={item.id}
                                        >

                                            {/* ITEM */}

                                            <td>

                                                <div className="item-cell">

                                                    <div className="item-avatar">

                                                        {item.itemName
                                                            ?.charAt(0)
                                                            ?.toUpperCase()}

                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {item.itemName}
                                                        </strong>

                                                        <span>
                                                            {item.itemCode}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CATEGORY */}

                                            <td>

                                                <span className="category-badge">

                                                    {item.categoryName ||
                                                        "Uncategorized"}

                                                </span>

                                            </td>


                                            {/* CURRENT STOCK */}

                                            <td>

                                                <div className="quantity-cell">

                                                    <strong>

                                                        {Number(
                                                            item.currentQuantity
                                                        ).toLocaleString()}

                                                    </strong>

                                                    <span>
                                                        {item.unit}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* MINIMUM STOCK */}

                                            <td>

                                                {Number(
                                                    item.minimumQuantity
                                                ).toLocaleString()}

                                                {" "}

                                                {item.unit}

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                {!item.active ? (

                                                    <span className="status-badge inactive">
                                                        Inactive
                                                    </span>

                                                ) : item.lowStock ? (

                                                    <span className="status-badge low">

                                                        <AlertTriangle
                                                            size={14}
                                                        />

                                                        Low Stock

                                                    </span>

                                                ) : (

                                                    <span className="status-badge available">

                                                        <CheckCircle2
                                                            size={14}
                                                        />

                                                        In Stock

                                                    </span>

                                                )}

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="action-wrapper">

                                                    <button
                                                        className="action-button"
                                                        onClick={() =>
                                                            toggleActionMenu(
                                                                item.id
                                                            )
                                                        }
                                                    >

                                                        <MoreVertical
                                                            size={18}
                                                        />

                                                    </button>


                                                    {actionMenu ===
                                                        item.id && (

                                                        <div className="action-dropdown">

                                                            {/* HISTORY */}

                                                            <button
                                                                onClick={() =>
                                                                    openHistory(
                                                                        item
                                                                    )
                                                                }
                                                            >

                                                                <History
                                                                    size={16}
                                                                />

                                                                View History

                                                            </button>


                                                            {/* STOCK IN */}

                                                            {canManageBar && (
                                                                <button
                                                                    onClick={() =>
                                                                        openTransactionModal(
                                                                            item,
                                                                            "STOCK_IN"
                                                                        )
                                                                    }
                                                                >
                                                                    <ArrowDownToLine size={16} />
                                                                    Stock In
                                                                </button>
                                                            )}


                                                            {/* STOCK OUT */}

                                                            {canManageBar && (
                                                                <button
                                                                    onClick={() =>
                                                                        openTransactionModal(
                                                                            item,
                                                                            "STOCK_OUT"
                                                                        )
                                                                    }
                                                                >
                                                                    <ArrowUpFromLine size={16} />
                                                                    Stock Out
                                                                </button>
                                                            )}


                                                            {/* ADJUSTMENT */}

                                                            {canManageBar && (
                                                                <button
                                                                    onClick={() =>
                                                                        openTransactionModal(
                                                                            item,
                                                                            "ADJUSTMENT"
                                                                        )
                                                                    }
                                                                >
                                                                    <SlidersHorizontal size={16} />
                                                                    Adjustment
                                                                </button>
                                                            )}

                                                        </div>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


            {/* ==================================
                TRANSACTION MODAL
            ================================== */}

            {canManageBar && transactionModal && (

                <div
                    className="inventory-modal-overlay"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {

                            closeTransactionModal();

                        }

                    }}
                >

                    <div className="inventory-modal">


                        {/* MODAL HEADER */}

                        <div className="modal-header">

                            <div>

                                <h2>

                                    {
                                        transactionModal.type ===
                                            "STOCK_IN"
                                            ? "Stock In"
                                            : transactionModal.type ===
                                                "STOCK_OUT"
                                                ? "Stock Out"
                                                : "Stock Adjustment"
                                    }

                                </h2>

                                <p>

                                    {
                                        transactionModal
                                            .item
                                            .itemName
                                    }

                                    {" • "}

                                    {Number(
                                        transactionModal
                                            .item
                                            .currentQuantity
                                    ).toLocaleString()}

                                    {" "}

                                    {
                                        transactionModal
                                            .item
                                            .unit
                                    }

                                    {" "}available

                                </p>

                            </div>


                            <button
                                onClick={
                                    closeTransactionModal
                                }
                                disabled={
                                    transactionLoading
                                }
                            >

                                <X size={20} />

                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={
                                handleTransactionSubmit
                            }
                        >


                            {/* ERROR */}

                            {transactionError && (

                                <div className="modal-error">

                                    <AlertTriangle
                                        size={17}
                                    />

                                    <span>
                                        {transactionError}
                                    </span>

                                </div>

                            )}


                            {/* ADJUSTMENT TYPE */}

                            {transactionModal.type ===
                                "ADJUSTMENT" && (

                                <div className="form-group">

                                    <label>
                                        Adjustment Type
                                    </label>

                                    <select
                                        name="increaseStock"
                                        value={String(
                                            transactionForm
                                                .increaseStock
                                        )}
                                        onChange={
                                            handleTransactionChange
                                        }
                                    >

                                        <option value="true">
                                            Increase Stock
                                        </option>

                                        <option value="false">
                                            Decrease Stock
                                        </option>

                                    </select>

                                </div>

                            )}


                            {/* QUANTITY */}

                            <div className="form-group">

                                <label>

                                    Quantity

                                    <span>
                                        *
                                    </span>

                                </label>

                                <div className="quantity-input">

                                    <input
                                        type="number"
                                        name="quantity"
                                        min="0.001"
                                        step="0.001"
                                        placeholder="Enter quantity"
                                        value={
                                            transactionForm
                                                .quantity
                                        }
                                        onChange={
                                            handleTransactionChange
                                        }
                                        required
                                    />

                                    <span>
                                        {
                                            transactionModal
                                                .item
                                                .unit
                                        }
                                    </span>

                                </div>

                            </div>


                            {/* REASON */}

                            <div className="form-group">

                                <label>

                                    Reason

                                    {transactionModal.type ===
                                        "ADJUSTMENT" && (

                                        <span>
                                            *
                                        </span>

                                    )}

                                </label>

                                <input
                                    type="text"
                                    name="reason"
                                    placeholder={
                                        transactionModal.type ===
                                            "STOCK_IN"
                                            ? "e.g. New Purchase"
                                            : transactionModal.type ===
                                                "STOCK_OUT"
                                                ? "e.g. Bar Sale"
                                                : "e.g. Physical stock correction"
                                    }
                                    value={
                                        transactionForm
                                            .reason
                                    }
                                    onChange={
                                        handleTransactionChange
                                    }
                                />

                            </div>


                            {/* REFERENCE NUMBER */}

                            <div className="form-group">

                                <label>
                                    Reference Number
                                </label>

                                <input
                                    type="text"
                                    name="referenceNumber"
                                    placeholder="e.g. PO-001"
                                    value={
                                        transactionForm
                                            .referenceNumber
                                    }
                                    onChange={
                                        handleTransactionChange
                                    }
                                />

                            </div>


                            {/* MODAL ACTIONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={
                                        closeTransactionModal
                                    }
                                    disabled={
                                        transactionLoading
                                    }
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={
                                        transactionLoading
                                    }
                                >

                                    {
                                        transactionLoading
                                            ? "Processing..."
                                            : "Confirm Transaction"
                                    }

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* ==================================
                QR LOOKUP LOADING
            ================================== */}

            {qrLoading && (
                <div className="inventory-qr-loading">
                    <QrCode size={18} />
                    <span>Looking up inventory for scanned QR code...</span>
                </div>
            )}


            {/* ==================================
                QR LOOKUP ERROR
            ================================== */}

            {qrError && (
                <div className="inventory-qr-result error">
                    <div>
                        <strong>QR scan lookup failed</strong>
                        <span>{qrError}</span>
                    </div>
                    <button type="button" onClick={closeQrResult}>
                        <X size={16} />
                    </button>
                </div>
            )}


            {/* ==================================
                UNREGISTERED QR
            ================================== */}

            {unregisteredQrCode && (
                <div className="inventory-qr-result warning">
                    <div className="qr-result-main">
                        <div className="qr-result-icon">
                            <QrCode size={21} />
                        </div>

                        <div>
                            <strong>New QR Code Detected</strong>
                            <span>QR: {unregisteredQrCode}</span>
                            <span>
                                This QR code is not registered in inventory yet.
                            </span>
                        </div>
                    </div>

                    {canManageBar && (
                        <button
                            type="button"
                            className="qr-result-primary-action"
                            onClick={openInventoryForQr}
                        >
                            <Plus size={16} />
                            Add to Inventory
                        </button>
                    )}

                    <button
                        type="button"
                        className="qr-result-close"
                        onClick={closeQrResult}
                        aria-label="Close QR result"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}


            {/* ==================================
                QR LOOKUP RESULT
            ================================== */}

            {qrResult && (
                <div className="inventory-qr-result success">
                    <div className="qr-result-main">
                        <div className="qr-result-icon">
                            <QrCode size={21} />
                        </div>

                        <div>
                            <strong>{qrResult.item?.itemName || "Inventory Item"}</strong>
                            <span>
                                QR: {qrResult.code}
                            </span>
                            <span>
                                {qrResult.item?.itemCode || "-"} · {qrResult.item?.categoryName || "-"}
                            </span>
                        </div>
                    </div>

                    <div className="qr-result-stock">
                        <span>Current Stock</span>
                        <strong>
                            {Number(qrResult.item?.currentQuantity ?? 0).toLocaleString()} {qrResult.item?.unit || ""}
                        </strong>
                    </div>

                    {canManageBar && (
                        <button
                            type="button"
                            className="qr-result-primary-action"
                            onClick={() =>
                                openTransactionModal(
                                    qrResult.item,
                                    "STOCK_IN"
                                )
                            }
                        >
                            <ArrowDownToLine size={16} />
                            Add Stock
                        </button>
                    )}

                    <button
                        type="button"
                        className="qr-result-close"
                        onClick={closeQrResult}
                        aria-label="Close QR result"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}


            {/* ==================================
                QR SCANNER
            ================================== */}

            {showQrScanner && (
                <QrScanner
                    onClose={() => setShowQrScanner(false)}
                    onScan={handleQrScan}
                />
            )}


            {/* ==================================
                ADD INVENTORY
            ================================== */}

            {canManageBar && showAddInventory && (

                <AddInventory
                    existingMenuItemIds={
                        existingMenuItemIds
                    }
                    initialQrCode={
                        unregisteredQrCode
                    }
                    onClose={() => {
                        setShowAddInventory(false);
                        setUnregisteredQrCode("");
                    }}
                    onSuccess={
                        handleInventoryCreated
                    }
                />

            )}


            {/* ==================================
                INVENTORY HISTORY
            ================================== */}

            {historyItem && (

                <InventoryHistory
                    inventory={historyItem}
                    onClose={() =>
                        setHistoryItem(null)
                    }
                />

            )}

        </div>

    );

}
export default Inventory;