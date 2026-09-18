package com.barmanagement.payload.request;

import com.barmanagement.enums.BarPaymentMethod;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class BarBillPaymentRequest {

    // =====================================================
    // PAYMENT METHOD
    // =====================================================

    @NotNull(message = "Payment method is required.")
    private BarPaymentMethod paymentMethod;

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

    public BarPaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(
            BarPaymentMethod paymentMethod) {
        this.paymentMethod =
                paymentMethod;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(
            String remarks) {
        this.remarks = remarks;
    }
}