import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    FaChartLine,
    FaClipboardList,
    FaClock,
    FaCheckCircle,
    FaFileInvoiceDollar,
    FaTable,
    FaUsers,
    FaSyncAlt,
    FaArrowRight,
    FaExclamationTriangle
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import barOrderService from "../../../services/barOrderService";
import barBillService from "../../../services/barBillService";
import barTableService from "../../../services/barTableService";

import "./BarOverview.css";


/* =========================================================
   HELPERS
========================================================= */

const STATUS_ORDER = [
    "OPEN",
    "CONFIRMED",
    "PREPARING",
    "READY",
    "SERVED",
    "COMPLETED"
];

const TABLE_STATUSES = [
    "AVAILABLE",
    "OCCUPIED",
    "RESERVED",
    "CLEANING"
];


const getArrayData = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    return [];
};


const formatCurrency = (value) => {
    const amount = Number(value ?? 0);

    return `₹${amount.toFixed(2)}`;
};



const isToday = (value) => {
    if (!value) {
        return false;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return false;
    }

    const now = new Date();

    return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
    );
};


const getStatusClass = (value) =>
    String(value || "UNKNOWN").toLowerCase();


/* =========================================================
   COMPONENT
========================================================= */

function BarOverview() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [bills, setBills] = useState([]);
    const [tables, setTables] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    /* =====================================================
       LOAD OVERVIEW DATA
    ===================================================== */

    const loadOverview = async (showLoader = true) => {

        if (showLoader) {
            setLoading(true);
        }

        setError("");

        try {

            const [
                ordersResponse,
                billsResponse,
                tablesResponse
            ] = await Promise.all([
                barOrderService.getAllOrders(),
                barBillService.getAllBills(),
                barTableService.getAllTables()
            ]);

            setOrders(getArrayData(ordersResponse));
            setBills(getArrayData(billsResponse));
            setTables(getArrayData(tablesResponse));

        } catch (err) {

            console.error(
                "Bar Overview Load Error:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Unable to load bar overview."
            );

        } finally {

            if (showLoader) {
                setLoading(false);
            }
        }
    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        let cancelled = false;

        const fetchOverview = async () => {

            try {

                const [
                    ordersResponse,
                    billsResponse,
                    tablesResponse
                ] = await Promise.all([
                    barOrderService.getAllOrders(),
                    barBillService.getAllBills(),
                    barTableService.getAllTables()
                ]);

                if (!cancelled) {

                    setOrders(
                        getArrayData(ordersResponse)
                    );

                    setBills(
                        getArrayData(billsResponse)
                    );

                    setTables(
                        getArrayData(tablesResponse)
                    );

                    setError("");
                }

            } catch (err) {

                console.error(
                    "Initial Bar Overview Error:",
                    err
                );

                if (!cancelled) {

                    setError(
                        err.response?.data?.message ||
                        err.response?.data?.error ||
                        "Unable to load bar overview."
                    );
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void fetchOverview();

        return () => {
            cancelled = true;
        };

    }, []);


    /* =====================================================
       TODAY'S ORDERS
    ===================================================== */

    const todayOrders = useMemo(
        () =>
            orders.filter(
                (order) =>
                    isToday(
                        order.createdAt ||
                        order.orderedAt ||
                        order.created_at
                    )
            ),
        [orders]
    );


    /* =====================================================
       TODAY'S BILLS
    ===================================================== */

    const todayBills = useMemo(
        () =>
            bills.filter(
                (bill) =>
                    isToday(
                        bill.createdAt ||
                        bill.paidAt
                    )
            ),
        [bills]
    );


    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {

        const completedOrders = todayOrders.filter(
            (order) =>
                order.status === "COMPLETED"
        ).length;

        const activeOrders = todayOrders.filter(
            (order) =>
                order.status &&
                ![
                    "COMPLETED",
                    "CANCELLED"
                ].includes(order.status)
        ).length;

        const unpaidBills = bills.filter(
            (bill) =>
                bill.paymentStatus === "UNPAID"
        ).length;

        const paidBills = bills.filter(
            (bill) =>
                bill.paymentStatus === "PAID"
        ).length;

        const todaySales = todayBills
            .filter(
                (bill) =>
                    bill.paymentStatus === "PAID"
            )
            .reduce(
                (sum, bill) =>
                    sum +
                    Number(
                        bill.grandTotal ?? 0
                    ),
                0
            );

        const totalSales = bills
            .filter(
                (bill) =>
                    bill.paymentStatus === "PAID"
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
            todayOrders: todayOrders.length,
            completedOrders,
            activeOrders,
            unpaidBills,
            paidBills,
            todaySales,
            totalSales
        };

    }, [
        todayOrders,
        todayBills,
        bills
    ]);


    /* =====================================================
       ORDER STATUS COUNTS
    ===================================================== */

    const orderStatusCounts = useMemo(() => {

        return STATUS_ORDER.reduce(
            (result, status) => {

                result[status] =
                    todayOrders.filter(
                        (order) =>
                            order.status === status
                    ).length;

                return result;

            },
            {}
        );

    }, [todayOrders]);


    /* =====================================================
       TABLE STATUS COUNTS
    ===================================================== */

    const tableStatusCounts = useMemo(() => {

        return TABLE_STATUSES.reduce(
            (result, status) => {

                result[status] =
                    tables.filter(
                        (table) =>
                            table.status === status &&
                            table.active !== false
                    ).length;

                return result;

            },
            {}
        );

    }, [tables]);


    /* =====================================================
       RECENT ORDERS
    ===================================================== */

    const recentOrders = useMemo(() => {

        return [...orders]
            .sort(
                (a, b) =>
                    new Date(
                        b.createdAt ||
                        b.orderedAt ||
                        0
                    ) -
                    new Date(
                        a.createdAt ||
                        a.orderedAt ||
                        0
                    )
            )
            .slice(0, 6);

    }, [orders]);


    /* =====================================================
       RECENT BILLS
    ===================================================== */

    const recentBills = useMemo(() => {

        return [...bills]
            .sort(
                (a, b) =>
                    new Date(
                        b.createdAt || 0
                    ) -
                    new Date(
                        a.createdAt || 0
                    )
            )
            .slice(0, 6);

    }, [bills]);


    /* =====================================================
       TOP TABLE OCCUPANCY SUMMARY
    ===================================================== */

    const tableTotal = tables.filter(
        (table) =>
            table.active !== false
    ).length;


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="bar-overview-page">


            {/* =================================================
                HERO
            ================================================= */}

            <section className="overview-hero">

                <div className="overview-hero-content">

                    <div className="overview-hero-icon">
                        <FaChartLine />
                    </div>

                    <div>

                        <span className="overview-kicker">
                            MANGAL BAR MANAGEMENT
                        </span>

                        <h1>
                            Bar Overview
                        </h1>

                        <p>
                            Live summary of today's orders,
                            sales, bills and table activity.
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="overview-refresh-button"
                    onClick={() =>
                        loadOverview(true)
                    }
                    disabled={loading}
                >

                    <FaSyncAlt
                        className={
                            loading
                                ? "overview-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="overview-error">

                    <FaExclamationTriangle />

                    <span>
                        {error}
                    </span>

                </div>

            )}


            {/* =================================================
                MAIN KPI CARDS
            ================================================= */}

            <section className="overview-kpi-grid">

                <div className="overview-kpi-card sales">

                    <div className="overview-kpi-icon">
                        <FaChartLine />
                    </div>

                    <div>

                        <span>
                            TODAY'S SALES
                        </span>

                        <strong>
                            {formatCurrency(
                                statistics.todaySales
                            )}
                        </strong>

                        <small>
                            Paid bills today
                        </small>

                    </div>

                </div>


                <div className="overview-kpi-card orders">

                    <div className="overview-kpi-icon">
                        <FaClipboardList />
                    </div>

                    <div>

                        <span>
                            TODAY'S ORDERS
                        </span>

                        <strong>
                            {statistics.todayOrders}
                        </strong>

                        <small>
                            {statistics.activeOrders}
                            {" "}active orders
                        </small>

                    </div>

                </div>


                <div className="overview-kpi-card completed">

                    <div className="overview-kpi-icon">
                        <FaCheckCircle />
                    </div>

                    <div>

                        <span>
                            COMPLETED TODAY
                        </span>

                        <strong>
                            {statistics.completedOrders}
                        </strong>

                        <small>
                            Completed orders
                        </small>

                    </div>

                </div>


                <div className="overview-kpi-card unpaid">

                    <div className="overview-kpi-icon">
                        <FaFileInvoiceDollar />
                    </div>

                    <div>

                        <span>
                            UNPAID BILLS
                        </span>

                        <strong>
                            {statistics.unpaidBills}
                        </strong>

                        <small>
                            Awaiting payment
                        </small>

                    </div>

                </div>

            </section>


            {/* =================================================
                OPERATIONS
            ================================================= */}

            <section className="overview-two-column">


                {/* ORDER STATUS */}

                <div className="overview-panel">

                    <div className="overview-panel-header">

                        <div>

                            <span className="panel-kicker">
                                OPERATIONS
                            </span>

                            <h2>
                                Today's Order Status
                            </h2>

                        </div>

                        <button
                            type="button"
                            className="panel-link"
                            onClick={() =>
                                navigate("/bar/orders")
                            }
                        >

                            Orders

                            <FaArrowRight />

                        </button>

                    </div>


                    <div className="order-status-list">

                        {STATUS_ORDER.map(
                            (status) => (

                                <div
                                    className="order-status-row"
                                    key={status}
                                >

                                    <div className="order-status-title">

                                        <span
                                            className={`status-dot ${getStatusClass(
                                                status
                                            )}`}
                                        />

                                        <span>
                                            {
                                                status
                                                    .replace(
                                                        "_",
                                                        " "
                                                    )
                                                    .toLowerCase()
                                                    .replace(
                                                        /^\w/,
                                                        (letter) =>
                                                            letter.toUpperCase()
                                                    )
                                            }
                                        </span>

                                    </div>


                                    <strong>
                                        {
                                            orderStatusCounts[
                                                status
                                            ] || 0
                                        }
                                    </strong>

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* TABLE STATUS */}

                <div className="overview-panel">

                    <div className="overview-panel-header">

                        <div>

                            <span className="panel-kicker">
                                FLOOR
                            </span>

                            <h2>
                                Table Status
                            </h2>

                        </div>

                        <button
                            type="button"
                            className="panel-link"
                            onClick={() =>
                                navigate("/bar/tables")
                            }
                        >

                            Tables

                            <FaArrowRight />

                        </button>

                    </div>


                    <div className="table-summary">

                        <div className="table-total-card">

                            <FaTable />

                            <div>

                                <span>
                                    ACTIVE TABLES
                                </span>

                                <strong>
                                    {tableTotal}
                                </strong>

                            </div>

                        </div>


                        <div className="table-status-grid">

                            {TABLE_STATUSES.map(
                                (status) => (

                                    <div
                                        className={`table-status-card ${getStatusClass(
                                            status
                                        )}`}
                                        key={status}
                                    >

                                        <span>
                                            {
                                                status
                                                    .replace(
                                                        "_",
                                                        " "
                                                    )
                                            }
                                        </span>

                                        <strong>
                                            {
                                                tableStatusCounts[
                                                    status
                                                ] || 0
                                            }
                                        </strong>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                RECENT ORDERS / BILLS
            ================================================= */}

            <section className="overview-two-column">


                {/* RECENT ORDERS */}

                <div className="overview-panel">

                    <div className="overview-panel-header">

                        <div>

                            <span className="panel-kicker">
                                LIVE ACTIVITY
                            </span>

                            <h2>
                                Recent Orders
                            </h2>

                        </div>

                        <button
                            type="button"
                            className="panel-link"
                            onClick={() =>
                                navigate("/bar/orders")
                            }
                        >

                            View All

                            <FaArrowRight />

                        </button>

                    </div>


                    <div className="overview-list">

                        {recentOrders.length === 0 ? (

                            <div className="overview-empty">
                                No orders found.
                            </div>

                        ) : (

                            recentOrders.map(
                                (order) => (

                                    <div
                                        className="overview-list-row"
                                        key={order.id}
                                    >

                                        <div className="list-main">

                                            <div className="list-icon order-icon">
                                                <FaClipboardList />
                                            </div>

                                            <div>

                                                <strong>
                                                    {
                                                        order.orderNumber ||
                                                        `Order #${order.id}`
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        order.orderType ||
                                                        "BAR ORDER"
                                                    }

                                                    {order.tableNumber
                                                        ? ` • Table ${order.tableNumber}`
                                                        : ""
                                                    }
                                                </span>

                                            </div>

                                        </div>


                                        <div className="list-side">

                                            <span
                                                className={`mini-status ${getStatusClass(
                                                    order.status
                                                )}`}
                                            >
                                                {
                                                    order.status ||
                                                    "-"
                                                }
                                            </span>

                                            <strong>
                                                {formatCurrency(
                                                    order.grandTotal
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>


                {/* RECENT BILLS */}

                <div className="overview-panel">

                    <div className="overview-panel-header">

                        <div>

                            <span className="panel-kicker">
                                BILLING
                            </span>

                            <h2>
                                Recent Bills
                            </h2>

                        </div>

                        <button
                            type="button"
                            className="panel-link"
                            onClick={() =>
                                navigate("/bar/bills")
                            }
                        >

                            View All

                            <FaArrowRight />

                        </button>

                    </div>


                    <div className="overview-list">

                        {recentBills.length === 0 ? (

                            <div className="overview-empty">
                                No bills found.
                            </div>

                        ) : (

                            recentBills.map(
                                (bill) => (

                                    <div
                                        className="overview-list-row"
                                        key={bill.id}
                                    >

                                        <div className="list-main">

                                            <div className="list-icon bill-icon">
                                                <FaFileInvoiceDollar />
                                            </div>

                                            <div>

                                                <strong>
                                                    {
                                                        bill.billNumber ||
                                                        `Bill #${bill.id}`
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        bill.orderNumber ||
                                                        `Order #${bill.orderId}`
                                                    }
                                                </span>

                                            </div>

                                        </div>


                                        <div className="list-side">

                                            <span
                                                className={`mini-status ${getStatusClass(
                                                    bill.paymentStatus
                                                )}`}
                                            >
                                                {
                                                    bill.paymentStatus ||
                                                    "-"
                                                }
                                            </span>

                                            <strong>
                                                {formatCurrency(
                                                    bill.grandTotal
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>

            </section>


            {/* =================================================
                QUICK SUMMARY
            ================================================= */}

            <section className="overview-summary-strip">

                <div>

                    <FaUsers />

                    <div>

                        <span>
                            PAID BILLS
                        </span>

                        <strong>
                            {statistics.paidBills}
                        </strong>

                    </div>

                </div>


                <div>

                    <FaClock />

                    <div>

                        <span>
                            UNPAID BILLS
                        </span>

                        <strong>
                            {statistics.unpaidBills}
                        </strong>

                    </div>

                </div>


                <div>

                    <FaTable />

                    <div>

                        <span>
                            OCCUPIED TABLES
                        </span>

                        <strong>
                            {
                                tableStatusCounts.OCCUPIED ||
                                0
                            }
                        </strong>

                    </div>

                </div>


                <div>

                    <FaChartLine />

                    <div>

                        <span>
                            TOTAL COLLECTED
                        </span>

                        <strong>
                            {formatCurrency(
                                statistics.totalSales
                            )}
                        </strong>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default BarOverview;
