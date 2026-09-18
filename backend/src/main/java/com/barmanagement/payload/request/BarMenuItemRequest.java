package com.barmanagement.payload.request;

import com.barmanagement.enums.BarSellingUnit;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class BarMenuItemRequest {


    // ==========================================
    // ITEM NAME
    // ==========================================

    @NotBlank(message = "Item name is required")
    @Size(
        min = 2,
        max = 150,
        message = "Item name must be between 2 and 150 characters"
    )
    private String itemName;


    // ==========================================
    // CATEGORY ID
    // ==========================================

    @NotNull(message = "Category is required")
    private Long categoryId;


    // ==========================================
    // DESCRIPTION
    // ==========================================

    @Size(
        max = 500,
        message = "Description cannot exceed 500 characters"
    )
    private String description;


    // ==========================================
    // PRICE
    // ==========================================

    @NotNull(message = "Price is required")
    @DecimalMin(
        value = "0.01",
        message = "Price must be greater than zero"
    )
    private BigDecimal price;


    // ==========================================
    // SELLING UNIT
    // ==========================================

    @NotNull(message = "Selling unit is required")
    private BarSellingUnit sellingUnit;


    // ==========================================
    // CONSUMPTION QUANTITY
    // ==========================================

    @NotNull(message = "Consumption quantity is required")
    @DecimalMin(
        value = "0.001",
        message = "Consumption quantity must be greater than zero"
    )
    private BigDecimal consumptionQuantity;


    // ==========================================
    // ACTIVE STATUS
    // ==========================================

    private Boolean active = true;


    // ==========================================
    // DISPLAY ORDER
    // ==========================================

    @Min(
        value = 0,
        message = "Display order cannot be negative"
    )
    private Integer displayOrder = 0;


    // ==========================================
    // DEFAULT CONSTRUCTOR
    // ==========================================

    public BarMenuItemRequest() {
    }


    // ==========================================
    // GETTERS & SETTERS
    // ==========================================

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }


    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }


    public BarSellingUnit getSellingUnit() {
        return sellingUnit;
    }

    public void setSellingUnit(
            BarSellingUnit sellingUnit) {

        this.sellingUnit = sellingUnit;
    }


    public BigDecimal getConsumptionQuantity() {
        return consumptionQuantity;
    }

    public void setConsumptionQuantity(
            BigDecimal consumptionQuantity) {

        this.consumptionQuantity = consumptionQuantity;
    }


    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }


    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}