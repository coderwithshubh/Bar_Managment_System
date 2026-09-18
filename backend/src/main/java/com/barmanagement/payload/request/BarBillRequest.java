package com.barmanagement.payload.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class BarBillRequest {

    // =====================================================
    // ORDER
    // =====================================================

    @NotNull(message = "Order ID is required.")
    private Long orderId;

    // =====================================================
    // DISCOUNT
    // =====================================================

    @DecimalMin(
            value = "0.00",
            message = "Discount cannot be negative."
    )
    private BigDecimal discountAmount =
            BigDecimal.ZERO;

    // =====================================================
    // TAX
    // =====================================================

    @DecimalMin(
            value = "0.00",
            message = "Tax percent cannot be negative."
    )
    @DecimalMax(
            value = "100.00",
            message = "Tax percent cannot exceed 100."
    )
    private BigDecimal taxPercent =
            BigDecimal.ZERO;

    // =====================================================
    // REMARKS
    // =====================================================

    @Size(
            max = 500,
            message = "Remarks cannot exceed 500 characters."
    )
    private String remarks;

    // =====================================================
    // GETTERS / SETTERS
    // =====================================================

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(
            Long orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(
            BigDecimal discountAmount) {
        this.discountAmount =
                discountAmount;
    }

    public BigDecimal getTaxPercent() {
        return taxPercent;
    }

    public void setTaxPercent(
            BigDecimal taxPercent) {
        this.taxPercent =
                taxPercent;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(
            String remarks) {
        this.remarks = remarks;
    }
}