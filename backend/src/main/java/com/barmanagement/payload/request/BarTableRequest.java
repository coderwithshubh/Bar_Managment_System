package com.barmanagement.payload.request;

public class BarTableRequest {

    private String tableNumber;

    private String name;

    private Integer capacity;

    private String zone;


    // ==========================================
    // GETTERS
    // ==========================================

    public String getTableNumber() {
        return tableNumber;
    }

    public String getName() {
        return name;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public String getZone() {
        return zone;
    }


    // ==========================================
    // SETTERS
    // ==========================================

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }
}