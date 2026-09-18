package com.barmanagement.payload.response;

import com.barmanagement.enums.BarBillStatus;
import com.barmanagement.enums.BarPaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BarBillResponse {

    // =====================================================
    // BILL INFORMATION
    // =====================================================

    private Long id;

    private String billNumber;

    private Long orderId;

    private String orderNumber;

    // =====================================================
    // AMOUNTS
    // =====================================================

    private BigDecimal subtotal;

    private BigDecimal discountAmount;

    private BigDecimal taxableAmount;

    private BigDecimal taxPercent;

    private BigDecimal taxAmount;

    private BigDecimal grandTotal;

    // =====================================================
    // PAYMENT
    // =====================================================

    private BarBillStatus paymentStatus;

    private BarPaymentMethod paymentMethod;

    private LocalDateTime paidAt;

    // =====================================================
    // OTHER
    // =====================================================

    private String remarks;

    private String voidReason;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // =====================================================
    // GETTERS / SETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBillNumber() {
        return billNumber;
    }

    public void setBillNumber(
            String billNumber) {
        this.billNumber = billNumber;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(
            Long orderId) {
        this.orderId = orderId;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(
            String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(
            BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(
            BigDecimal discountAmount) {
        this.discountAmount =
                discountAmount;
    }

    public BigDecimal getTaxableAmount() {
        return taxableAmount;
    }

    public void setTaxableAmount(
            BigDecimal taxableAmount) {
        this.taxableAmount =
                taxableAmount;
    }

    public BigDecimal getTaxPercent() {
        return taxPercent;
    }

    public void setTaxPercent(
            BigDecimal taxPercent) {
        this.taxPercent =
                taxPercent;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(
            BigDecimal taxAmount) {
        this.taxAmount =
                taxAmount;
    }

    public BigDecimal getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(
            BigDecimal grandTotal) {
        this.grandTotal =
                grandTotal;
    }

    public BarBillStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(
            BarBillStatus paymentStatus) {
        this.paymentStatus =
                paymentStatus;
    }

    public BarPaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(
            BarPaymentMethod paymentMethod) {
        this.paymentMethod =
                paymentMethod;
    }

    public LocalDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(
            LocalDateTime paidAt) {
        this.paidAt = paidAt;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(
            String remarks) {
        this.remarks = remarks;
    }

    public String getVoidReason() {
        return voidReason;
    }

    public void setVoidReason(
            String voidReason) {
        this.voidReason = voidReason;
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