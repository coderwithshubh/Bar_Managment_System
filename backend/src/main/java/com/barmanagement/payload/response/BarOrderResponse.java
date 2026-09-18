package com.barmanagement.payload.response;

import com.barmanagement.enums.BarOrderStatus;
import com.barmanagement.enums.BarOrderType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class BarOrderResponse {

    private Long id;

    private String orderNumber;

    private BarOrderType orderType;

    private BarOrderStatus status;

    private Long tableId;

    private String tableNumber;

    private BigDecimal subtotal;

    private BigDecimal discount;

    private BigDecimal tax;

    private BigDecimal grandTotal;

    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<BarOrderItemResponse> items;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public BarOrderType getOrderType() {
        return orderType;
    }

    public void setOrderType(BarOrderType orderType) {
        this.orderType = orderType;
    }

    public BarOrderStatus getStatus() {
        return status;
    }

    public void setStatus(BarOrderStatus status) {
        this.status = status;
    }

    public Long getTableId() {
        return tableId;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public BigDecimal getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(BigDecimal grandTotal) {
        this.grandTotal = grandTotal;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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

    public List<BarOrderItemResponse> getItems() {
        return items;
    }

    public void setItems(List<BarOrderItemResponse> items) {
        this.items = items;
    }
}