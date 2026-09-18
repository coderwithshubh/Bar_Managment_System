import { useState } from "react";
import { X, SlidersHorizontal, AlertTriangle } from "lucide-react";

import barInventoryService from "../../../services/barInventoryService";
import "./UpdateMinimumStock.css";

const UpdateMinimumStock = ({ inventory, onClose, onSuccess }) => {
    const [minimumQuantity, setMinimumQuantity] = useState(
        inventory?.minimumQuantity ?? ""
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        const quantity = Number(minimumQuantity);

        if (
            minimumQuantity === "" ||
            !Number.isFinite(quantity) ||
            quantity < 0
        ) {
            setError("Minimum quantity must be 0 or greater.");
            return;
        }

        try {
            setLoading(true);

            await barInventoryService.updateMinimumQuantity(
                inventory.id,
                quantity
            );

            if (onSuccess) {
                await onSuccess();
            }

            onClose?.();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to update minimum quantity."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) onClose?.();
    };

    return (
        <div
            className="update-minimum-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) handleClose();
            }}
        >
            <div className="update-minimum-modal">
                <div className="update-minimum-header">
                    <div className="update-minimum-title">
                        <div className="update-minimum-icon">
                            <SlidersHorizontal size={20} />
                        </div>
                        <div>
                            <h2>Update Minimum Stock</h2>
                            <p>Set the minimum stock level for this item.</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="update-minimum-close"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="update-minimum-item">
                    <div>
                        <span>Menu Item</span>
                        <strong>{inventory?.itemName}</strong>
                    </div>
                    <div>
                        <span>Current Stock</span>
                        <strong>
                            {Number(inventory?.currentQuantity || 0).toLocaleString()} {inventory?.unit}
                        </strong>
                    </div>
                </div>

                <form className="update-minimum-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="update-minimum-error">
                            <AlertTriangle size={17} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="update-minimum-group">
                        <label>
                            Minimum Quantity <span>*</span>
                        </label>
                        <div className="update-minimum-input">
                            <input
                                type="number"
                                min="0"
                                step="0.001"
                                value={minimumQuantity}
                                onChange={(event) => {
                                    setMinimumQuantity(event.target.value);
                                    setError("");
                                }}
                                placeholder="e.g. 1000"
                                disabled={loading}
                                required
                            />
                            <span>{inventory?.unit}</span>
                        </div>
                        <small>
                            Low stock is calculated by the backend when current quantity is less than or equal to this value.
                        </small>
                    </div>

                    <div className="update-minimum-comparison">
                        <div>
                            <span>Current Minimum</span>
                            <strong>
                                {Number(inventory?.minimumQuantity || 0).toLocaleString()} {inventory?.unit}
                            </strong>
                        </div>
                        <div className="comparison-arrow">→</div>
                        <div>
                            <span>New Minimum</span>
                            <strong>
                                {minimumQuantity === ""
                                    ? "-"
                                    : `${Number(minimumQuantity).toLocaleString()} ${inventory?.unit}`}
                            </strong>
                        </div>
                    </div>

                    <div className="update-minimum-actions">
                        <button
                            type="button"
                            className="update-minimum-cancel"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="update-minimum-submit"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update Minimum Stock"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateMinimumStock;
