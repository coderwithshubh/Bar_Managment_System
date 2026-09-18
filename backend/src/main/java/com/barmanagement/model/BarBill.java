package com.barmanagement.model;

import com.barmanagement.enums.BarBillStatus;
import com.barmanagement.enums.BarPaymentMethod;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "bar_bills",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_bar_bill_number",
            columnNames = "bill_number"
        ),
        @UniqueConstraint(
            name = "uk_bar_bill_order",
            columnNames = "order_id"
        )
    }
)
public class BarBill {

    // =====================================================
    // ID
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================================
    // BILL NUMBER
    // =====================================================

    @Column(
        name = "bill_number",
        nullable = false,
        unique = true,
        length = 30
    )
    private String billNumber;

    // =====================================================
    // ORDER
    // =====================================================

    @Column(
        name = "order_id",
        nullable = false
    )
    private Long orderId;

    // =====================================================
    // AMOUNTS
    // =====================================================

    @Column(
        nullable = false,
        precision = 12,
        scale = 2
    )
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(
        name = "discount_amount",
        nullable = false,
        precision = 12,
        scale = 2
    )
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(
        name = "taxable_amount",
        nullable = false,
        precision = 12,
        scale = 2
    )
    private BigDecimal taxableAmount = BigDecimal.ZERO;

    @Column(
        name = "tax_percent",
        nullable = false,
        precision = 5,
        scale = 2
    )
    private BigDecimal taxPercent = BigDecimal.ZERO;

    @Column(
        name = "tax_amount",
        nullable = false,
        precision = 12,
        scale = 2
    )
    private BigDecimal taxAmount = BigDecimal.ZERO;

    @Column(
        name = "grand_total",
        nullable = false,
        precision = 12,
        scale = 2
    )
    private BigDecimal grandTotal = BigDecimal.ZERO;

    // =====================================================
    // PAYMENT
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(
        name = "payment_status",
        nullable = false,
        length = 20
    )
    private BarBillStatus paymentStatus =
            BarBillStatus.UNPAID;

    @Enumerated(EnumType.STRING)
    @Column(
        name = "payment_method",
        length = 30
    )
    private BarPaymentMethod paymentMethod;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    // =====================================================
    // OTHER
    // =====================================================

    @Column(
        length = 500
    )
    private String remarks;

    @Column(
        name = "void_reason",
        length = 500
    )
    private String voidReason;

    // =====================================================
    // TIMESTAMPS
    // =====================================================

    @Column(
        name = "created_at",
        nullable = false
    )
    private LocalDateTime createdAt;

    @Column(
        name = "updated_at"
    )
    private LocalDateTime updatedAt;

    // =====================================================
    // PRE PERSIST
    // =====================================================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt = now;

        if (paymentStatus == null) {
            paymentStatus =
                    BarBillStatus.UNPAID;
        }

        if (subtotal == null) {
            subtotal = BigDecimal.ZERO;
        }

        if (discountAmount == null) {
            discountAmount = BigDecimal.ZERO;
        }

        if (taxableAmount == null) {
            taxableAmount = BigDecimal.ZERO;
        }

        if (taxPercent == null) {
            taxPercent = BigDecimal.ZERO;
        }

        if (taxAmount == null) {
            taxAmount = BigDecimal.ZERO;
        }

        if (grandTotal == null) {
            grandTotal = BigDecimal.ZERO;
        }
    }

    // =====================================================
    // PRE UPDATE
    // =====================================================

    @PreUpdate
    protected void onUpdate() {

        updatedAt =
                LocalDateTime.now();
    }

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

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
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
        this.voidReason =
                voidReason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {
        this.createdAt =
                createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt) {
        this.updatedAt =
                updatedAt;
    }
}