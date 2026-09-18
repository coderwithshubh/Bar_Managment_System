package com.barmanagement.model;

import com.barmanagement.enums.BarSellingUnit;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "bar_menu_items",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_bar_menu_item_code",
            columnNames = "item_code"
        ),
        @UniqueConstraint(
            name = "uk_bar_menu_item_name",
            columnNames = "item_name"
        )
    }
)
public class BarMenuItem {

    // ==========================================
    // PRIMARY KEY
    // ==========================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // ITEM CODE
    // ==========================================

    @Column(
        name = "item_code",
        nullable = false,
        unique = true,
        length = 30
    )
    private String itemCode;


    // ==========================================
    // ITEM NAME
    // ==========================================

    @Column(
        name = "item_name",
        nullable = false,
        unique = true,
        length = 150
    )
    private String itemName;


    // ==========================================
    // CATEGORY
    // ==========================================

    @ManyToOne(
        fetch = FetchType.LAZY,
        optional = false
    )
    @JoinColumn(
        name = "category_id",
        nullable = false,
        foreignKey = @ForeignKey(
            name = "fk_bar_menu_item_category"
        )
    )
    private BarCategory category;


    // ==========================================
    // DESCRIPTION
    // ==========================================

    @Column(
        name = "description",
        length = 500
    )
    private String description;


    // ==========================================
    // PRICE
    // ==========================================

    @Column(
        nullable = false,
        precision = 10,
        scale = 2
    )
    private BigDecimal price;


    // ==========================================
    // SELLING UNIT
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(
        name = "selling_unit",
        nullable = false,
        length = 20
    )
    private BarSellingUnit sellingUnit;


    // ==========================================
    // CONSUMPTION QUANTITY
    // ==========================================

    @Column(
        name = "consumption_quantity",
        nullable = false,
        precision = 12,
        scale = 3
    )
    private BigDecimal consumptionQuantity;


    // ==========================================
    // ACTIVE STATUS
    // ==========================================

    @Column(nullable = false)
    private Boolean active = true;


    // ==========================================
    // DISPLAY ORDER
    // ==========================================

    @Column(
        name = "display_order",
        nullable = false
    )
    private Integer displayOrder = 0;


    // ==========================================
    // CREATED AT
    // ==========================================

    @Column(
        name = "created_at",
        nullable = false,
        updatable = false
    )
    private LocalDateTime createdAt;


    // ==========================================
    // UPDATED AT
    // ==========================================

    @Column(
        name = "updated_at",
        nullable = false
    )
    private LocalDateTime updatedAt;


    // ==========================================
    // DEFAULT CONSTRUCTOR
    // ==========================================

    public BarMenuItem() {
    }


    // ==========================================
    // PRE PERSIST
    // ==========================================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (active == null) {
            active = true;
        }

        if (displayOrder == null) {
            displayOrder = 0;
        }

        if (price == null) {
            price = BigDecimal.ZERO;
        }

        if (consumptionQuantity == null) {
            consumptionQuantity = BigDecimal.ZERO;
        }
    }


    // ==========================================
    // PRE UPDATE
    // ==========================================

    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
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


    public BarCategory getCategory() {
        return category;
    }

    public void setCategory(BarCategory category) {
        this.category = category;
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