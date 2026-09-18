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
import "./BarTable.css";

// =====================================================
// CONSTANTS
// =====================================================

const ZONES = [
    "COUNTER",
    "LOUNGE",
    "VIP",
    "OUTDOOR"
];

const STATUSES = [
    "AVAILABLE",
    "OCCUPIED",
    "RESERVED",
    "CLEANING"
];

// =====================================================
// BAR TABLE COMPONENT
// =====================================================

function BarTable() {

    // ================= RBAC =================
    const user = getLoggedInUser();
    const userRole = user?.role || "NORMAL_USER";
    const canManageBar = userRole === "ADMIN" || userRole === "BAR_MANAGER";


    // =================================================
    // STATE
    // =================================================

    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [showModal, setShowModal] = useState(false);
    const [editingTable, setEditingTable] = useState(null);

    const [formData, setFormData] = useState({
        tableNumber: "",
        name: "",
        capacity: "",
        zone: ""
    });

    // =================================================
    // LOAD TABLES
    // Used after create / update / delete / status change
    // =================================================

    const loadTables = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await barTableService.getAllTables();

            setTables(
                Array.isArray(response)
                    ? response
                    : response?.data || []
            );

        } catch (err) {

            console.error(
                "Error loading tables:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to load tables."
            );

        } finally {

            setLoading(false);
        }
    };

    // =================================================
    // INITIAL LOAD
    // IMPORTANT:
    // Do not call loadTables() directly from useEffect.
    // This avoids React cascading-render warning.
    // =================================================

    useEffect(() => {

        let cancelled = false;

        const fetchInitialTables = async () => {

            try {

                const response =
                    await barTableService.getAllTables();

                if (!cancelled) {

                    const tableData =
                        Array.isArray(response)
                            ? response
                            : response?.data || [];

                    setTables(tableData);
                    setError("");
                }

            } catch (err) {

                console.error(
                    "Error loading tables:",
                    err
                );

                if (!cancelled) {

                    setError(
                        err.response?.data?.message ||
                        "Failed to load tables."
                    );
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void fetchInitialTables();

        return () => {
            cancelled = true;
        };

    }, []);

    // =================================================
    // FILTER TABLES
    // =================================================

    const filteredTables = useMemo(() => {

        return tables.filter((table) => {

            const searchText =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                String(table.tableNumber || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(table.name || "")
                    .toLowerCase()
                    .includes(searchText) ||
                String(table.zone || "")
                    .toLowerCase()
                    .includes(searchText);

            const matchesStatus =
                statusFilter === "ALL" ||
                table.status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });

    }, [tables, search, statusFilter]);

    // =================================================
    // OPEN ADD MODAL
    // =================================================

    const openAddModal = () => {
        if (!canManageBar) return;

        setEditingTable(null);

        setFormData({
            tableNumber: "",
            name: "",
            capacity: "",
            zone: ""
        });

        setError("");
        setShowModal(true);
    };

    // =================================================
    // OPEN EDIT MODAL
    // =================================================

    const openEditModal = (table) => {
        if (!canManageBar) return;

        setEditingTable(table);

        setFormData({
            tableNumber: table.tableNumber || "",
            name: table.name || "",
            capacity: table.capacity || "",
            zone: table.zone || ""
        });

        setError("");
        setShowModal(true);
    };

    // =================================================
    // CLOSE MODAL
    // =================================================

    const closeModal = () => {

        setShowModal(false);
        setEditingTable(null);

        setFormData({
            tableNumber: "",
            name: "",
            capacity: "",
            zone: ""
        });
    };

    // =================================================
    // HANDLE INPUT
    // =================================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // =================================================
    // SAVE TABLE
    // =================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!canManageBar) return;

        try {

            setError("");

            // -----------------------------------------
            // VALIDATION
            // -----------------------------------------

            if (!formData.tableNumber.trim()) {

                setError(
                    "Table number is required."
                );

                return;
            }

            if (!formData.name.trim()) {

                setError(
                    "Table name is required."
                );

                return;
            }

            if (!formData.capacity) {

                setError(
                    "Capacity is required."
                );

                return;
            }

            if (Number(formData.capacity) <= 0) {

                setError(
                    "Capacity must be greater than 0."
                );

                return;
            }

            if (!formData.zone) {

                setError(
                    "Zone is required."
                );

                return;
            }

            // -----------------------------------------
            // REQUEST PAYLOAD
            // -----------------------------------------

            const payload = {

                tableNumber:
                    formData.tableNumber.trim(),

                name:
                    formData.name.trim(),

                capacity:
                    Number(formData.capacity),

                zone:
                    formData.zone
            };

            // -----------------------------------------
            // UPDATE
            // -----------------------------------------

            if (editingTable) {

                await barTableService.updateTable(
                    editingTable.id,
                    payload
                );

            }

            // -----------------------------------------
            // CREATE
            // -----------------------------------------

            else {

                await barTableService.createTable(
                    payload
                );
            }

            // -----------------------------------------
            // CLOSE + REFRESH
            // -----------------------------------------

            closeModal();

            await loadTables();

        } catch (err) {

            console.error(
                "Error saving table:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to save table."
            );
        }
    };

    // =================================================
    // UPDATE STATUS
    // =================================================

    const handleStatusChange = async (
        table,
        status
    ) => {

        try {

            setError("");

            await barTableService.updateTableStatus(
                table.id,
                status
            );

            await loadTables();

        } catch (err) {

            console.error(
                "Error updating table status:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update table status."
            );
        }
    };

    // =================================================
    // ACTIVATE / DEACTIVATE
    // =================================================

    const handleToggleActive = async (table) => {

        if (!canManageBar) return;

        try {

            setError("");

            if (table.active) {

                await barTableService.deactivateTable(
                    table.id
                );

            } else {

                await barTableService.activateTable(
                    table.id
                );
            }

            await loadTables();

        } catch (err) {

            console.error(
                "Error updating table:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to update table."
            );
        }
    };

    // =================================================
    // DELETE TABLE
    // =================================================

    const handleDelete = async (table) => {

        if (!canManageBar) return;

        const confirmed =
            window.confirm(
                `Are you sure you want to delete Table ${table.tableNumber}?`
            );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            await barTableService.deleteTable(
                table.id
            );

            await loadTables();

        } catch (err) {

            console.error(
                "Error deleting table:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete table."
            );
        }
    };

    // =================================================
    // RENDER
    // =================================================

    return (

        <div className="bar-table-page">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="bar-table-header">

                <div>

                    <span className="page-label">
                        BAR MANAGEMENT
                    </span>

                    <h1>
                        Bar Tables
                    </h1>

                    <p>
                        Manage bar tables, capacity,
                        zones and table status.
                    </p>

                </div>

                <button
                        type="button"
                        className="add-table-btn"
                        onClick={openAddModal}
                    >
                        + Add Table
                    </button>

            </div>

            {/* =========================================
                ERROR
            ========================================= */}

            {error && (

                <div className="table-error">
                    <span>⚠</span>
                    {error}
                </div>

            )}

            {/* =========================================
                FILTERS
            ========================================= */}

            <div className="table-filters">

                <div className="search-wrapper">

                    <span className="search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search table, name or zone..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </div>

                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value)
                    }
                >

                    <option value="ALL">
                        All Status
                    </option>

                    {STATUSES.map((status) => (

                        <option
                            key={status}
                            value={status}
                        >
                            {status}
                        </option>

                    ))}

                </select>

            </div>

            {/* =========================================
                LOADING
            ========================================= */}

            {loading ? (

                <div className="table-message">
                    <div className="loading-spinner"></div>
                    <span>Loading tables...</span>
                </div>

            ) : filteredTables.length === 0 ? (

                <div className="table-message empty-state">

                    <div className="empty-icon">
                        ▦
                    </div>

                    <h3>
                        No tables found
                    </h3>

                    <p>
                        Try changing your search or
                        status filter.
                    </p>

                </div>

            ) : (

                /* =====================================
                   TABLE CARDS
                ===================================== */

                <div className="bar-table-grid">

                    {filteredTables.map((table) => (

                        <div
                            className={`bar-table-card ${
                                table.active
                                    ? ""
                                    : "inactive"
                            }`}
                            key={table.id}
                        >

                            {/* CARD HEADER */}

                            <div className="table-card-header">

                                <div>

                                    <span className="table-number-label">
                                        TABLE
                                    </span>

                                    <h3>
                                        {table.tableNumber}
                                    </h3>

                                    <p>
                                        {table.name}
                                    </p>

                                </div>

                                <span
                                    className={`status-badge status-${(
                                        table.status || ""
                                    ).toLowerCase()}`}
                                >
                                    {table.status}
                                </span>

                            </div>

                            {/* DETAILS */}

                            <div className="table-card-details">

                                <div className="detail-item">

                                    <span>
                                        Capacity
                                    </span>

                                    <strong>
                                        {table.capacity}
                                    </strong>

                                </div>

                                <div className="detail-item">

                                    <span>
                                        Zone
                                    </span>

                                    <strong>
                                        {table.zone}
                                    </strong>

                                </div>

                                <div className="detail-item">

                                    <span>
                                        Active
                                    </span>

                                    <strong>
                                        {table.active
                                            ? "Yes"
                                            : "No"}
                                    </strong>

                                </div>

                            </div>

                            {/* STATUS */}

                            <div className="table-status-control">

                                <label>
                                    Table Status
                                </label>

                                <select
                                    value={
                                        table.status || ""
                                    }
                                    disabled={!canManageBar || !table.active}
                                    onChange={(event) =>
                                        handleStatusChange(
                                            table,
                                            event.target.value
                                        )
                                    }
                                >

                                    {STATUSES.map(
                                        (status) => (

                                            <option
                                                key={status}
                                                value={status}
                                            >
                                                {status}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* ACTIONS */}

                            <div className="table-card-actions">

                                <button
                                    type="button"
                                    className="edit-btn"
                                    onClick={() =>
                                        openEditModal(table)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    className="toggle-btn"
                                    onClick={() =>
                                        handleToggleActive(
                                            table
                                        )
                                    }
                                >
                                    {table.active
                                        ? "Deactivate"
                                        : "Activate"}
                                </button>

                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() =>
                                        handleDelete(table)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

            {/* =========================================
                ADD / EDIT MODAL
            ========================================= */}

            {canManageBar && showModal && (

                <div className="table-modal-overlay">

                    <div className="table-modal">

                        <div className="table-modal-header">

                            <div>

                                <span className="modal-label">
                                    TABLE MANAGEMENT
                                </span>

                                <h2>
                                    {editingTable
                                        ? "Edit Table"
                                        : "Add Table"}
                                </h2>

                            </div>

                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={closeModal}
                                aria-label="Close"
                            >
                                ×
                            </button>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                        >

                            {/* TABLE NUMBER */}

                            <div className="form-group">

                                <label>
                                    Table Number
                                </label>

                                <input
                                    type="text"
                                    name="tableNumber"
                                    value={
                                        formData.tableNumber
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: T01"
                                />

                            </div>

                            {/* TABLE NAME */}

                            <div className="form-group">

                                <label>
                                    Table Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: Corner Table"
                                />

                            </div>

                            {/* CAPACITY */}

                            <div className="form-group">

                                <label>
                                    Capacity
                                </label>

                                <input
                                    type="number"
                                    name="capacity"
                                    min="1"
                                    value={
                                        formData.capacity
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Example: 4"
                                />

                            </div>

                            {/* ZONE */}

                            <div className="form-group">

                                <label>
                                    Zone
                                </label>

                                <select
                                    name="zone"
                                    value={
                                        formData.zone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="">
                                        Select Zone
                                    </option>

                                    {ZONES.map(
                                        (zone) => (

                                            <option
                                                key={zone}
                                                value={zone}
                                            >
                                                {zone}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                            {/* ACTIONS */}

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-btn"
                                >
                                    {editingTable
                                        ? "Update Table"
                                        : "Create Table"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default BarTable;