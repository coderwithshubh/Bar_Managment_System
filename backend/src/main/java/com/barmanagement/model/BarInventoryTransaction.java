package com.barmanagement.model;

import com.barmanagement.enums.InventoryTransactionType;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "bar_inventory_transactions",
    indexes = {
        @Index(
            name = "idx_bar_inventory_transaction_inventory",
            columnList = "inventory_id"
        ),
        @Index(
            name = "idx_bar_inventory_transaction_created_at",
            columnList = "created_at"
        )
    }
)
public class BarInventoryTransaction {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // INVENTORY
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "inventory_id",
        nullable = false,
        foreignKey = @ForeignKey(
            name = "fk_bar_inventory_transaction_inventory"
        )
    )
    private BarInventory inventory;


    // =====================================================
    // TRANSACTION TYPE
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(
        name = "transaction_type",
        nullable = false,
        length = 30
    )
    private InventoryTransactionType transactionType;


    // =====================================================
    // QUANTITY
    // =====================================================

    @Column(
        nullable = false,
        precision = 12,
        scale = 3
    )
    private BigDecimal quantity;


    // =====================================================
    // REASON
    // =====================================================

    @Column(length = 300)
    private String reason;


    // =====================================================
    // REFERENCE NUMBER
    // =====================================================

    @Column(
        name = "reference_number",
        length = 50
    )
    private String referenceNumber;


    // =====================================================
    // CREATED AT
    // =====================================================

    @Column(
        name = "created_at",
        nullable = false,
        updatable = false
    )
    private LocalDateTime createdAt;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public BarInventoryTransaction() {
    }


    // =====================================================
    // PRE PERSIST
    // =====================================================

    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();
    }


    // =====================================================
    // GETTERS AND SETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BarInventory getInventory() {
        return inventory;
    }

    public void setInventory(BarInventory inventory) {
        this.inventory = inventory;
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

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getReferenceNumber() {
        return referenceNumber;
    }

    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}