
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FaTags,
    FaArrowLeft,
    FaSave,
    FaTimes
} from "react-icons/fa";

import barCategoryService from "../../../services/barCategoryService";

import "./BarCategoryForm.css";


function EditBarCategory() {

    const navigate = useNavigate();
    const { id } = useParams();


    const [formData, setFormData] = useState({
        categoryName: "",
        description: "",
        displayOrder: 0,
        active: true
    });


    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    // =====================================================
    // LOAD CATEGORY
    // =====================================================

    useEffect(() => {

        const loadCategory = async () => {

            try {

                setLoading(true);
                setError("");


                const response =
                    await barCategoryService.getCategoryById(id);


                const category =
                    response?.data;


                if (!category) {

                    throw new Error(
                        "Category data was not returned by the server."
                    );
                }


                setFormData({

                    categoryName:
                        category.categoryName || "",

                    description:
                        category.description || "",

                    displayOrder:
                        category.displayOrder ?? 0,

                    active:
                        category.active ?? true
                });


            } catch (error) {

                console.error(
                    "Load Bar Category Error:",
                    error
                );


                setError(
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error?.response?.data?.detail ||
                    error?.message ||
                    "Unable to load category."
                );


            } finally {

                setLoading(false);
            }
        };
        if (id) {
            loadCategory();
        }

    }, [id]);


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        if (error) {
            setError("");
        }
    };


    // =====================================================
    // STATUS
    // =====================================================

    const handleStatusChange = (e) => {

        setFormData((previous) => ({
            ...previous,
            active: e.target.value === "true"
        }));

        if (error) {
            setError("");
        }
    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {

        const categoryName =
            formData.categoryName.trim();

        const description =
            formData.description.trim();

        const displayOrder =
            Number(formData.displayOrder);


        if (!categoryName) {
            return "Category name is required.";
        }


        if (
            categoryName.length < 2 ||
            categoryName.length > 100
        ) {
            return (
                "Category name must be between 2 and 100 characters."
            );
        }


        if (description.length > 300) {
            return (
                "Description cannot exceed 300 characters."
            );
        }


        if (
            !Number.isInteger(displayOrder) ||
            displayOrder < 0
        ) {
            return (
                "Display order must be a whole number greater than or equal to 0."
            );
        }


        return "";
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (saving) {
            return;
        }

        setError("");


        const validationError =
            validateForm();


        if (validationError) {

            setError(validationError);

            return;
        }


        try {

            setSaving(true);


            const categoryData = {

                categoryName:
                    formData.categoryName.trim(),

                description:
                    formData.description.trim() || null,

                displayOrder:
                    Number(formData.displayOrder),

                active:
                    formData.active
            };


            await barCategoryService.updateCategory(
                id,
                categoryData
            );


            navigate("/bar/categories");


        } catch (error) {

            console.error(
                "Update Bar Category Error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.response?.data?.detail ||
                "Unable to update bar category. Please try again."
            );


        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        if (saving) {
            return;
        }

        navigate("/bar/categories");
    };


    // =====================================================
    // INVALID ID
    // =====================================================

    if (!id) {
        return (
            <div className="bar-category-form-page">
                <button
                    type="button"
                    className="bar-form-back-btn"
                    onClick={handleCancel}
                >
                    <FaArrowLeft />
                    <span>
                        Back to Categories
                    </span>
                </button>

                <div
                    className="bar-form-error"
                    role="alert"
                >
                    Invalid category ID.
                </div>
            </div>
        );
    }


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="bar-category-form-loader">

                <div className="loader-spinner"></div>

                <p>
                    Loading category...
                </p>

            </div>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="bar-category-form-page">

            {/* BACK */}

            <button
                type="button"
                className="bar-form-back-btn"
                onClick={handleCancel}
                disabled={saving}
            >

                <FaArrowLeft />

                <span>
                    Back to Categories
                </span>

            </button>


            {/* HEADER */}

            <div className="bar-form-header">

                <div className="bar-form-title">

                    <div
                        className="bar-form-icon"
                        aria-hidden="true"
                    >
                        <FaTags />
                    </div>

                    <div>

                        <h1>
                            Edit Bar Category
                        </h1>

                        <p>
                            Update the details of this drink category.
                        </p>

                    </div>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div
                    className="bar-form-error"
                    role="alert"
                >
                    {error}
                </div>

            )}


            {/* FORM */}

            <form
                className="bar-category-form-card"
                onSubmit={handleSubmit}
                noValidate
            >

                {/* CATEGORY NAME */}

                <div className="bar-form-group">

                    <label htmlFor="edit-categoryName">

                        Category Name

                        <span>
                            *
                        </span>

                    </label>

                    <input
                        id="edit-categoryName"
                        type="text"
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleChange}
                        maxLength={100}
                        placeholder="Example: Whisky"
                        autoComplete="off"
                        disabled={saving}
                    />

                </div>


                {/* DESCRIPTION */}

                <div className="bar-form-group">

                    <label htmlFor="edit-description">
                        Description
                    </label>

                    <textarea
                        id="edit-description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        maxLength={300}
                        rows={4}
                        placeholder="Describe this category..."
                        disabled={saving}
                    />

                    <small>
                        {formData.description.length}/300 characters
                    </small>

                </div>


                {/* DISPLAY ORDER */}

                <div className="bar-form-group">

                    <label htmlFor="edit-displayOrder">
                        Display Order
                    </label>

                    <input
                        id="edit-displayOrder"
                        type="number"
                        name="displayOrder"
                        value={formData.displayOrder}
                        onChange={handleChange}
                        min="0"
                        step="1"
                        disabled={saving}
                    />

                    <small>
                        Lower numbers appear first.
                    </small>

                </div>


                {/* STATUS */}

                <div className="bar-form-group">

                    <label htmlFor="edit-active">
                        Status
                    </label>

                    <select
                        id="edit-active"
                        name="active"
                        value={String(formData.active)}
                        onChange={handleStatusChange}
                        disabled={saving}
                    >

                        <option value="true">
                            Active
                        </option>

                        <option value="false">
                            Inactive
                        </option>

                    </select>

                </div>


                {/* BUTTONS */}

                <div className="bar-form-actions">

                    <button
                        type="button"
                        className="bar-form-cancel-btn"
                        onClick={handleCancel}
                        disabled={saving}
                    >

                        <FaTimes />

                        <span>
                            Cancel
                        </span>

                    </button>


                    <button
                        type="submit"
                        className="bar-form-save-btn"
                        disabled={saving}
                    >

                        <FaSave />

                        <span>
                            {saving
                                ? "Updating..."
                                : "Update Category"}
                        </span>

                    </button>

                </div>

            </form>

        </div>
    );
}


export default EditBarCategory;