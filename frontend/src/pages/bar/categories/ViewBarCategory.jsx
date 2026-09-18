import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaArrowLeft,
    FaEdit,
    FaTags,
    FaCheckCircle,
    FaTimesCircle,
    FaHashtag,
    FaSortNumericDown,
    FaAlignLeft,
    FaCalendarAlt,
    FaInfoCircle
} from "react-icons/fa";

import barCategoryService from "../../../services/barCategoryService";

import "./BarCategoryView.css";


function ViewBarCategory() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD CATEGORY
    // =====================================================

    useEffect(() => {

        const fetchCategory = async () => {

            if (!id) {
                setError("Invalid category ID.");
                setLoading(false);
                return;
            }

            try {

                setLoading(true);
                setError("");

                const response =
                    await barCategoryService.getCategoryById(id);

                if (!response?.data) {
                    throw new Error(
                        "Category data was not returned by the server."
                    );
                }

                setCategory(response.data);

            } catch (error) {

                console.error(
                    "View Bar Category Error:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error?.response?.data?.detail ||
                    error?.message ||
                    "Unable to load category details."
                );

            } finally {

                setLoading(false);
            }
        };


        fetchCategory();

    }, [id]);


    // =====================================================
    // DATE FORMATTER
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "Not available";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleString(
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


    // =====================================================
    // BACK
    // =====================================================

    const handleBack = () => {
        navigate("/bar/categories");
    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = () => {

        if (!category?.id) {
            return;
        }

        navigate(
            `/bar/categories/edit/${category.id}`
        );
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="bar-category-view-page">

                <div className="bar-view-loader">

                    <div className="view-spinner"></div>

                    <p>
                        Loading category...
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error || !category) {

        return (

            <div className="bar-category-view-page">

                <div className="bar-view-error">

                    <FaTags />

                    <h2>
                        Category Not Found
                    </h2>

                    <p>
                        {error ||
                            "This category does not exist."}
                    </p>

                    <button
                        type="button"
                        onClick={handleBack}
                    >

                        <FaArrowLeft />

                        Back to Categories

                    </button>

                </div>

            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="bar-category-view-page">

            {/* =================================================
                TOP NAVIGATION
            ================================================= */}

            <div className="view-topbar">

                <button
                    type="button"
                    className="back-button"
                    onClick={handleBack}
                >

                    <FaArrowLeft />

                    Back to Categories

                </button>


                <button
                    type="button"
                    className="edit-category-button"
                    onClick={handleEdit}
                >

                    <FaEdit />

                    Edit Category

                </button>

            </div>


            {/* =================================================
                PAGE TITLE
            ================================================= */}

            <div className="view-page-title">

                <div
                    className="page-title-icon"
                    aria-hidden="true"
                >
                    <FaTags />
                </div>

                <div>

                    <h1>
                        Category Details
                    </h1>

                    <p>
                        View information about this bar category
                    </p>

                </div>

            </div>


            {/* =================================================
                CATEGORY SUMMARY
            ================================================= */}

            <div className="category-summary-card">

                <div
                    className="category-icon-large"
                    aria-hidden="true"
                >
                    <FaTags />
                </div>


                <div className="category-main-info">

                    <span className="category-label">
                        Category Name
                    </span>

                    <h2>
                        {category.categoryName}
                    </h2>


                    {category.categoryCode && (

                        <span className="category-code">
                            {category.categoryCode}
                        </span>

                    )}

                </div>


                <div
                    className={
                        category.active
                            ? "status-badge active"
                            : "status-badge inactive"
                    }
                >

                    {category.active ? (
                        <FaCheckCircle />
                    ) : (
                        <FaTimesCircle />
                    )}

                    {category.active
                        ? "Active"
                        : "Inactive"}

                </div>

            </div>


            {/* =================================================
                INFORMATION CARD
            ================================================= */}

            <div className="category-information-card">

                <div className="information-header">

                    <div>

                        <h2>
                            Category Information
                        </h2>

                        <p>
                            Basic details of this category
                        </p>

                    </div>

                </div>


                <div className="information-list">

                    {/* CATEGORY CODE */}

                    <div className="information-row">

                        <div className="information-label">

                            <div className="information-icon blue">
                                <FaHashtag />
                            </div>

                            <span>
                                Category Code
                            </span>

                        </div>

                        <strong>
                            {category.categoryCode ||
                                "Not available"}
                        </strong>

                    </div>


                    {/* DISPLAY ORDER */}

                    <div className="information-row">

                        <div className="information-label">

                            <div className="information-icon green">
                                <FaSortNumericDown />
                            </div>

                            <span>
                                Display Order
                            </span>

                        </div>

                        <strong>
                            {category.displayOrder ?? 0}
                        </strong>

                    </div>


                    {/* DESCRIPTION */}

                    <div className="information-row description-row">

                        <div className="information-label">

                            <div className="information-icon orange">
                                <FaAlignLeft />
                            </div>

                            <span>
                                Description
                            </span>

                        </div>

                        <strong>
                            {category.description ||
                                "No description provided."}
                        </strong>

                    </div>


                    {/* CREATED AT */}

                    <div className="information-row">

                        <div className="information-label">

                            <div className="information-icon purple">
                                <FaCalendarAlt />
                            </div>

                            <span>
                                Created At
                            </span>

                        </div>

                        <strong>
                            {formatDate(
                                category.createdAt
                            )}
                        </strong>

                    </div>


                    {/* UPDATED AT */}

                    <div className="information-row">

                        <div className="information-label">

                            <div className="information-icon pink">
                                <FaCalendarAlt />
                            </div>

                            <span>
                                Last Updated
                            </span>

                        </div>

                        <strong>
                            {formatDate(
                                category.updatedAt
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            {/* =================================================
                INFORMATION NOTE
            ================================================= */}

            <div className="category-info-note">

                <div className="info-note-icon">
                    <FaInfoCircle />
                </div>

                <div>

                    <h3>
                        About This Category
                    </h3>

                    <p>
                        This category is used to group
                        similar drinks together for better
                        organization and easy management.
                    </p>

                </div>

            </div>


            {/* =================================================
                BOTTOM ACTIONS
            ================================================= */}

            <div className="bottom-actions">

                <button
                    type="button"
                    className="bottom-back-button"
                    onClick={handleBack}
                >

                    <FaArrowLeft />

                    Back to Categories

                </button>


                <button
                    type="button"
                    className="bottom-edit-button"
                    onClick={handleEdit}
                >

                    <FaEdit />

                    Edit Category

                </button>

            </div>

        </div>
    );
}


export default ViewBarCategory;