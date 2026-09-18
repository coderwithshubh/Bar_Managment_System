import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";

import {
    FaChartLine,
    FaCalendarAlt,
    FaSyncAlt,
    FaSearch,
    FaShoppingCart,
    FaMoneyBillWave,
    FaCreditCard,
    FaClock
} from "react-icons/fa";

import barSalesReportService
    from "../../../services/barSalesReportService";

import "./BarSalesReport.css";


// =====================================================
// HELPERS
// =====================================================

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

    const amount = Number(
        value ?? 0
    );

    return `₹${amount.toFixed(2)}`;
};


const formatDate = (value) => {

    if (!value) {
        return "-";
    }

    const date = new Date(
        `${value}T00:00:00`
    );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
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


// =====================================================
// COMPONENT
// =====================================================

function BarSalesReport() {


    const [
        fromDate,
        setFromDate
    ] = useState(
        getMonthStart()
    );


    const [
        toDate,
        setToDate
    ] = useState(
        getToday()
    );


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


    // =====================================================
    // LOAD REPORT
    // =====================================================

    const loadReport = useCallback(
        async (showLoader = false) => {

            if (
                !fromDate ||
                !toDate
            ) {

                setError(
                    "Please select both dates."
                );

                return;
            }


            if (
                fromDate > toDate
            ) {

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
                    await barSalesReportService
                        .getSalesReport(
                            fromDate,
                            toDate
                        );


                setReport(data);

            } catch (err) {

                console.error(
                    "Bar Sales Report Error:",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Unable to load sales report."
                );

            } finally {

                if (showLoader) {
                    setLoading(false);
                } else {
                    setSearching(false);
                }
            }
        },
        [
            fromDate,
            toDate
        ]
    );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        let cancelled = false;


        const fetchInitialReport =
            async () => {

                try {

                    const data =
                        await barSalesReportService
                            .getSalesReport(
                                getMonthStart(),
                                getToday()
                            );


                    if (!cancelled) {

                        setReport(data);

                        setError("");
                    }

                } catch (err) {

                    console.error(
                        "Initial Sales Report Error:",
                        err
                    );


                    if (!cancelled) {

                        setError(
                            err.response?.data?.message ||
                            err.response?.data?.error ||
                            "Unable to load sales report."
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


    // =====================================================
    // DISPLAY VALUES
    // =====================================================

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

            dineInOrders:
                Number(
                    report?.dineInOrders ?? 0
                ),

            takeawayOrders:
                Number(
                    report?.takeawayOrders ?? 0
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

            grossSales:
                Number(
                    report?.grossSales ?? 0
                ),

            discountAmount:
                Number(
                    report?.discountAmount ?? 0
                ),

            taxAmount:
                Number(
                    report?.taxAmount ?? 0
                ),

            netSales:
                Number(
                    report?.netSales ?? 0
                ),

            collectedAmount:
                Number(
                    report?.collectedAmount ?? 0
                ),

            outstandingAmount:
                Number(
                    report?.outstandingAmount ?? 0
                )
        };

    }, [report]);


    // =====================================================
    // DAILY SALES
    // =====================================================

    const dailySales = useMemo(
        () => report?.dailySales ?? [],
        [report]
    );


    const maxDailySales = useMemo(() => {

        return Math.max(
            ...dailySales.map(
                (item) =>
                    Number(
                        item?.netSales ?? 0
                    )
            ),
            0
        );

    }, [dailySales]);


    // =====================================================
    // COLLECTION %
    // =====================================================

    const collectionPercentage =
        useMemo(() => {

            if (
                values.netSales <= 0
            ) {

                return 0;
            }


            return Math.min(
                100,
                Math.round(
                    (
                        values.collectedAmount /
                        values.netSales
                    ) * 100
                )
            );

        }, [
            values.collectedAmount,
            values.netSales
        ]);


    // =====================================================
    // UI
    // =====================================================
    return (

        <div className="bar-sales-report-page">


            {/* =================================================
                HERO
            ================================================= */}

            <section className="sales-report-hero">

                <div className="sales-report-hero-content">

                    <div className="sales-report-hero-icon">
                        <FaChartLine />
                    </div>


                    <div>

                        <span className="sales-report-kicker">
                            BAR MANAGEMENT
                        </span>


                        <h1>
                            Sales Report
                        </h1>


                        <p>
                            Analyze sales,
                            collections and
                            daily business
                            performance for
                            a selected period.
                        </p>

                    </div>

                </div>

            </section>


            {/* =================================================
                DATE FILTER
            ================================================= */}

            <section className="sales-report-filter-card">

                <div className="sales-filter-heading">

                    <div>

                        <span>
                            REPORT PERIOD
                        </span>


                        <h2>
                            Select Date Range
                        </h2>

                    </div>


                    <FaCalendarAlt />

                </div>


                <div className="sales-filter-controls">


                    <div className="sales-date-field">

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


                    <div className="sales-date-field">

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
                        className="sales-generate-button"
                        onClick={() =>
                            loadReport(false)
                        }
                        disabled={searching}
                    >

                        <FaSearch />


                        {
                            searching
                                ? "Generating..."
                                : "Generate Report"
                        }

                    </button>


                    <button
                        type="button"
                        className="sales-refresh-button"
                        onClick={() =>
                            loadReport(true)
                        }
                        disabled={
                            loading ||
                            searching
                        }
                        title="Refresh report"
                    >

                        <FaSyncAlt
                            className={
                                loading
                                    ? "sales-report-spin"
                                    : ""
                            }
                        />

                    </button>

                </div>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {
                error && (

                    <div className="sales-report-error">
                        {error}
                    </div>

                )
            }


            {/* =================================================
                REPORTING PERIOD
            ================================================= */}

            <div className="sales-report-period">

                <span>
                    REPORTING PERIOD
                </span>


                <strong>

                    {
                        formatDate(
                            report?.fromDate ||
                            fromDate
                        )
                    }


                    {" → "}


                    {
                        formatDate(
                            report?.toDate ||
                            toDate
                        )
                    }

                </strong>

            </div>


            {/* =================================================
                KPI CARDS
            ================================================= */}

            <section className="sales-kpi-grid">


                <div className="sales-kpi-card primary">

                    <div className="sales-kpi-icon">
                        <FaMoneyBillWave />
                    </div>


                    <span>
                        NET SALES
                    </span>


                    <strong>
                        {
                            formatCurrency(
                                values.netSales
                            )
                        }
                    </strong>


                    <small>
                        Non-void sales
                    </small>

                </div>


                <div className="sales-kpi-card success">

                    <div className="sales-kpi-icon">
                        <FaCreditCard />
                    </div>


                    <span>
                        COLLECTED
                    </span>


                    <strong>
                        {
                            formatCurrency(
                                values.collectedAmount
                            )
                        }
                    </strong>


                    <small>
                        {
                            values.paidBills
                        }
                        {" paid bills"}
                    </small>

                </div>


                <div className="sales-kpi-card warning">

                    <div className="sales-kpi-icon">
                        <FaClock />
                    </div>


                    <span>
                        OUTSTANDING
                    </span>


                    <strong>
                        {
                            formatCurrency(
                                values.outstandingAmount
                            )
                        }
                    </strong>


                    <small>
                        {
                            values.unpaidBills
                        }
                        {" unpaid bills"}
                    </small>

                </div>


                <div className="sales-kpi-card info">

                    <div className="sales-kpi-icon">
                        <FaShoppingCart />
                    </div>


                    <span>
                        TOTAL ORDERS
                    </span>


                    <strong>
                        {
                            values.totalOrders
                        }
                    </strong>


                    <small>
                        {
                            values.completedOrders
                        }
                        {" completed"}
                    </small>

                </div>

            </section>


            {/* =================================================
                ORDER + BILL BREAKDOWN
            ================================================= */}

            <section className="sales-report-two-column">


                <div className="sales-report-panel">

                    <div className="sales-panel-header">

                        <div>

                            <span>
                                ORDER BREAKDOWN
                            </span>


                            <h2>
                                Orders
                            </h2>

                        </div>


                        <FaShoppingCart />

                    </div>


                    <div className="sales-stat-list">


                        <div>
                            <span>
                                Total Orders
                            </span>

                            <strong>
                                {
                                    values.totalOrders
                                }
                            </strong>
                        </div>


                        <div>
                            <span>
                                Completed
                            </span>

                            <strong className="sales-positive">
                                {
                                    values.completedOrders
                                }
                            </strong>
                        </div>


                        <div>
                            <span>
                                Cancelled
                            </span>

                            <strong className="sales-negative">
                                {
                                    values.cancelledOrders
                                }
                            </strong>
                        </div>


                        <div>
                            <span>
                                Dine In
                            </span>

                            <strong>
                                {
                                    values.dineInOrders
                                }
                            </strong>
                        </div>


                        <div>
                            <span>
                                Takeaway
                            </span>

                            <strong>
                                {
                                    values.takeawayOrders
                                }
                            </strong>
                        </div>

                    </div>

                </div>


                <div className="sales-report-panel">

                    <div className="sales-panel-header">

                        <div>

                            <span>
                                BILL BREAKDOWN
                            </span>


                            <h2>
                                Bills
                            </h2>

                        </div>


                        <FaCreditCard />

                    </div>


                    <div className="sales-stat-list">


                        <div>

                            <span>
                                Total Bills
                            </span>

                            <strong>
                                {
                                    values.totalBills
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Paid
                            </span>

                            <strong className="sales-positive">
                                {
                                    values.paidBills
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Unpaid
                            </span>

                            <strong className="sales-warning">
                                {
                                    values.unpaidBills
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Void
                            </span>

                            <strong className="sales-negative">
                                {
                                    values.voidBills
                                }
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                FINANCIAL BREAKDOWN
            ================================================= */}

            <section className="sales-report-panel">

                <div className="sales-panel-header">

                    <div>

                        <span>
                            FINANCIAL BREAKDOWN
                        </span>


                        <h2>
                            Sales Composition
                        </h2>

                    </div>


                    <FaMoneyBillWave />

                </div>


                <div className="sales-financial-grid">


                    <div>

                        <span>
                            GROSS SALES
                        </span>


                        <strong>
                            {
                                formatCurrency(
                                    values.grossSales
                                )
                            }
                        </strong>

                    </div>


                    <div>

                        <span>
                            DISCOUNT
                        </span>


                        <strong>
                            {
                                formatCurrency(
                                    values.discountAmount
                                )
                            }
                        </strong>

                    </div>


                    <div>

                        <span>
                            TAX
                        </span>


                        <strong>
                            {
                                formatCurrency(
                                    values.taxAmount
                                )
                            }
                        </strong>

                    </div>


                    <div className="sales-financial-total">

                        <span>
                            NET SALES
                        </span>


                        <strong>
                            {
                                formatCurrency(
                                    values.netSales
                                )
                            }
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
                DAILY SALES
            ================================================= */}

            <section className="sales-report-panel">

                <div className="sales-panel-header">

                    <div>

                        <span>
                            DAILY PERFORMANCE
                        </span>


                        <h2>
                            Daily Sales
                        </h2>

                    </div>


                    <FaChartLine />

                </div>


                {
                    loading ? (

                        <div className="sales-loading">
                            Loading sales report...
                        </div>

                    ) : dailySales.length === 0 ? (

                        <div className="sales-empty">
                            No sales data available
                            for the selected period.
                        </div>

                    ) : (

                        <div className="sales-daily-wrapper">


                            {/* =====================================
                                BAR CHART
                            ===================================== */}

                            <div className="sales-chart-area">

                                {
                                    dailySales.map(
                                        (item) => {

                                            const netSales =
                                                Number(
                                                    item?.netSales ?? 0
                                                );


                                            const height =
                                                maxDailySales > 0
                                                    ? Math.max(
                                                        8,
                                                        (
                                                            netSales /
                                                            maxDailySales
                                                        ) * 100
                                                    )
                                                    : 8;


                                            return (

                                                <div
                                                    className="sales-chart-column"
                                                    key={
                                                        item.date
                                                    }
                                                >

                                                    <div className="sales-chart-value">

                                                        {
                                                            formatCurrency(
                                                                netSales
                                                            )
                                                        }

                                                    </div>


                                                    <div className="sales-chart-bar-track">

                                                        <div
                                                            className="sales-chart-bar"
                                                            style={{
                                                                height:
                                                                    `${height}%`
                                                            }}
                                                        />

                                                    </div>


                                                    <span>
                                                        {
                                                            formatDate(
                                                                item.date
                                                            )
                                                        }
                                                    </span>

                                                </div>

                                            );
                                        }
                                    )
                                }

                            </div>


                            {/* =====================================
                                DAILY TABLE
                            ===================================== */}

                            <div className="sales-table-wrapper">

                                <table className="sales-daily-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Date
                                            </th>

                                            <th>
                                                Bills
                                            </th>

                                            <th>
                                                Gross Sales
                                            </th>

                                            <th>
                                                Discount
                                            </th>

                                            <th>
                                                Tax
                                            </th>

                                            <th>
                                                Net Sales
                                            </th>

                                            <th>
                                                Collected
                                            </th>

                                            <th>
                                                Outstanding
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {
                                            dailySales.map(
                                                (item) => (

                                                    <tr
                                                        key={
                                                            `table-${item.date}`
                                                        }
                                                    >

                                                        <td>
                                                            {
                                                                formatDate(
                                                                    item.date
                                                                )
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                item.billCount ??
                                                                0
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                formatCurrency(
                                                                    item.grossSales
                                                                )
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                formatCurrency(
                                                                    item.discountAmount
                                                                )
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                formatCurrency(
                                                                    item.taxAmount
                                                                )
                                                            }
                                                        </td>


                                                        <td>

                                                            <strong>
                                                                {
                                                                    formatCurrency(
                                                                        item.netSales
                                                                    )
                                                                }
                                                            </strong>

                                                        </td>


                                                        <td>
                                                            {
                                                                formatCurrency(
                                                                    item.collectedAmount
                                                                )
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                formatCurrency(
                                                                    item.outstandingAmount
                                                                )
                                                            }
                                                        </td>

                                                    </tr>

                                                )
                                            )
                                        }

                                    </tbody>

                                </table>

                            </div>

                        </div>

                    )
                }

            </section>


            {/* =================================================
                COLLECTION STATUS
            ================================================= */}

            <section className="sales-report-panel">

                <div className="sales-panel-header">

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


                <div className="sales-collection-content">


                    <div className="sales-collection-main">

                        <strong>
                            {
                                collectionPercentage
                            }%
                        </strong>


                        <span>
                            of non-void sales
                            collected
                        </span>

                    </div>


                    <div className="sales-collection-bar">

                        <div
                            className="sales-collection-fill"
                            style={{
                                width:
                                    `${collectionPercentage}%`
                            }}
                        />

                    </div>


                    <div className="sales-collection-amounts">


                        <div>

                            <span>
                                Collected
                            </span>


                            <strong>
                                {
                                    formatCurrency(
                                        values.collectedAmount
                                    )
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Outstanding
                            </span>


                            <strong>
                                {
                                    formatCurrency(
                                        values.outstandingAmount
                                    )
                                }
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                NOTE
            ================================================= */}

            <div className="sales-report-note">

                Sales Report is built on
                the selected date range
                and excludes VOID bills
                from sales totals.

            </div>


        </div>
    );
}

export default BarSalesReport;