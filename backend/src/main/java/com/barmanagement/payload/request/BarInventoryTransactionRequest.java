package com.barmanagement.payload.request;

import com.barmanagement.enums.InventoryTransactionType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class BarInventoryTransactionRequest {

    // =====================================================
    // INVENTORY ID
    // =====================================================

    @NotNull(message = "Inventory is required")
    private Long inventoryId;


    // =====================================================
    // TRANSACTION TYPE
    // =====================================================

    @NotNull(message = "Transaction type is required")
    private InventoryTransactionType transactionType;


    // =====================================================
    // QUANTITY
    // =====================================================

    @NotNull(message = "Quantity is required")
    @DecimalMin(
        value = "0.001",
        message = "Transaction quantity must be greater than zero"
    )
    private BigDecimal quantity;


    // =====================================================
    // ADJUSTMENT DIRECTION
    // =====================================================

    private Boolean increaseStock;


    // =====================================================
    // REASON
    // =====================================================

    @Size(
        max = 300,
        message = "Reason cannot exceed 300 characters"
    )
    private String reason;


    // =====================================================
    // REFERENCE NUMBER
    // =====================================================

    @Size(
        max = 50,
        message = "Reference number cannot exceed 50 characters"
    )
    private String referenceNumber;


    public BarInventoryTransactionRequest() {
    }


    // =====================================================
    // GETTERS AND SETTERS
    // =====================================================

    public Long getInventoryId() {
        return inventoryId;
    }

    public void setInventoryId(Long inventoryId) {
        this.inventoryId = inventoryId;
    }

    public InventoryTransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(
            InventoryTransactionType transactionType) {

        this.transactionType = transactionType;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public Boolean getIncreaseStock() {
        return increaseStock;
    }

    public void setIncreaseStock(Boolean increaseStock) {
        this.increaseStock = increaseStock;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(
            String referenceNumber) {

        this.referenceNumber = referenceNumber;
    }
}