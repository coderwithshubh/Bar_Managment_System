import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    FaChartBar,
    FaClipboardList,
    FaCheckCircle,
    FaFileInvoiceDollar,
    FaMoneyBillWave,
    FaClock,
    FaSyncAlt,
    FaSearch,
    FaArrowRight
} from "react-icons/fa";

import barReportService
    from "../../../services/barReportService";

import "./BarReports.css";


/* =========================================================
   HELPERS
========================================================= */

const getToday = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


const getMonthStart = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    return `${year}-${month}-01`;
};


const formatCurrency = (value) => {
    const amount = Number(value ?? 0);

    return `₹${amount.toFixed(2)}`;
};


const formatDate = (value) => {

    if (!value) {
        return "-";
    }

    const date = new Date(
        `${value}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
};


/* =========================================================
   COMPONENT
========================================================= */

function BarReports() {


    const [
        fromDate,
        setFromDate
    ] = useState(getMonthStart());

    const [
        toDate,
        setToDate
    ] = useState(getToday());

    const [
        report,
        setReport
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        searching,
        setSearching
    ] = useState(false);

    const [
        error,
        setError
    ] = useState("");


    /* =====================================================
       LOAD REPORT
    ===================================================== */

    const loadReport = useCallback(
        async (showLoader = true) => {

            if (!fromDate || !toDate) {
                setError(
                    "Please select both dates."
                );

                return;
            }

            if (fromDate > toDate) {
                setError(
                    "From date cannot be after to date."
                );

                return;
            }

            if (showLoader) {
                setLoading(true);
            } else {
                setSearching(true);
            }

            setError("");

            try {

                const data =
                    await barReportService.getSummary(
                        fromDate,
                        toDate
                    );

                setReport(data);

            } catch (err) {

                console.error(
                    "Bar Report Error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Unable to load report."
                );

            } finally {

                if (showLoader) {
                    setLoading(false);
                } else {
                    setSearching(false);
                }
            }
        },
        [fromDate, toDate]
    );


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {

        let cancelled = false;

        const fetchInitialReport = async () => {

            try {

                const data =
                    await barReportService.getSummary(
                        getMonthStart(),
                        getToday()
                    );

                if (!cancelled) {
                    setReport(data);
                    setError("");
                }

            } catch (err) {

                console.error(
                    "Initial Report Error:",
                    err
                );

                if (!cancelled) {

                    setError(
                        err.response?.data?.message ||
                        err.response?.data?.error ||
                        "Unable to load report."
                    );
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        void fetchInitialReport();

        return () => {
            cancelled = true;
        };

    }, []);


    /* =====================================================
       DISPLAY VALUES
    ===================================================== */

    const values = useMemo(() => {

        return {
            totalOrders:
                Number(
                    report?.totalOrders ?? 0
                ),

            completedOrders:
                Number(
                    report?.completedOrders ?? 0
                ),

            cancelledOrders:
                Number(
                    report?.cancelledOrders ?? 0
                ),

            totalBills:
                Number(
                    report?.totalBills ?? 0
                ),

            paidBills:
                Number(
                    report?.paidBills ?? 0
                ),

            unpaidBills:
                Number(
                    report?.unpaidBills ?? 0
                ),

            voidBills:
                Number(
                    report?.voidBills ?? 0
                ),

            subtotal:
                Number(
                    report?.subtotal ?? 0
                ),

            discountAmount:
                Number(
                    report?.discountAmount ?? 0
                ),

            taxAmount:
                Number(
                    report?.taxAmount ?? 0
                ),

            grandTotal:
                Number(
                    report?.grandTotal ?? 0
                ),

            paidAmount:
                Number(
                    report?.paidAmount ?? 0
                ),

            unpaidAmount:
                Number(
                    report?.unpaidAmount ?? 0
                )
        };

    }, [report]);


    /* =====================================================
       PAYMENT COLLECTION %
    ===================================================== */

    const paidPercentage = useMemo(() => {

        if (
            values.grandTotal <= 0
        ) {
            return 0;
        }

        return Math.min(
            100,
            Math.round(
                (
                    values.paidAmount /
                    values.grandTotal
                ) * 100
            )
        );

    }, [
        values.paidAmount,
        values.grandTotal
    ]);


    /* =====================================================
       REPORT
    ===================================================== */
    return (

        <div className="bar-reports-page">


            {/* =================================================
                HERO
            ================================================= */}

            <section className="reports-hero">

                <div className="reports-hero-content">

                    <div className="reports-hero-icon">
                        <FaChartBar />
                    </div>

                    <div>

                        <span className="reports-kicker">
                            BAR MANAGEMENT
                        </span>

                        <h1>
                            Reports
                        </h1>

                        <p>
                            Analyze orders, bills,
                            collections and financial
                            activity for a selected period.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                FILTER
            ================================================= */}

            <section className="report-filter-card">

                <div className="filter-heading">

                    <div>

                        <span>
                            REPORT PERIOD
                        </span>

                        <h2>
                            Select Date Range
                        </h2>

                    </div>

                    <FaSearch />

                </div>


                <div className="report-filter-controls">

                    <div className="report-date-field">

                        <label>
                            From Date
                        </label>

                        <input
                            type="date"
                            value={fromDate}
                            onChange={(event) =>
                                setFromDate(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <div className="report-date-field">

                        <label>
                            To Date
                        </label>

                        <input
                            type="date"
                            value={toDate}
                            onChange={(event) =>
                                setToDate(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <button
                        type="button"
                        className="generate-report-button"
                        onClick={() =>
                            loadReport(false)
                        }
                        disabled={searching}
                    >

                        <FaSearch />

                        {searching
                            ? "Generating..."
                            : "Generate Report"}

                    </button>


                    <button
                        type="button"
                        className="refresh-report-button"
                        onClick={() =>
                            loadReport(true)
                        }
                        disabled={loading || searching}
                        title="Refresh report"
                    >

                        <FaSyncAlt
                            className={
                                loading
                                    ? "report-spin"
                                    : ""
                            }
                        />

                    </button>

                </div>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="report-error">

                    {error}

                </div>

            )}


            {/* =================================================
                DATE RANGE
            ================================================= */}

            <div className="report-period-label">

                <span>
                    REPORTING PERIOD
                </span>

                <strong>
                    {formatDate(
                        report?.fromDate ||
                        fromDate
                    )}

                    {" "}
                    →{" "}

                    {formatDate(
                        report?.toDate ||
                        toDate
                    )}
                </strong>

            </div>


            {/* =================================================
                KPI CARDS
            ================================================= */}

            <section className="report-kpi-grid">


                <div className="report-kpi-card sales-card">

                    <div className="report-kpi-icon">
                        <FaMoneyBillWave />
                    </div>

                    <div>

                        <span>
                            NET SALES
                        </span>

                        <strong>
                            {formatCurrency(
                                values.grandTotal
                            )}
                        </strong>

                        <small>
                            Non-void bills
                        </small>

                    </div>

                </div>


                <div className="report-kpi-card collected-card">

                    <div className="report-kpi-icon">
                        <FaCheckCircle />
                    </div>

                    <div>

                        <span>
                            COLLECTED
                        </span>

                        <strong>
                            {formatCurrency(
                                values.paidAmount
                            )}
                        </strong>

                        <small>
                            {values.paidBills} paid bills
                        </small>

                    </div>

                </div>


                <div className="report-kpi-card unpaid-card">

                    <div className="report-kpi-icon">
                        <FaClock />
                    </div>

                    <div>

                        <span>
                            OUTSTANDING
                        </span>

                        <strong>
                            {formatCurrency(
                                values.unpaidAmount
                            )}
                        </strong>

                        <small>
                            {values.unpaidBills} unpaid bills
                        </small>

                    </div>

                </div>


                <div className="report-kpi-card orders-card">

                    <div className="report-kpi-icon">
                        <FaClipboardList />
                    </div>

                    <div>

                        <span>
                            TOTAL ORDERS
                        </span>

                        <strong>
                            {values.totalOrders}
                        </strong>

                        <small>
                            {values.completedOrders} completed
                        </small>

                    </div>

                </div>

            </section>


            {/* =================================================
                ORDER + BILL SUMMARY
            ================================================= */}

            <section className="reports-two-column">


                <div className="report-panel">

                    <div className="report-panel-header">

                        <div>

                            <span>
                                ORDER SUMMARY
                            </span>

                            <h2>
                                Orders
                            </h2>

                        </div>

                        <FaClipboardList />

                    </div>


                    <div className="report-stat-list">

                        <div>
                            <span>Total Orders</span>
                            <strong>
                                {values.totalOrders}
                            </strong>
                        </div>

                        <div>
                            <span>Completed</span>
                            <strong className="positive-value">
                                {values.completedOrders}
                            </strong>
                        </div>

                        <div>
                            <span>Cancelled</span>
                            <strong className="negative-value">
                                {values.cancelledOrders}
                            </strong>
                        </div>

                    </div>

                </div>


                <div className="report-panel">

                    <div className="report-panel-header">

                        <div>

                            <span>
                                BILL SUMMARY
                            </span>

                            <h2>
                                Bills
                            </h2>

                        </div>

                        <FaFileInvoiceDollar />

                    </div>


                    <div className="report-stat-list">

                        <div>
                            <span>Total Bills</span>
                            <strong>
                                {values.totalBills}
                            </strong>
                        </div>

                        <div>
                            <span>Paid</span>
                            <strong className="positive-value">
                                {values.paidBills}
                            </strong>
                        </div>

                        <div>
                            <span>Unpaid</span>
                            <strong className="warning-value">
                                {values.unpaidBills}
                            </strong>
                        </div>

                        <div>
                            <span>Void</span>
                            <strong className="negative-value">
                                {values.voidBills}
                            </strong>
                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                FINANCIAL BREAKDOWN
            ================================================= */}

            <section className="report-panel financial-panel">

                <div className="report-panel-header">

                    <div>

                        <span>
                            FINANCIAL BREAKDOWN
                        </span>

                        <h2>
                            Sales Composition
                        </h2>

                    </div>

                    <FaChartBar />

                </div>


                <div className="financial-grid">

                    <div>

                        <span>
                            SUBTOTAL
                        </span>

                        <strong>
                            {formatCurrency(
                                values.subtotal
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            DISCOUNT
                        </span>

                        <strong>
                            {formatCurrency(
                                values.discountAmount
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            TAX
                        </span>

                        <strong>
                            {formatCurrency(
                                values.taxAmount
                            )}
                        </strong>

                    </div>


                    <div className="financial-total">

                        <span>
                            GRAND TOTAL
                        </span>

                        <strong>
                            {formatCurrency(
                                values.grandTotal
                            )}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
                COLLECTION PROGRESS
            ================================================= */}

            <section className="report-panel collection-panel">

                <div className="report-panel-header">

                    <div>

                        <span>
                            COLLECTION STATUS
                        </span>

                        <h2>
                            Payment Collection
                        </h2>

                    </div>

                    <FaMoneyBillWave />

                </div>


                <div className="collection-content">

                    <div className="collection-main">

                        <strong>
                            {paidPercentage}%
                        </strong>

                        <span>
                            of non-void bill value collected
                        </span>

                    </div>


                    <div className="collection-bar">

                        <div
                            className="collection-bar-fill"
                            style={{
                                width: `${paidPercentage}%`
                            }}
                        />

                    </div>


                    <div className="collection-amounts">

                        <div>

                            <span>
                                Collected
                            </span>

                            <strong>
                                {formatCurrency(
                                    values.paidAmount
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Outstanding
                            </span>

                            <strong>
                                {formatCurrency(
                                    values.unpaidAmount
                                )}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                NOTE
            ================================================= */}

            <div className="report-note">

                <FaArrowRight />

                <span>
                    This is the first Reports version.
                    Additional reports for item-wise sales,
                    category sales, payment-method analysis
                    and table usage will be added next.
                </span>

            </div>

        </div>
    );
}

export default BarReports;
