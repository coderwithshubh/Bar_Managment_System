package com.barmanagement.payload.request;

import com.barmanagement.enums.BarOrderType;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class BarOrderRequest {

    @NotNull(message = "Order type is required")
    private BarOrderType orderType;

    private Long tableId;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<BarOrderItemRequest> items;

    private BigDecimal discount;

    private String notes;

    public BarOrderType getOrderType() {
        return orderType;
    }

    public void setOrderType(BarOrderType orderType) {
        this.orderType = orderType;
    }

    public Long getTableId() {
        return tableId;
    }

    public void setTableId(Long tableId) {
        this.tableId = tableId;
    }

    public List<BarOrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<BarOrderItemRequest> items) {
        this.items = items;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}