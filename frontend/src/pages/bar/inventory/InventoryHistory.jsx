import { useEffect, useState } from "react";

import {
    X,
    History,
    ArrowDownToLine,
    ArrowUpFromLine,
    SlidersHorizontal,
    Package,
    AlertTriangle,
    RefreshCw
} from "lucide-react";

import barInventoryService from "../../../services/barInventoryService";

import "./InventoryHistory.css";


/* =========================================================
   INVENTORY HISTORY
========================================================= */

const InventoryHistory = ({
    inventory,
    onClose
}) => {

    /* =====================================================
       STATES
    ===================================================== */

    const [transactions, setTransactions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [reloadKey, setReloadKey] = useState(0);


    /* =====================================================
       LOAD TRANSACTION HISTORY
    ===================================================== */

    useEffect(() => {

        let cancelled = false;

        const loadHistory = async () => {

            if (!inventory?.id) {
                if (!cancelled) {
                    setLoading(false);
                    setTransactions([]);
                }

                return;
            }

            try {

                const response =
                    await barInventoryService
                        .getTransactionsByInventory(
                            inventory.id
                        );


                if (cancelled) {
                    return;
                }


                const data =
                    Array.isArray(response.data)
                        ? response.data
                        : [];


                setTransactions(data);

                setError("");


            } catch (err) {

                if (cancelled) {
                    return;
                }


                console.error(
                    "Failed to load inventory history:",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    "Unable to load transaction history."
                );


                setTransactions([]);


            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }
        };


        loadHistory();


        return () => {
            cancelled = true;
        };

    }, [inventory?.id, reloadKey]);


    /* =====================================================
       RETRY
    ===================================================== */

    const handleRetry = () => {

        setError("");

        setLoading(true);

        setReloadKey(
            previous => previous + 1
        );
    };


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    const handleClose = () => {

        if (onClose) {
            onClose();
        }
    };


    /* =====================================================
       FORMAT DATE TIME
    ===================================================== */

    const formatDateTime = (dateTime) => {

        if (!dateTime) {
            return "-";
        }


        const date =
            new Date(dateTime);


        if (Number.isNaN(date.getTime())) {
            return dateTime;
        }


        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    /* =====================================================
       FORMAT QUANTITY
    ===================================================== */

    const formatQuantity = (quantity) => {

        const number =
            Number(quantity);


        if (Number.isNaN(number)) {
            return "0.000";
        }


        return number.toFixed(3);
    };


    /* =====================================================
       TRANSACTION LABEL
    ===================================================== */

    const getTransactionLabel = (
        transactionType
    ) => {

        switch (transactionType) {

            case "OPENING_STOCK":
                return "Opening Stock";


            case "STOCK_IN":
                return "Stock In";


            case "STOCK_OUT":
                return "Stock Out";


            case "ADJUSTMENT":
                return "Adjustment";


            default:
                return (
                    transactionType ||
                    "Transaction"
                );
        }
    };


    /* =====================================================
       TRANSACTION ICON
    ===================================================== */

    const getTransactionIcon = (
        transactionType
    ) => {

        switch (transactionType) {

            case "OPENING_STOCK":

                return (
                    <Package size={18} />
                );


            case "STOCK_IN":

                return (
                    <ArrowDownToLine
                        size={18}
                    />
                );


            case "STOCK_OUT":

                return (
                    <ArrowUpFromLine
                        size={18}
                    />
                );


            case "ADJUSTMENT":

                return (
                    <SlidersHorizontal
                        size={18}
                    />
                );


            default:

                return (
                    <History size={18} />
                );
        }
    };


    /* =====================================================
       TRANSACTION CSS CLASS
    ===================================================== */

    const getTransactionClass = (
        transactionType
    ) => {

        switch (transactionType) {

            case "OPENING_STOCK":
                return "opening";


            case "STOCK_IN":
                return "stock-in";


            case "STOCK_OUT":
                return "stock-out";


            case "ADJUSTMENT":
                return "adjustment";


            default:
                return "default";
        }
    };


    /* =====================================================
       QUANTITY SIGN
       
       Backend response does not contain increaseStock.
       
       Therefore:
       STOCK_OUT  = -
       ADJUSTMENT = ±
       Others     = +
    ===================================================== */

    const getQuantitySign = (
        transactionType
    ) => {

        switch (transactionType) {

            case "STOCK_OUT":
                return "-";


            case "ADJUSTMENT":
                return "±";


            default:
                return "+";
        }
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div
            className="inventory-history-overlay"
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    handleClose();
                }

            }}
        >

            {/* =================================================
                MODAL
            ================================================= */}

            <div
                className="inventory-history-modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="inventory-history-header">

                    <div className="inventory-history-title">

                        <div className="history-title-icon">

                            <History size={21} />

                        </div>


                        <div>

                            <h2>
                                Stock History
                            </h2>

                            <p>
                                {inventory?.itemName || "Inventory Item"}

                                {" • "}

                                {inventory?.itemCode || "-"}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="history-close-btn"
                        onClick={handleClose}
                        aria-label="Close"
                    >

                        <X size={20} />

                    </button>

                </div>


                {/* =================================================
                    CURRENT STOCK SUMMARY
                ================================================= */}

                <div className="history-current-stock">

                    {/* CURRENT STOCK */}

                    <div>

                        <span>
                            Current Stock
                        </span>

                        <strong>

                            {formatQuantity(
                                inventory?.currentQuantity
                            )}

                            {" "}

                            {inventory?.unit || ""}

                        </strong>

                    </div>


                    {/* MINIMUM STOCK */}

                    <div>

                        <span>
                            Minimum Stock
                        </span>

                        <strong>

                            {formatQuantity(
                                inventory?.minimumQuantity
                            )}

                            {" "}

                            {inventory?.unit || ""}

                        </strong>

                    </div>


                    {/* TOTAL TRANSACTIONS */}

                    <div>

                        <span>
                            Total Transactions
                        </span>

                        <strong>
                            {transactions.length}
                        </strong>

                    </div>

                </div>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <div className="inventory-history-content">

                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (

                        <div className="history-state">

                            <RefreshCw
                                size={24}
                                className="history-spinner"
                            />

                            <h3>
                                Loading History
                            </h3>

                            <p>
                                Please wait while transaction
                                history is being loaded.
                            </p>

                        </div>

                    )}


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {!loading && error && (

                        <div className="history-state error">

                            <AlertTriangle
                                size={25}
                            />

                            <h3>
                                Unable to Load History
                            </h3>

                            <p>
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={handleRetry}
                            >
                                Retry
                            </button>

                        </div>

                    )}


                    {/* =================================================
                        EMPTY
                    ================================================= */}

                    {!loading &&
                        !error &&
                        transactions.length === 0 && (

                            <div className="history-state">

                                <History
                                    size={40}
                                />

                                <h3>
                                    No Transactions Found
                                </h3>

                                <p>
                                    No stock movements are
                                    available for this inventory item.
                                </p>

                            </div>

                        )}


                    {/* =================================================
                        TRANSACTION TIMELINE
                    ================================================= */}

                    {!loading &&
                        !error &&
                        transactions.length > 0 && (

                            <div className="history-timeline">

                                {transactions.map(
                                    (transaction) => {

                                        const transactionClass =
                                            getTransactionClass(
                                                transaction.transactionType
                                            );


                                        const quantitySign =
                                            getQuantitySign(
                                                transaction.transactionType
                                            );


                                        return (

                                            <div
                                                className="history-item"
                                                key={transaction.id}
                                            >

                                                {/* =================================
                                                    TIMELINE ICON
                                                ================================= */}

                                                <div
                                                    className={
                                                        `history-timeline-icon ${transactionClass}`
                                                    }
                                                >

                                                    {
                                                        getTransactionIcon(
                                                            transaction.transactionType
                                                        )
                                                    }

                                                </div>


                                                {/* =================================
                                                    TRANSACTION CONTENT
                                                ================================= */}

                                                <div className="history-item-content">

                                                    <div className="history-item-top">

                                                        <div>

                                                            <h3>
                                                                {
                                                                    getTransactionLabel(
                                                                        transaction.transactionType
                                                                    )
                                                                }
                                                            </h3>

                                                            <span>
                                                                {
                                                                    formatDateTime(
                                                                        transaction.createdAt
                                                                    )
                                                                }
                                                            </span>

                                                        </div>


                                                        {/* QUANTITY */}

                                                        <strong
                                                            className={
                                                                `history-quantity ${transactionClass}`
                                                            }
                                                        >

                                                            {quantitySign}

                                                            {formatQuantity(
                                                                transaction.quantity
                                                            )}

                                                            {" "}

                                                            {
                                                                transaction.unit ||
                                                                inventory?.unit ||
                                                                ""
                                                            }

                                                        </strong>

                                                    </div>


                                                    {/* =================================
                                                        REASON
                                                    ================================= */}

                                                    {transaction.reason && (

                                                        <div className="history-detail-row">

                                                            <span>
                                                                Reason
                                                            </span>

                                                            <strong>
                                                                {
                                                                    transaction.reason
                                                                }
                                                            </strong>

                                                        </div>

                                                    )}


                                                    {/* =================================
                                                        REFERENCE NUMBER
                                                    ================================= */}

                                                    {transaction.referenceNumber && (

                                                        <div className="history-detail-row">

                                                            <span>
                                                                Reference
                                                            </span>

                                                            <strong>
                                                                {
                                                                    transaction.referenceNumber
                                                                }
                                                            </strong>

                                                        </div>

                                                    )}

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="inventory-history-footer">

                    <button
                        type="button"
                        className="history-footer-btn"
                        onClick={handleClose}
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
    );
};


export default InventoryHistory;