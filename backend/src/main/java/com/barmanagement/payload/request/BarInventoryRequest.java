package com.barmanagement.payload.request;

import com.barmanagement.enums.InventoryUnit;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class BarInventoryRequest {

    // =====================================================
    // MENU ITEM ID
    // =====================================================

    @NotNull(message = "Menu item is required")
    private Long menuItemId;


    // =====================================================
    // QR CODE
    // =====================================================

    @Size(max = 255, message = "QR code cannot exceed 255 characters")
    private String qrCode;


    // =====================================================
    // OPENING QUANTITY
    // =====================================================

    @NotNull(message = "Opening quantity is required")
    @DecimalMin(
        value = "0.0",
        inclusive = true,
        message = "Opening quantity cannot be negative"
    )
    private BigDecimal openingQuantity;


    // =====================================================
    // INVENTORY UNIT
    // =====================================================

    @NotNull(message = "Inventory unit is required")
    private InventoryUnit unit;


    // =====================================================
    // MINIMUM QUANTITY
    // =====================================================

    @NotNull(message = "Minimum quantity is required")
    @DecimalMin(
        value = "0.0",
        inclusive = true,
        message = "Minimum quantity cannot be negative"
    )
    private BigDecimal minimumQuantity;


    // =====================================================
    // ACTIVE
    // =====================================================

    private Boolean active = true;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public BarInventoryRequest() {
    }


    // =====================================================
    // GETTERS AND SETTERS
    // =====================================================

    public Long getMenuItemId() {
        return menuItemId;
    }

    public void setMenuItemId(Long menuItemId) {
        this.menuItemId = menuItemId;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public BigDecimal getOpeningQuantity() {
        return openingQuantity;
    }

    public void setOpeningQuantity(
            BigDecimal openingQuantity) {

        this.openingQuantity = openingQuantity;
    }

    public InventoryUnit getUnit() {
        return unit;
    }

    public void setUnit(InventoryUnit unit) {
        this.unit = unit;
    }

    public BigDecimal getMinimumQuantity() {
        return minimumQuantity;
    }

    public void setMinimumQuantity(
            BigDecimal minimumQuantity) {

        this.minimumQuantity = minimumQuantity;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}