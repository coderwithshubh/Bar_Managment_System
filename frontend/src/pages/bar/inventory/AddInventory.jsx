import { useEffect, useMemo, useState } from "react";

import {
    X,
    Package,
    AlertTriangle,
    Plus
} from "lucide-react";

import barMenuItemService from "../../../services/barMenuItemService";
import barInventoryService from "../../../services/barInventoryService";

import "./AddInventory.css";


const AddInventory = ({
    onClose,
    onSuccess,
    existingMenuItemIds = [],
    initialQrCode = ""
}) => {

    // ==========================================
    // STATE
    // ==========================================

    const [menuItems, setMenuItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [formData, setFormData] =
        useState({
            menuItemId: "",
            qrCode: initialQrCode,
            openingQuantity: "",
            unit: "ML",
            minimumQuantity: ""
        });


    // ==========================================
    // LOAD ACTIVE MENU ITEMS
    // ==========================================

    useEffect(() => {

        let cancelled = false;

        const loadMenuItems = async () => {

            try {

                const response =
                    await barMenuItemService
                        .getActiveItems();

                if (cancelled) {
                    return;
                }

                const items =
                    Array.isArray(response.data)
                        ? response.data
                        : [];

                setMenuItems(items);

                setError("");

            } catch (err) {

                if (cancelled) {
                    return;
                }

                console.error(
                    "Failed to load menu items:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    "Failed to load menu items."
                );

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        };

        loadMenuItems();

        return () => {
            cancelled = true;
        };

    }, []);


    // ==========================================
    // AVAILABLE MENU ITEMS
    // ==========================================

    const availableMenuItems = useMemo(() => {

        const existingIds =
            new Set(
                existingMenuItemIds.map(
                    id => Number(id)
                )
            );

        return menuItems.filter(
            item =>
                !existingIds.has(
                    Number(item.id)
                )
        );

    }, [
        menuItems,
        existingMenuItemIds
    ]);


    // ==========================================
    // FORM CHANGE
    // ==========================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!formData.menuItemId) {

            setError(
                "Please select a menu item."
            );

            return;
        }


        const openingQuantity =
            Number(
                formData.openingQuantity
            );

        const minimumQuantity =
            Number(
                formData.minimumQuantity
            );


        if (
            Number.isNaN(openingQuantity) ||
            openingQuantity < 0
        ) {

            setError(
                "Opening quantity cannot be negative."
            );

            return;
        }


        if (
            formData.minimumQuantity === "" ||
            minimumQuantity < 0
        ) {

            setError(
                "Please enter a valid minimum quantity."
            );

            return;
        }


        // ==========================================
        // DUPLICATE FRONTEND CHECK
        // ==========================================

        const alreadyExists =
            existingMenuItemIds.some(
                id =>
                    Number(id) ===
                    Number(formData.menuItemId)
            );

        if (alreadyExists) {

            setError(
                "Inventory already exists for this menu item."
            );

            return;
        }


        try {

            setSaving(true);


            // ==========================================
            // PAYLOAD
            // ==========================================

            const payload = {

                menuItemId:
                    Number(
                        formData.menuItemId
                    ),

                qrCode:
                    formData.qrCode.trim() || null,

                openingQuantity,

                unit:
                    formData.unit,

                minimumQuantity

            };


            // ==========================================
            // CREATE INVENTORY
            // ==========================================

            await barInventoryService
                .createInventory(
                    payload
                );


            // ==========================================
            // SUCCESS
            // ==========================================

            if (onSuccess) {
                await onSuccess();
            }

        } catch (err) {

            console.error(
                "Failed to create inventory:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to create inventory."
            );

        } finally {

            setSaving(false);

        }

    };


    // ==========================================
    // RENDER
    // ==========================================

    return (

        <div
            className="inventory-modal-overlay"
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget &&
                    !saving
                ) {

                    onClose();

                }

            }}
        >

            <div className="inventory-modal add-inventory-modal">


                {/* ==================================
                    HEADER
                ================================== */}

                <div className="modal-header">

                    <div>

                        <div className="modal-title">

                            <Package size={22} />

                            <h2>
                                Add Inventory
                            </h2>

                        </div>

                        <p>
                            Create inventory for a
                            new bar menu item.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                    >

                        <X size={20} />

                    </button>

                </div>


                {/* ==================================
                    FORM
                ================================== */}

                <form
                    onSubmit={handleSubmit}
                >


                    {/* ERROR */}

                    {error && (

                        <div className="modal-error">

                            <AlertTriangle
                                size={17}
                            />

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* ==================================
                        MENU ITEM
                    ================================== */}

                    <div className="form-group">

                        <label>

                            Menu Item

                            <span>*</span>

                        </label>


                        {loading ? (

                            <div className="form-loading">
                                Loading menu items...
                            </div>

                        ) : availableMenuItems.length === 0 ? (

                            <div className="no-items-message">

                                <Package size={18} />

                                <span>
                                    All active menu items
                                    already have inventory.
                                </span>

                            </div>

                        ) : (

                            <select
                                name="menuItemId"
                                value={
                                    formData.menuItemId
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={saving}
                                required
                            >

                                <option value="">
                                    Select Menu Item
                                </option>

                                {availableMenuItems.map(
                                    item => (

                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >

                                            {
                                                item.itemName
                                            }

                                            {" ("}

                                            {
                                                item.itemCode
                                            }

                                            {")"}

                                        </option>

                                    )
                                )}

                            </select>

                        )}

                    </div>


                    {/* ==================================
                        QR CODE
                    ================================== */}

                    <div className="form-group">

                        <label>
                            QR Code
                            <span className="optional-label">(Optional)</span>
                        </label>

                        <input
                            type="text"
                            name="qrCode"
                            placeholder="Scan or enter QR code value"
                            value={formData.qrCode}
                            onChange={handleChange}
                            disabled={saving}
                            maxLength={255}
                        />

                        <small>
                            Assign the bottle/product QR value to this inventory item.
                        </small>

                    </div>


                    {/* ==================================
                        OPENING QUANTITY
                    ================================== */}

                    <div className="form-group">

                        <label>

                            Opening Quantity

                            <span>*</span>

                        </label>

                        <div className="quantity-input">

                            <input
                                type="number"
                                name="openingQuantity"
                                min="0"
                                step="0.001"
                                placeholder="Enter opening quantity"
                                value={
                                    formData
                                        .openingQuantity
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={saving}
                                required
                            />

                            <span>
                                {formData.unit}
                            </span>

                        </div>

                    </div>


                    {/* ==================================
                        UNIT
                    ================================== */}

                    <div className="form-group">

                        <label>

                            Unit

                            <span>*</span>

                        </label>

                        <select
                            name="unit"
                            value={
                                formData.unit
                            }
                            onChange={
                                handleChange
                            }
                            disabled={saving}
                        >

                            <option value="ML">
                                ML
                            </option>

                            <option value="LITER">
                                LITER
                            </option>

                            <option value="BOTTLE">
                                BOTTLE
                            </option>

                            <option value="CAN">
                                CAN
                            </option>

                            <option value="KG">
                                KG
                            </option>

                            <option value="GRAM">
                                GRAM
                            </option>

                            <option value="PIECE">
                                PIECE
                            </option>

                        </select>

                    </div>


                    {/* ==================================
                        MINIMUM QUANTITY
                    ================================== */}

                    <div className="form-group">

                        <label>

                            Minimum Quantity

                            <span>*</span>

                        </label>

                        <div className="quantity-input">

                            <input
                                type="number"
                                name="minimumQuantity"
                                min="0"
                                step="0.001"
                                placeholder="Enter minimum quantity"
                                value={
                                    formData
                                        .minimumQuantity
                                }
                                onChange={
                                    handleChange
                                }
                                disabled={saving}
                                required
                            />

                            <span>
                                {formData.unit}
                            </span>

                        </div>

                    </div>


                    {/* ==================================
                        ACTIONS
                    ================================== */}

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={
                                saving ||
                                loading ||
                                availableMenuItems.length === 0
                            }
                        >

                            <Plus size={17} />

                            {saving
                                ? "Creating..."
                                : "Create Inventory"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};


export default AddInventory;