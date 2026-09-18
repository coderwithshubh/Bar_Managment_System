import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaArrowLeft,
    FaCocktail,
    FaSave,
    FaTimes
} from "react-icons/fa";

import barMenuItemService from "../../../services/barMenuItemService";
import barCategoryService from "../../../services/barCategoryService";

import "./AddBarMenu.css";


function AddBarMenu() {

    const navigate = useNavigate();


    // ==========================================
    // FORM DATA
    // ==========================================

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


    // ==========================================
    // STATES
    // ==========================================

    const [categories, setCategories] = useState([]);

    const [loadingCategories, setLoadingCategories] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // LOAD CATEGORIES
    // ==========================================

    useEffect(() => {

        const loadCategories = async () => {

            try {

                setLoadingCategories(true);
                setError("");

                const response =
                    await barCategoryService.getActiveCategories();

                setCategories(
                    response.data || []
                );

            } catch (error) {

                console.error(
                    "Load Categories Error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load bar categories."
                );

            } finally {

                setLoadingCategories(false);

            }
        };

        loadCategories();

    }, []);


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
                    : name === "price"
                        ? value
                        : name === "consumptionQuantity"
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

        const itemName =
            formData.itemName.trim();

        if (!itemName) {

            setError(
                "Item name is required."
            );

            return false;
        }


        if (itemName.length < 2) {

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


        const consumptionQuantity =
            Number(
                formData.consumptionQuantity
            );

        if (
            !formData.consumptionQuantity ||
            Number.isNaN(consumptionQuantity) ||
            consumptionQuantity <= 0
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


            const itemData = {

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


            await barMenuItemService.createItem(
                itemData
            );


            navigate("/bar/menu");

        } catch (error) {

            console.error(
                "Create Menu Item Error:",
                error
            );

            console.error(
                "Response:",
                error.response?.data
            );


            setError(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Unable to create menu item."
            );

        } finally {

            setSaving(false);

        }
    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <div className="add-bar-menu-page">

            {/* BACK */}

            <button
                type="button"
                className="add-bar-menu-back"
                onClick={() =>
                    navigate("/bar/menu")
                }
                disabled={saving}
            >
                <FaArrowLeft />
                Back to Menu
            </button>


            {/* HEADER */}

            <div className="add-bar-menu-header">

                <div className="add-bar-menu-title">

                    <div className="add-bar-menu-icon">
                        <FaCocktail />
                    </div>

                    <div>

                        <h1>
                            Add Bar Menu Item
                        </h1>

                        <p>
                            Add a new drink to your bar menu
                        </p>

                    </div>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="add-bar-menu-error">
                    {error}
                </div>

            )}


            {/* FORM */}

            <form
                className="add-bar-menu-card"
                onSubmit={handleSubmit}
            >

                {/* ==================================
                    BASIC INFORMATION
                ================================== */}

                <section className="add-bar-menu-section">

                    <div className="add-bar-menu-section-header">

                        <div className="section-number">
                            1
                        </div>

                        <div>

                            <h2>
                                Basic Information
                            </h2>

                            <p>
                                Enter the basic details of the drink
                            </p>

                        </div>

                    </div>


                    {/* ITEM NAME */}

                    <div className="add-bar-menu-field">

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
                            placeholder="Example: Black Dog"
                            disabled={saving}
                        />

                        <small>
                            Enter the name of the drink.
                        </small>

                    </div>


                    {/* CATEGORY */}

                    <div className="add-bar-menu-field">

                        <label>
                            Category
                            <span>*</span>
                        </label>

                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            disabled={
                                saving ||
                                loadingCategories
                            }
                        >

                            <option value="">
                                {loadingCategories
                                    ? "Loading categories..."
                                    : "Select category"}
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

                        <small>
                            Select the category for this drink.
                        </small>

                    </div>


                    {/* DESCRIPTION */}

                    <div className="add-bar-menu-field">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            maxLength={500}
                            rows={5}
                            placeholder="Example: Premium Scotch Whisky"
                            disabled={saving}
                        />

                        <div className="field-footer">

                            <small>
                                Optional description.
                            </small>

                            <span>
                                {formData.description.length}/500
                            </span>

                        </div>

                    </div>

                </section>


                {/* ==================================
                    PRICING & CONSUMPTION
                ================================== */}

                <section className="add-bar-menu-section">

                    <div className="add-bar-menu-section-header">

                        <div className="section-number">
                            2
                        </div>

                        <div>

                            <h2>
                                Pricing & Consumption
                            </h2>

                            <p>
                                Configure selling and consumption details
                            </p>

                        </div>

                    </div>


                    <div className="add-bar-menu-two-column">

                        {/* PRICE */}

                        <div className="add-bar-menu-field">

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
                                placeholder="Example: 250.00"
                                disabled={saving}
                            />

                            <small>
                                Selling price per unit.
                            </small>

                        </div>


                        {/* SELLING UNIT */}

                        <div className="add-bar-menu-field">

                            <label>
                                Selling Unit
                                <span>*</span>
                            </label>

                           <select
                             name="sellingUnit"
                             value={formData.sellingUnit}
                             onChange={handleChange}
                             disabled={saving}
                             >
                            <option value="">
                               Select selling unit
                            </option>

    <option value="BOTTLE">Bottle</option>
    <option value="GLASS">Glass</option>
    <option value="PEG">Peg</option>
    <option value="CAN">Can</option>
    <option value="PIECE">Piece</option>
</select>

<small>
    Select the selling unit for this menu item.
</small>


                        </div>


                        {/* CONSUMPTION */}

                        <div className="add-bar-menu-field">

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
                                placeholder="Example: 1.000"
                                disabled={saving}
                            />

                            <small>
                                Quantity consumed from inventory per selling unit.
                            </small>

                        </div>


                        {/* DISPLAY ORDER */}

                        <div className="add-bar-menu-field">

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

                            <small>
                                Lower numbers appear first.
                            </small>

                        </div>

                    </div>

                </section>


                {/* ==================================
                    STATUS
                ================================== */}

                <section className="add-bar-menu-section">

                    <div className="add-bar-menu-section-header">

                        <div className="section-number">
                            3
                        </div>

                        <div>

                            <h2>
                                Status
                            </h2>

                            <p>
                                Control whether this menu item is available
                            </p>

                        </div>

                    </div>


                    <label className="add-bar-menu-toggle">

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

                        <span className="toggle-slider"></span>

                        <span className="toggle-label">
                            Active menu item
                        </span>

                    </label>

                </section>


                {/* ACTIONS */}

                <div className="add-bar-menu-actions">

                    <button
                        type="button"
                        className="add-bar-menu-cancel"
                        onClick={() =>
                            navigate("/bar/menu")
                        }
                        disabled={saving}
                    >

                        <FaTimes />

                        Cancel

                    </button>


                    <button
                        type="submit"
                        className="add-bar-menu-save"
                        disabled={
                            saving ||
                            loadingCategories
                        }
                    >

                        <FaSave />

                        {saving
                            ? "Saving..."
                            : "Save Menu Item"}

                    </button>

                </div>

            </form>

        </div>
    );
}

export default AddBarMenu;