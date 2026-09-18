package com.barmanagement.model;

import com.barmanagement.enums.InventoryUnit;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "bar_inventory",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_bar_inventory_menu_item",
            columnNames = "menu_item_id"
        )
    }
)
public class BarInventory {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =====================================================
    // BAR MENU ITEM
    // =====================================================

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
        name = "menu_item_id",
        nullable = false,
        foreignKey = @ForeignKey(
            name = "fk_bar_inventory_menu_item"
        )
    )
    private BarMenuItem menuItem;


    // =====================================================
    // QR CODE
    // =====================================================

    @Column(
        name = "qr_code",
        unique = true,
        length = 255
    )
    private String qrCode;


    // =====================================================
    // CURRENT QUANTITY
    // =====================================================

    @Column(
        name = "current_quantity",
        nullable = false,
        precision = 12,
        scale = 3
    )
    private BigDecimal currentQuantity = BigDecimal.ZERO;


    // =====================================================
    // INVENTORY UNIT
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(
        nullable = false,
        length = 20
    )
    private InventoryUnit unit;


    // =====================================================
    // MINIMUM QUANTITY
    // =====================================================

    @Column(
        name = "minimum_quantity",
        nullable = false,
        precision = 12,
        scale = 3
    )
    private BigDecimal minimumQuantity = BigDecimal.ZERO;


    // =====================================================
    // ACTIVE STATUS
    // =====================================================

    @Column(nullable = false)
    private Boolean active = true;


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
    // UPDATED AT
    // =====================================================

    @Column(
        name = "updated_at",
        nullable = false
    )
    private LocalDateTime updatedAt;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public BarInventory() {
    }


    // =====================================================
    // PRE PERSIST
    // =====================================================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (currentQuantity == null) {
            currentQuantity = BigDecimal.ZERO;
        }

        if (minimumQuantity == null) {
            minimumQuantity = BigDecimal.ZERO;
        }

        if (active == null) {
            active = true;
        }
    }


    // =====================================================
    // PRE UPDATE
    // =====================================================

    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
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

    public BarMenuItem getMenuItem() {
        return menuItem;
    }

    public void setMenuItem(BarMenuItem menuItem) {
        this.menuItem = menuItem;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public BigDecimal getCurrentQuantity() {
        return currentQuantity;
    }

    public void setCurrentQuantity(BigDecimal currentQuantity) {
        this.currentQuantity = currentQuantity;
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

    public void setMinimumQuantity(BigDecimal minimumQuantity) {
        this.minimumQuantity = minimumQuantity;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}