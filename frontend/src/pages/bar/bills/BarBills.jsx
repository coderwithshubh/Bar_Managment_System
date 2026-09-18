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

import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import { useNavigate } from "react-router-dom";

import {
    FaFileInvoiceDollar,
    FaCheckCircle,
    FaClock,
    FaRupeeSign,
    FaEye,
    FaMoneyBillWave,
    FaSearch,
    FaSyncAlt,
    FaTimes,
    FaPrint
} from "react-icons/fa";

import barBillService
    from "../../../services/barBillService";

import "./BarBills.css";


/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (value) => {
    const amount = Number(value ?? 0);

    return `₹${amount.toFixed(2)}`;
};


const formatDateTime = (value) => {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
    });
};


/* =========================================================
   COMPONENT
========================================================= */

function BarBills() {

    // ================= RBAC =================
    const user = getLoggedInUser();
    const userRole = user?.role || "NORMAL_USER";
    const canManageBar = userRole === "ADMIN" || userRole === "BAR_MANAGER";


    const navigate = useNavigate();


    /* =====================================================
       STATE
    ===================================================== */

    const [bills, setBills] = useState([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [selectedBill, setSelectedBill] =
        useState(null);

    const [paymentBill, setPaymentBill] =
        useState(null);

    const [paymentMethod, setPaymentMethod] =
        useState("CASH");

    const [paymentRemarks, setPaymentRemarks] =
        useState("");

    const [processing, setProcessing] =
        useState(false);


    /* =====================================================
       LOAD BILLS
    ===================================================== */

    const loadBills = useCallback(async () => {

        setLoading(true);
        setError("");

        try {

            const data =
                await barBillService.getAllBills();

            setBills(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(
                "Load Bills Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to load bills."
            );

        } finally {

            setLoading(false);

        }

    }, []);


    /* =====================================================
       INITIAL LOAD

       Important:
       Do not call loadBills() directly inside the effect
       because loadBills() performs immediate state updates.
    ===================================================== */

    useEffect(() => {

        let cancelled = false;

        const fetchInitialBills = async () => {

            try {

                const data =
                    await barBillService.getAllBills();

                if (!cancelled) {

                    setBills(
                        Array.isArray(data)
                            ? data
                            : []
                    );

                    setError("");
                }

            } catch (err) {

                console.error(
                    "Initial Bills Error:",
                    err
                );

                if (!cancelled) {

                    setError(
                        err.response?.data?.message ||
                        err.response?.data?.error ||
                        "Unable to load bills."
                    );
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void fetchInitialBills();

        return () => {
            cancelled = true;
        };

    }, []);


    /* =====================================================
       FILTERED BILLS
    ===================================================== */

    const filteredBills = useMemo(() => {

        const keyword =
            search
                .trim()
                .toLowerCase();

        return bills.filter((bill) => {

            const billNumber =
                String(
                    bill.billNumber ?? ""
                ).toLowerCase();

            const orderNumber =
                String(
                    bill.orderNumber ?? ""
                ).toLowerCase();

            const orderId =
                String(
                    bill.orderId ?? ""
                ).toLowerCase();

            const matchesSearch =
                !keyword ||
                billNumber.includes(keyword) ||
                orderNumber.includes(keyword) ||
                orderId.includes(keyword);

            const matchesStatus =
                statusFilter === "ALL" ||
                bill.paymentStatus ===
                    statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });

    }, [
        bills,
        search,
        statusFilter
    ]);


    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {

        const total =
            bills.length;

        const paid =
            bills.filter(
                (bill) =>
                    bill.paymentStatus ===
                    "PAID"
            ).length;

        const unpaid =
            bills.filter(
                (bill) =>
                    bill.paymentStatus ===
                    "UNPAID"
            ).length;

        const voidBills =
            bills.filter(
                (bill) =>
                    bill.paymentStatus ===
                    "VOID"
            ).length;

        const totalAmount =
            bills
                .filter(
                    (bill) =>
                        bill.paymentStatus !==
                        "VOID"
                )
                .reduce(
                    (sum, bill) =>
                        sum +
                        Number(
                            bill.grandTotal ?? 0
                        ),
                    0
                );

        const paidAmount =
            bills
                .filter(
                    (bill) =>
                        bill.paymentStatus ===
                        "PAID"
                )
                .reduce(
                    (sum, bill) =>
                        sum +
                        Number(
                            bill.grandTotal ?? 0
                        ),
                    0
                );

        return {
            total,
            paid,
            unpaid,
            voidBills,
            totalAmount,
            paidAmount
        };

    }, [bills]);


    /* =====================================================
       OPEN PAYMENT MODAL
    ===================================================== */

    const openPaymentModal = (bill) => {
        if (!canManageBar) return;

        setPaymentBill(bill);

        setPaymentMethod("CASH");

        setPaymentRemarks("");

        setError("");
    };


    /* =====================================================
       CLOSE PAYMENT MODAL
    ===================================================== */

    const closePaymentModal = () => {

        if (processing) {
            return;
        }

        setPaymentBill(null);

        setPaymentMethod("CASH");

        setPaymentRemarks("");
    };


    /* =====================================================
       HANDLE PAYMENT
    ===================================================== */

    const handlePayment = async () => {

        if (!canManageBar || !paymentBill) {
            return;
        }

        if (!paymentMethod) {

            setError(
                "Please select a payment method."
            );

            return;
        }

        setProcessing(true);
        setError("");

        try {

            await barBillService.updatePayment(
                paymentBill.id,
                {
                    paymentMethod,
                    remarks:
                        paymentRemarks.trim() ||
                        null
                }
            );

            setPaymentBill(null);

            setPaymentMethod("CASH");

            setPaymentRemarks("");

            await loadBills();

        } catch (err) {

            console.error(
                "Payment Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to update payment."
            );

        } finally {

            setProcessing(false);
        }
    };


    /* =====================================================
       OPEN PRINT PAGE
    ===================================================== */

    const openPrintPage = (bill) => {

        if (!bill?.id) {
            return;
        }

        navigate(
            `/bar/bills/print/${bill.id}`
        );
    };


    /* =====================================================
       CLOSE VIEW MODAL
    ===================================================== */

    const closeBillDetails = () => {
        setSelectedBill(null);
    };


    /* =====================================================
       JSX
    ===================================================== */

    return (

        <div className="bar-bills-page">


            {/* =================================================
                PAGE HERO
            ================================================= */}

            <section className="bills-hero">

                <div className="hero-content">

                    <div className="hero-icon">
                        <FaFileInvoiceDollar />
                    </div>

                    <div>

                        <span className="page-kicker">
                            BAR MANAGEMENT
                        </span>

                        <h1>
                            Bills & Payments
                        </h1>

                        <p>
                            Manage invoices, payments
                            and billing activity
                            from one place.
                        </p>

                    </div>

                </div>


                <div className="hero-summary">

                    <span>
                        Current Collection
                    </span>

                    <strong>
                        {formatCurrency(
                            statistics.paidAmount
                        )}
                    </strong>

                    <small>
                        From {statistics.paid} paid bills
                    </small>

                </div>

            </section>


            {/* =================================================
                STAT CARDS
            ================================================= */}

            <section className="bill-stats-grid">


                <div className="bill-stat-card total-card">

                    <div className="stat-card-top">

                        <div className="stat-icon">
                            <FaFileInvoiceDollar />
                        </div>

                        <span className="stat-label">
                            TOTAL BILLS
                        </span>

                    </div>

                    <strong>
                        {statistics.total}
                    </strong>

                    <span className="stat-description">
                        All generated bills
                    </span>

                </div>


                <div className="bill-stat-card paid-card">

                    <div className="stat-card-top">

                        <div className="stat-icon">
                            <FaCheckCircle />
                        </div>

                        <span className="stat-label">
                            PAID
                        </span>

                    </div>

                    <strong>
                        {statistics.paid}
                    </strong>

                    <span className="stat-description">
                        Successfully collected
                    </span>

                </div>


                <div className="bill-stat-card unpaid-card">

                    <div className="stat-card-top">

                        <div className="stat-icon">
                            <FaClock />
                        </div>

                        <span className="stat-label">
                            UNPAID
                        </span>

                    </div>

                    <strong>
                        {statistics.unpaid}
                    </strong>

                    <span className="stat-description">
                        Awaiting payment
                    </span>

                </div>


                <div className="bill-stat-card revenue-card">

                    <div className="stat-card-top">

                        <div className="stat-icon">
                            <FaRupeeSign />
                        </div>

                        <span className="stat-label">
                            COLLECTION
                        </span>

                    </div>

                    <strong>
                        {formatCurrency(
                            statistics.paidAmount
                        )}
                    </strong>

                    <span className="stat-description">
                        Paid bill amount
                    </span>

                </div>

            </section>


            {/* =================================================
                CONTROL BAR
            ================================================= */}

            <section className="billing-control-card">

                <div className="control-heading">

                    <div>

                        <span className="control-kicker">
                            BILLING ACTIVITY
                        </span>

                        <h2>
                            Recent Bills
                        </h2>

                    </div>

                    <span className="result-count">
                        {filteredBills.length} records
                    </span>

                </div>


                <div className="billing-controls">


                    <div className="bill-search">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search bill number or order..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <div className="bill-status-filter">

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

                            <option value="UNPAID">
                                Unpaid
                            </option>

                            <option value="PAID">
                                Paid
                            </option>

                            <option value="VOID">
                                Void
                            </option>

                        </select>

                    </div>


                    <button
                        type="button"
                        className="refresh-button"
                        onClick={loadBills}
                        disabled={loading}
                        title="Refresh bills"
                    >

                        <FaSyncAlt
                            className={
                                loading
                                    ? "refresh-spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>

                </div>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="bar-bills-error">

                    {error}

                </div>

            )}


            {/* =================================================
                BILL TABLE
            ================================================= */}

            <section className="bills-table-card">

                <div className="table-wrapper">

                    <table className="bar-bills-table">

                        <thead>

                            <tr>

                                <th>Bill</th>

                                <th>Order</th>

                                <th>Amount</th>

                                <th>Payment</th>

                                <th>Date</th>

                                <th>Action</th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="table-message"
                                    >

                                        <div className="empty-state">

                                            <div className="empty-icon loading-icon">
                                                <FaSyncAlt />
                                            </div>

                                            <h3>
                                                Loading bills
                                            </h3>

                                            <p>
                                                Fetching billing records...
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : filteredBills.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="table-message"
                                    >

                                        <div className="empty-state">

                                            <div className="empty-icon">
                                                <FaFileInvoiceDollar />
                                            </div>

                                            <h3>
                                                No bills found
                                            </h3>

                                            <p>
                                                Generated bills will appear here.
                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredBills.map(
                                    (bill) => (

                                        <tr
                                            key={bill.id}
                                        >

                                            <td>

                                                <div className="bill-number-cell">

                                                    <div className="mini-bill-icon">
                                                        <FaFileInvoiceDollar />
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {bill.billNumber}
                                                        </strong>

                                                        <span>
                                                            Bill #{bill.id}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <div className="order-cell">

                                                    <strong>
                                                        {
                                                            bill.orderNumber ||
                                                            `Order #${bill.orderId}`
                                                        }
                                                    </strong>

                                                    <span>
                                                        Order ID {bill.orderId}
                                                    </span>

                                                </div>

                                            </td>


                                            <td>

                                                <strong className="amount-cell">
                                                    {formatCurrency(
                                                        bill.grandTotal
                                                    )}
                                                </strong>

                                            </td>


                                            <td>

                                                <div className="payment-cell">

                                                    <span
                                                        className={`bill-status-badge ${String(
                                                            bill.paymentStatus ||
                                                            ""
                                                        ).toLowerCase()}`}
                                                    >
                                                        {
                                                            bill.paymentStatus ||
                                                            "-"
                                                        }
                                                    </span>

                                                    {bill.paymentMethod && (

                                                        <small>
                                                            {
                                                                bill.paymentMethod
                                                            }
                                                        </small>

                                                    )}

                                                </div>

                                            </td>


                                            <td>

                                                <div className="date-cell">

                                                    <strong>
                                                        {formatDateTime(
                                                            bill.createdAt
                                                        )}
                                                    </strong>

                                                </div>

                                            </td>


                                            <td>

                                                <div className="bill-actions">


                                                    <button
                                                        type="button"
                                                        className="icon-action view"
                                                        title="View Bill"
                                                        onClick={() =>
                                                            setSelectedBill(
                                                                bill
                                                            )
                                                        }
                                                    >
                                                        <FaEye />
                                                    </button>


                                                    {bill.paymentStatus ===
                                                        "PAID" && (

                                                        <button
                                                            type="button"
                                                            className="icon-action print"
                                                            title="Print Bill"
                                                            onClick={() =>
                                                                openPrintPage(
                                                                    bill
                                                                )
                                                            }
                                                        >
                                                            <FaPrint />
                                                        </button>

                                                    )}


                                                    {bill.paymentStatus ===
                                                        "UNPAID" && (

                                                        <button
                                                            type="button"
                                                            className="pay-action"
                                                            onClick={() =>
                                                                openPaymentModal(
                                                                    bill
                                                                )
                                                            }
                                                        >

                                                            <FaMoneyBillWave />
                                                            Pay

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

            </section>


            {/* =================================================
                BILL DETAILS MODAL
            ================================================= */}

            {selectedBill && (

                <div className="bill-modal-overlay">

                    <div className="bill-modal">

                        <div className="bill-modal-header">

                            <div className="modal-title-area">

                                <div className="modal-icon">
                                    <FaFileInvoiceDollar />
                                </div>

                                <div>

                                    <span>
                                        BILL DETAILS
                                    </span>

                                    <h2>
                                        {
                                            selectedBill.billNumber
                                        }
                                    </h2>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="modal-close"
                                onClick={
                                    closeBillDetails
                                }
                                aria-label="Close"
                            >

                                <FaTimes />

                            </button>

                        </div>


                        <div className="bill-details-grid">

                            <div>

                                <label>
                                    Order
                                </label>

                                <strong>
                                    {
                                        selectedBill.orderNumber ||
                                        `#${selectedBill.orderId}`
                                    }
                                </strong>

                            </div>


                            <div>

                                <label>
                                    Status
                                </label>

                                <strong>
                                    {
                                        selectedBill.paymentStatus ||
                                        "-"
                                    }
                                </strong>

                            </div>


                            <div>

                                <label>
                                    Subtotal
                                </label>

                                <strong>
                                    {formatCurrency(
                                        selectedBill.subtotal
                                    )}
                                </strong>

                            </div>


                            <div>

                                <label>
                                    Discount
                                </label>

                                <strong>
                                    {formatCurrency(
                                        selectedBill.discountAmount
                                    )}
                                </strong>

                            </div>


                            <div>

                                <label>
                                    Tax
                                </label>

                                <strong>
                                    {formatCurrency(
                                        selectedBill.taxAmount
                                    )}
                                </strong>

                            </div>


                            <div className="grand-total-box">

                                <label>
                                    Grand Total
                                </label>

                                <strong>
                                    {formatCurrency(
                                        selectedBill.grandTotal
                                    )}
                                </strong>

                            </div>

                        </div>


                        <div className="bill-modal-footer">

                            <div className="modal-payment-summary">

                                <span>
                                    Payment
                                </span>

                                <strong>
                                    {
                                        selectedBill.paymentMethod ||
                                        "Not Paid"
                                    }
                                </strong>

                            </div>


                            <div className="modal-footer-actions">

                                {selectedBill.paymentStatus ===
                                    "PAID" && (

                                    <button
                                        type="button"
                                        className="modal-print-button"
                                        onClick={() => {

                                            const billId =
                                                selectedBill.id;

                                            setSelectedBill(null);

                                            navigate(
                                                `/bar/bills/print/${billId}`
                                            );

                                        }}
                                    >

                                        <FaPrint />

                                        Print Bill

                                    </button>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                PAYMENT MODAL
            ================================================= */}

            {canManageBar && paymentBill && (

                <div className="bill-modal-overlay">

                    <div className="bill-modal payment-modal">

                        <div className="bill-modal-header">

                            <div className="modal-title-area">

                                <div className="modal-icon payment">
                                    <FaMoneyBillWave />
                                </div>

                                <div>

                                    <span>
                                        PAYMENT
                                    </span>

                                    <h2>
                                        {
                                            paymentBill.billNumber
                                        }
                                    </h2>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="modal-close"
                                onClick={
                                    closePaymentModal
                                }
                                disabled={processing}
                                aria-label="Close"
                            >

                                <FaTimes />

                            </button>

                        </div>


                        <div className="payment-total">

                            <span>
                                AMOUNT PAYABLE
                            </span>

                            <strong>
                                {formatCurrency(
                                    paymentBill.grandTotal
                                )}
                            </strong>

                        </div>


                        <div className="payment-form">

                            <label>
                                Payment Method
                            </label>


                            <select
                                value={paymentMethod}
                                onChange={(event) =>
                                    setPaymentMethod(
                                        event.target.value
                                    )
                                }
                                disabled={processing}
                            >

                                <option value="CASH">
                                    Cash
                                </option>

                                <option value="CARD">
                                    Card
                                </option>

                                <option value="UPI">
                                    UPI
                                </option>

                            </select>


                            <label>
                                Remarks
                            </label>


                            <textarea
                                rows="3"
                                placeholder="Optional payment remarks..."
                                value={paymentRemarks}
                                onChange={(event) =>
                                    setPaymentRemarks(
                                        event.target.value
                                    )
                                }
                                disabled={processing}
                            />


                            <button
                                type="button"
                                className="confirm-payment-button"
                                onClick={handlePayment}
                                disabled={processing}
                            >

                                <FaCheckCircle />

                                {processing
                                    ? "Processing..."
                                    : "Confirm Payment"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default BarBills;
