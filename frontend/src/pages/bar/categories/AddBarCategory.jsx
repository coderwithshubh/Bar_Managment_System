import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaTags,
    FaArrowLeft,
    FaSave,
    FaTimes
} from "react-icons/fa";

import barCategoryService from "../../../services/barCategoryService";

import "./AddBarCategory.css";


function AddBarCategory() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        categoryName: "",
        description: "",
        displayOrder: 0,
        active: true
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


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
    // HANDLE STATUS
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


            await barCategoryService.createCategory(
                categoryData
            );


            navigate("/bar/categories");


        } catch (error) {

            console.error(
                "Create Bar Category Error:",
                error
            );


            setError(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                error?.response?.data?.detail ||
                "Unable to create bar category. Please try again."
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
    // UI
    // =====================================================

    return (

        <div className="add-bar-category-page">

            {/* BACK */}

            <button
                type="button"
                className="back-category-btn"
                onClick={handleCancel}
                disabled={saving}
            >

                <FaArrowLeft />

                <span>
                    Back to Categories
                </span>

            </button>


            {/* HEADER */}

            <div className="add-category-header">

                <div className="add-category-title">

                    <div
                        className="add-category-icon"
                        aria-hidden="true"
                    >
                        <FaTags />
                    </div>

                    <div>

                        <h1>
                            Add Bar Category
                        </h1>

                        <p>
                            Create a new category for your bar drinks.
                        </p>

                    </div>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div
                    className="category-form-error"
                    role="alert"
                >
                    {error}
                </div>

            )}


            {/* FORM */}

            <form
                className="category-form-card"
                onSubmit={handleSubmit}
                noValidate
            >

                {/* CATEGORY NAME */}

                <div className="form-group">

                    <label htmlFor="categoryName">

                        Category Name

                        <span>
                            *
                        </span>

                    </label>

                    <input
                        id="categoryName"
                        type="text"
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleChange}
                        placeholder="Example: Whisky"
                        maxLength={100}
                        autoComplete="off"
                        disabled={saving}
                    />

                    <small>
                        Enter a name between 2 and 100 characters.
                    </small>

                </div>


                {/* DESCRIPTION */}

                <div className="form-group">

                    <label htmlFor="description">
                        Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Example: Whisky and premium whisky drinks"
                        maxLength={300}
                        rows={4}
                        disabled={saving}
                    />

                    <small>
                        {formData.description.length}/300 characters
                    </small>

                </div>


                {/* DISPLAY ORDER */}

                <div className="form-group">

                    <label htmlFor="displayOrder">
                        Display Order
                    </label>

                    <input
                        id="displayOrder"
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

                <div className="form-group">

                    <label htmlFor="active">
                        Status
                    </label>

                    <select
                        id="active"
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

                <div className="category-form-actions">

                    <button
                        type="button"
                        className="cancel-category-btn"
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
                        className="save-category-btn"
                        disabled={saving}
                    >

                        <FaSave />

                        <span>
                            {saving
                                ? "Saving..."
                                : "Save Category"}
                        </span>

                    </button>

                </div>

            </form>

        </div>
    );
}


export default AddBarCategory;