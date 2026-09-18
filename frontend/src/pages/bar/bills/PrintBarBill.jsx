import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaPrint,
    FaFileInvoiceDollar
} from "react-icons/fa";

import barBillService from "../../../services/barBillService";
import barOrderService from "../../../services/barOrderService";

import "./PrintBarBill.css";


const formatCurrency = (value) => {
    return `₹${Number(value ?? 0).toFixed(2)}`;
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


function PrintBarBill() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [bill, setBill] = useState(null);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(Boolean(id));
    const [error, setError] = useState(id ? "" : "Bill ID is missing.");


    useEffect(() => {
        if (!id) {
            return undefined;
        }

        let cancelled = false;

        const loadBill = async () => {
            try {
                setLoading(true);
                setError("");

                const billResponse =
                    await barBillService.getBillById(id);

                const billData =
                    billResponse?.data || billResponse;

                if (!billData) {
                    throw new Error("Bill details not found.");
                }

                let orderData = null;

                if (billData.orderId) {
                    const orderResponse =
                        await barOrderService.getOrderById(
                            billData.orderId
                        );

                    orderData =
                        orderResponse?.data || orderResponse;
                }

                if (!cancelled) {
                    setBill(billData);
                    setOrder(orderData);
                }
            } catch (err) {
                console.error(
                    "Print Bill Load Error:",
                    err
                );

                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                        err.response?.data?.error ||
                        err.message ||
                        "Unable to load bill."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void loadBill();

        return () => {
            cancelled = true;
        };
    }, [id]);


    const handlePrint = () => {
        window.print();
    };


    if (!id) {
        return (
            <div className="print-bill-error-page">
                <h2>Unable to load bill</h2>

                <p>Bill ID is missing.</p>

                <button
                    type="button"
                    onClick={() => navigate("/bar/bills")}
                >
                    Back to Bills
                </button>
            </div>
        );
    }


    if (loading) {
        return (
            <div className="print-bill-loading">
                Loading bill...
            </div>
        );
    }


    if (error) {
        return (
            <div className="print-bill-error-page">
                <h2>Unable to load bill</h2>

                <p>{error}</p>

                <button
                    type="button"
                    onClick={() => navigate("/bar/bills")}
                >
                    Back to Bills
                </button>
            </div>
        );
    }


    if (!bill) {
        return null;
    }


    const items = Array.isArray(order?.items)
        ? order.items
        : [];

    const isPaid = bill.paymentStatus === "PAID";


    return (
        <div className="print-bill-page">

            <div className="print-bill-toolbar no-print">

                <button
                    type="button"
                    className="back-print-button"
                    onClick={() => navigate("/bar/bills")}
                >
                    <FaArrowLeft />
                    Back
                </button>

                <div className="print-toolbar-title">
                    <FaFileInvoiceDollar />
                    <span>Bill Preview</span>
                </div>

                <button
                    type="button"
                    className="print-bill-button"
                    onClick={handlePrint}
                >
                    <FaPrint />
                    Print / Save PDF
                </button>
            </div>


            <main className="receipt-shell">

                <div className="bar-receipt">

                    <header className="receipt-header">

                        <div className="receipt-brand">

                            <div className="receipt-logo">
                                M
                            </div>

                            <div>
                                <h1>MANGAL BAR</h1>
                                <p>Bar Management System</p>
                            </div>

                        </div>

                        <div className="receipt-status">
                            <span
                                className={
                                    isPaid
                                        ? "receipt-paid"
                                        : "receipt-unpaid"
                                }
                            >
                                {bill.paymentStatus}
                            </span>
                        </div>

                    </header>


                    <div className="receipt-divider" />


                    <section className="receipt-meta">

                        <div>
                            <span>Bill Number</span>
                            <strong>{bill.billNumber}</strong>
                        </div>

                        <div>
                            <span>Order Number</span>
                            <strong>
                                {bill.orderNumber ||
                                    order?.orderNumber ||
                                    `ORD-${bill.orderId}`}
                            </strong>
                        </div>

                        <div>
                            <span>Order Type</span>
                            <strong>
                                {order?.orderType || "DINE_IN"}
                            </strong>
                        </div>

                        <div>
                            <span>Table</span>
                            <strong>
                                {order?.tableNumber || "Takeaway"}
                            </strong>
                        </div>

                        <div>
                            <span>Created</span>
                            <strong>
                                {formatDateTime(bill.createdAt)}
                            </strong>
                        </div>

                        <div>
                            <span>Paid At</span>
                            <strong>
                                {formatDateTime(bill.paidAt)}
                            </strong>
                        </div>

                    </section>


                    <section className="receipt-items">

                        <div className="receipt-section-title">
                            Order Items
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>

                            <tbody>

                                {items.length > 0 ? (
                                    items.map((item) => (
                                        <tr
                                            key={
                                                item.id ||
                                                `${item.menuItemId}-${item.itemName}`
                                            }
                                        >
                                            <td>
                                                {item.itemName ||
                                                    "Menu Item"}
                                            </td>

                                            <td>
                                                {item.quantity}
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    item.unitPrice
                                                )}
                                            </td>

                                            <td>
                                                {formatCurrency(
                                                    item.lineTotal
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="receipt-no-items"
                                        >
                                            Item details unavailable
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>

                    </section>


                    <section className="receipt-totals">

                        <div className="receipt-total-row">
                            <span>Subtotal</span>
                            <strong>
                                {formatCurrency(bill.subtotal)}
                            </strong>
                        </div>

                        <div className="receipt-total-row">
                            <span>Discount</span>
                            <strong>
                                - {formatCurrency(
                                    bill.discountAmount
                                )}
                            </strong>
                        </div>

                        <div className="receipt-total-row">
                            <span>Tax</span>
                            <strong>
                                {formatCurrency(bill.taxAmount)}
                            </strong>
                        </div>

                        <div className="receipt-grand-total">
                            <span>GRAND TOTAL</span>
                            <strong>
                                {formatCurrency(bill.grandTotal)}
                            </strong>
                        </div>

                    </section>


                    <section className="receipt-payment">

                        <div>
                            <span>Payment Method</span>
                            <strong>
                                {bill.paymentMethod || "NOT PAID"}
                            </strong>
                        </div>

                        <div>
                            <span>Payment Status</span>
                            <strong>
                                {bill.paymentStatus}
                            </strong>
                        </div>

                    </section>


                    {(bill.remarks || order?.notes) && (
                        <section className="receipt-notes">
                            <strong>Notes</strong>

                            <p>
                                {bill.remarks || order?.notes}
                            </p>
                        </section>
                    )}


                    <footer className="receipt-footer">

                        <strong>Thank You!</strong>

                        <span>
                            Thank you for visiting Mangal Bar.
                        </span>

                        <span>
                            Please visit again.
                        </span>

                    </footer>

                </div>

            </main>
        </div>
    );
}

export default PrintBarBill;
