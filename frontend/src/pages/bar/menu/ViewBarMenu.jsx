import { useEffect, useState } from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    FaArrowLeft,
    FaCocktail,
    FaEdit,
    FaTags,
    FaCheckCircle,
    FaTimesCircle,
    FaListOl,
    FaMoneyBillWave,
    FaWineBottle,
    FaBoxes
} from "react-icons/fa";

import barMenuItemService from "../../../services/barMenuItemService";

import "./ViewBarMenu.css";


function ViewBarMenu() {

    const navigate = useNavigate();

    const { id } = useParams();


    const [item, setItem] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD ITEM
    // ==========================================

    useEffect(() => {

        const loadItem = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await barMenuItemService
                        .getItemById(id);

                setItem(
                    response.data
                );

            } catch (error) {

                console.error(
                    "Load Menu Item Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load menu item."
                );

            } finally {

                setLoading(false);

            }
        };


        if (id) {
            loadItem();
        }

    }, [id]);


    // ==========================================
    // FORMAT MONEY
    // ==========================================

    const formatMoney = (value) => {

        if (
            value === null ||
            value === undefined
        ) {
            return "₹0.00";
        }


        return `₹${Number(value).toFixed(2)}`;
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="view-bar-menu-loader">

                <div className="view-bar-menu-spinner"></div>

                <p>
                    Loading menu item...
                </p>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error || !item) {

        return (

            <div className="view-bar-menu-page">

                <button
                    type="button"
                    className="view-bar-menu-back"
                    onClick={() =>
                        navigate("/bar/menu")
                    }
                >

                    <FaArrowLeft />

                    Back to Menu

                </button>


                <div className="view-bar-menu-error">

                    <div className="view-bar-menu-error-icon">
                        ⚠
                    </div>

                    <h2>
                        Unable to Load Menu Item
                    </h2>

                    <p>
                        {error ||
                            "The requested menu item was not found."}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/bar/menu")
                        }
                    >
                        Back to Menu
                    </button>

                </div>

            </div>
        );
    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="view-bar-menu-page">


            {/* BACK */}

            <button
                type="button"
                className="view-bar-menu-back"
                onClick={() =>
                    navigate("/bar/menu")
                }
            >

                <FaArrowLeft />

                Back to Menu

            </button>


            {/* HEADER */}

            <div className="view-bar-menu-header">

                <div className="view-bar-menu-title">

                    <div className="view-bar-menu-icon">
                        <FaCocktail />
                    </div>

                    <div>

                        <h1>
                            {item.itemName}
                        </h1>

                        <p>
                            Bar menu item details
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="view-bar-menu-edit-btn"
                    onClick={() =>
                        navigate(
                            `/bar/menu/edit/${item.id}`
                        )
                    }
                >

                    <FaEdit />

                    Edit Item

                </button>

            </div>


            {/* CARD */}

            <div className="view-bar-menu-card">


                {/* SUMMARY */}

                <div className="view-bar-menu-summary">

                    <div className="view-bar-menu-large-icon">
                        <FaCocktail />
                    </div>

                    <div>

                        <h2>
                            {item.itemName}
                        </h2>

                        <p>
                            {item.description ||
                                "No description available."}
                        </p>

                    </div>

                </div>


                {/* DETAILS */}

                <div className="view-bar-menu-details">


                    {/* ITEM CODE */}

                    <div className="view-bar-menu-detail">

                        <div className="view-detail-icon">
                            #
                        </div>

                        <div>

                            <span>
                                Item Code
                            </span>

                            <strong>
                                {item.itemCode ||
                                    "Not available"}
                            </strong>

                        </div>

                    </div>


                    {/* CATEGORY */}

                    <div className="view-bar-menu-detail">

                        <div className="view-detail-icon">
                            <FaTags />
                        </div>

                        <div>

                            <span>
                                Category
                            </span>

                            <strong>
                                {item.categoryName ||
                                    "No Category"}
                            </strong>

                        </div>

                    </div>


                    {/* PRICE */}

                    <div className="view-bar-menu-detail">

                        <div className="view-detail-icon">
                            <FaMoneyBillWave />
                        </div>

                        <div>

                            <span>
                                Price
                            </span>

                            <strong>
                                {formatMoney(item.price)}
                            </strong>

                        </div>

                    </div>


                    {/* SELLING UNIT */}

                    <div className="view-bar-menu-detail">

                        <div className="view-detail-icon">
                            <FaWineBottle />
                        </div>

                        <div>

                            <span>
                                Selling Unit
                            </span>

                            <strong>
                                {item.sellingUnit ||
                                    "Not available"}
                            </strong>

                        </div>

                    </div>


                    {/* CONSUMPTION */}

                    <div className="view-bar-menu-detail">

                        <div className="view-detail-icon">
                            <FaBoxes />
                        </div>

                        <div>

                            <span>
                                Consumption Quantity
                            </span>

                            <strong>
                                {item.consumptionQuantity ??
                                    "Not available"}
                            </strong>

                        </div>

                    </div>


                    {/* DISPLAY ORDER */}

                    <div className="view-bar-menu-detail">

                        <div className="view-detail-icon">
                            <FaListOl />
                        </div>

                        <div>

                            <span>
                                Display Order
                            </span>

                            <strong>
                                {item.displayOrder ?? 0}
                            </strong>

                        </div>

                    </div>


                    {/* STATUS */}

                    <div className="view-bar-menu-detail">

                        <div className="view-detail-icon">

                            {item.active
                                ? <FaCheckCircle />
                                : <FaTimesCircle />
                            }

                        </div>

                        <div>

                            <span>
                                Status
                            </span>

                            <strong
                                className={
                                    item.active
                                        ? "view-status-active"
                                        : "view-status-inactive"
                                }
                            >
                                {item.active
                                    ? "Active"
                                    : "Inactive"}
                            </strong>

                        </div>

                    </div>


                    {/* ID */}

                    <div className="view-bar-menu-detail">

                        <div className="view-detail-icon">
                            #
                        </div>

                        <div>

                            <span>
                                Menu Item ID
                            </span>

                            <strong>
                                {item.id}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* DESCRIPTION */}

                <div className="view-bar-menu-description-section">

                    <h3>
                        Description
                    </h3>

                    <div className="view-bar-menu-description-box">

                        {item.description ||
                            "No description has been added for this menu item."}

                    </div>

                </div>


                {/* FOOTER */}

                <div className="view-bar-menu-footer">

                    <button
                        type="button"
                        className="view-bar-menu-footer-back"
                        onClick={() =>
                            navigate("/bar/menu")
                        }
                    >

                        <FaArrowLeft />

                        Back to Menu

                    </button>


                    <button
                        type="button"
                        className="view-bar-menu-footer-edit"
                        onClick={() =>
                            navigate(
                                `/bar/menu/edit/${item.id}`
                            )
                        }
                    >

                        <FaEdit />

                        Edit Item

                    </button>

                </div>

            </div>

        </div>
    );
}

export default ViewBarMenu;