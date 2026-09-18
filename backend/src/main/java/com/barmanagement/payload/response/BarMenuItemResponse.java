package com.barmanagement.payload.response;

import com.barmanagement.enums.BarSellingUnit;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BarMenuItemResponse {


    // ==========================================
    // PRIMARY KEY
    // ==========================================

    private Long id;


    // ==========================================
    // ITEM CODE
    // ==========================================

    private String itemCode;


    // ==========================================
    // ITEM NAME
    // ==========================================

    private String itemName;


    // ==========================================
    // CATEGORY ID
    // ==========================================

    private Long categoryId;


    // ==========================================
    // CATEGORY NAME
    // ==========================================

    private String categoryName;


    // ==========================================
    // DESCRIPTION
    // ==========================================

    private String description;


    // ==========================================
    // PRICE
    // ==========================================

    private BigDecimal price;


    // ==========================================
    // SELLING UNIT
    // ==========================================

    private BarSellingUnit sellingUnit;


    // ==========================================
    // CONSUMPTION QUANTITY
    // ==========================================

    private BigDecimal consumptionQuantity;


    // ==========================================
    // ACTIVE STATUS
    // ==========================================

    private Boolean active;


    // ==========================================
    // DISPLAY ORDER
    // ==========================================

    private Integer displayOrder;


    // ==========================================
    // CREATED AT
    // ==========================================

    private LocalDateTime createdAt;


    // ==========================================
    // UPDATED AT
    // ==========================================

    private LocalDateTime updatedAt;


    // ==========================================
    // DEFAULT CONSTRUCTOR
    // ==========================================

    public BarMenuItemResponse() {
    }


    // ==========================================
    // GETTERS & SETTERS
    // ==========================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getItemCode() {
        return itemCode;
    }

    public void setItemCode(String itemCode) {
        this.itemCode = itemCode;
    }


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


    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
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


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt = createdAt;
    }


    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt) {

        this.updatedAt = updatedAt;
    }
}