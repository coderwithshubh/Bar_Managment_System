import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import {
    FaArrowLeft,
    FaCocktail,
    FaSave,
    FaTimes
} from "react-icons/fa";

import barMenuItemService from "../../../services/barMenuItemService";
import barCategoryService from "../../../services/barCategoryService";

import "./EditBarMenu.css";


function EditBarMenu() {

    const navigate = useNavigate();

    const { id } = useParams();


    const [formData, setFormData] = useState({

        itemName: "",
        categoryId: "",
        description: "",
        price: "",
        sellingUnit: "",
        consumptionQuantity: "",
        active: true,
        displayOrder: 0

    });


    const [categories, setCategories] =
        useState([]);


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD DATA
    // ==========================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");


                const [
                    itemResponse,
                    categoryResponse
                ] = await Promise.all([

                    barMenuItemService
                        .getItemById(id),

                    barCategoryService
                        .getActiveCategories()

                ]);


                const item =
                    itemResponse.data;


                setFormData({

                    itemName:
                        item.itemName || "",

                    categoryId:
                        item.categoryId ?? "",

                    description:
                        item.description || "",

                    price:
                        item.price ?? "",

                    sellingUnit:
                        item.sellingUnit || "",

                    consumptionQuantity:
                        item.consumptionQuantity ?? "",

                    active:
                        item.active ?? true,

                    displayOrder:
                        item.displayOrder ?? 0

                });


                setCategories(
                    categoryResponse.data || []
                );


            } catch (error) {

                console.error(
                    "Load Edit Menu Data Error:",
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
            loadData();
        }

    }, [id]);


    // ==========================================
    // HANDLE CHANGE
    // ==========================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData((previous) => ({

            ...previous,

            [name]:
                name === "categoryId"
                    ? value
                    : name === "displayOrder"
                        ? Number(value)
                        : value

        }));
    };


    // ==========================================
    // VALIDATION
    // ==========================================

    const validateForm = () => {

        if (!formData.itemName.trim()) {

            setError(
                "Item name is required."
            );

            return false;
        }


        if (
            formData.itemName.trim().length < 2
        ) {

            setError(
                "Item name must contain at least 2 characters."
            );

            return false;
        }


        if (!formData.categoryId) {

            setError(
                "Please select a category."
            );

            return false;
        }


        const price =
            Number(formData.price);

        if (
            !formData.price ||
            Number.isNaN(price) ||
            price <= 0
        ) {

            setError(
                "Price must be greater than zero."
            );

            return false;
        }


        if (!formData.sellingUnit.trim()) {

            setError(
                "Selling unit is required."
            );

            return false;
        }


        const quantity =
            Number(
                formData.consumptionQuantity
            );

        if (
            !formData.consumptionQuantity ||
            Number.isNaN(quantity) ||
            quantity <= 0
        ) {

            setError(
                "Consumption quantity must be greater than zero."
            );

            return false;
        }


        if (
            Number(formData.displayOrder) < 0
        ) {

            setError(
                "Display order cannot be negative."
            );

            return false;
        }


        return true;
    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        if (!validateForm()) {
            return;
        }


        try {

            setSaving(true);


            const menuItemData = {

                itemName:
                    formData.itemName.trim(),

                categoryId:
                    Number(formData.categoryId),

                description:
                    formData.description.trim() ||
                    null,

                price:
                    Number(formData.price),

                sellingUnit:
                    formData.sellingUnit
                        .trim()
                        .toUpperCase(),

                consumptionQuantity:
                    Number(
                        formData.consumptionQuantity
                    ),

                active:
                    formData.active,

                displayOrder:
                    Number(
                        formData.displayOrder
                    )

            };


            await barMenuItemService.updateItem(
                id,
                menuItemData
            );


            navigate(
                `/bar/menu/view/${id}`
            );


        } catch (error) {

            console.error(
                "Update Menu Item Error:",
                error
            );

            console.error(
                "Response:",
                error.response?.data
            );


            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to update menu item."
            );

        } finally {

            setSaving(false);

        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="edit-bar-menu-loader">

                <div className="edit-bar-menu-spinner"></div>

                <p>
                    Loading menu item...
                </p>

            </div>
        );
    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="edit-bar-menu-page">

            <button
                type="button"
                className="edit-bar-menu-back"
                onClick={() =>
                    navigate(
                        `/bar/menu/view/${id}`
                    )
                }
                disabled={saving}
            >

                <FaArrowLeft />

                Back to Item

            </button>


            <div className="edit-bar-menu-header">

                <div className="edit-bar-menu-title">

                    <div className="edit-bar-menu-icon">
                        <FaCocktail />
                    </div>

                    <div>

                        <h1>
                            Edit Menu Item
                        </h1>

                        <p>
                            Update the details of this drink
                        </p>

                    </div>

                </div>

            </div>


            {error && (

                <div className="edit-bar-menu-error">
                    {error}
                </div>

            )}


            <form
                className="edit-bar-menu-card"
                onSubmit={handleSubmit}
            >

                {/* BASIC */}

                <section className="edit-bar-menu-section">

                    <div className="edit-bar-menu-section-header">

                        <div className="edit-section-number">
                            1
                        </div>

                        <div>

                            <h2>
                                Basic Information
                            </h2>

                            <p>
                                Update the basic details of the drink
                            </p>

                        </div>

                    </div>


                    <div className="edit-bar-menu-group">

                        <label>
                            Item Name
                            <span>*</span>
                        </label>

                        <input
                            type="text"
                            name="itemName"
                            value={formData.itemName}
                            onChange={handleChange}
                            maxLength={150}
                            disabled={saving}
                        />

                    </div>


                    <div className="edit-bar-menu-group">

                        <label>
                            Category
                            <span>*</span>
                        </label>

                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            disabled={saving}
                        >

                            <option value="">
                                Select category
                            </option>

                            {categories.map(
                                (category) => (

                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.categoryName}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    <div className="edit-bar-menu-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            maxLength={500}
                            rows={5}
                            disabled={saving}
                        />

                        <div className="edit-field-footer">

                            <small>
                                Optional description.
                            </small>

                            <span>
                                {formData.description.length}/500
                            </span>

                        </div>

                    </div>

                </section>


                {/* PRICING */}

                <section className="edit-bar-menu-section">

                    <div className="edit-bar-menu-section-header">

                        <div className="edit-section-number">
                            2
                        </div>

                        <div>

                            <h2>
                                Pricing & Consumption
                            </h2>

                            <p>
                                Update selling and inventory consumption details
                            </p>

                        </div>

                    </div>


                    <div className="edit-bar-menu-two-column">

                        <div className="edit-bar-menu-group">

                            <label>
                                Price
                                <span>*</span>
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0.01"
                                step="0.01"
                                disabled={saving}
                            />

                        </div>


                        <div className="edit-bar-menu-group">

                            <label>
                                Selling Unit
                                <span>*</span>
                            </label>

                            <input
                                type="text"
                                name="sellingUnit"
                                value={formData.sellingUnit}
                                onChange={handleChange}
                                maxLength={20}
                                disabled={saving}
                            />

                            <small>
                                Enter the exact backend enum value.
                            </small>

                        </div>


                        <div className="edit-bar-menu-group">

                            <label>
                                Consumption Quantity
                                <span>*</span>
                            </label>

                            <input
                                type="number"
                                name="consumptionQuantity"
                                value={
                                    formData.consumptionQuantity
                                }
                                onChange={handleChange}
                                min="0.001"
                                step="0.001"
                                disabled={saving}
                            />

                        </div>


                        <div className="edit-bar-menu-group">

                            <label>
                                Display Order
                            </label>

                            <input
                                type="number"
                                name="displayOrder"
                                value={formData.displayOrder}
                                onChange={handleChange}
                                min="0"
                                step="1"
                                disabled={saving}
                            />

                        </div>

                    </div>

                </section>


                {/* STATUS */}

                <section className="edit-bar-menu-section">

                    <div className="edit-bar-menu-section-header">

                        <div className="edit-section-number">
                            3
                        </div>

                        <div>

                            <h2>
                                Status
                            </h2>

                            <p>
                                Control menu item availability
                            </p>

                        </div>

                    </div>


                    <label className="edit-bar-menu-toggle">

                        <input
                            type="checkbox"
                            checked={formData.active}
                            onChange={(event) =>
                                setFormData(
                                    (previous) => ({
                                        ...previous,
                                        active:
                                            event.target.checked
                                    })
                                )
                            }
                            disabled={saving}
                        />

                        <span className="edit-toggle-slider"></span>

                        <span className="edit-toggle-label">
                            Active menu item
                        </span>

                    </label>

                </section>


                {/* ACTIONS */}

                <div className="edit-bar-menu-actions">

                    <button
                        type="button"
                        className="edit-bar-menu-cancel"
                        onClick={() =>
                            navigate(
                                `/bar/menu/view/${id}`
                            )
                        }
                        disabled={saving}
                    >

                        <FaTimes />

                        Cancel

                    </button>


                    <button
                        type="submit"
                        className="edit-bar-menu-save"
                        disabled={saving}
                    >

                        <FaSave />

                        {saving
                            ? "Updating..."
                            : "Update Item"}

                    </button>

                </div>

            </form>

        </div>
    );
}

export default EditBarMenu;