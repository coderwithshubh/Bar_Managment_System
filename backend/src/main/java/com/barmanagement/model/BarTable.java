package com.barmanagement.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "bar_tables",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_bar_table_number",
            columnNames = "table_number"
        )
    }
)
public class BarTable {

    // ==========================================
    // ID
    // ==========================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // TABLE NUMBER
    // ==========================================

    @Column(
        name = "table_number",
        nullable = false,
        length = 20
    )
    private String tableNumber;


    // ==========================================
    // TABLE NAME
    // ==========================================

    @Column(
        name = "name",
        nullable = false,
        length = 100
    )
    private String name;


    // ==========================================
    // CAPACITY
    // ==========================================

    @Column(
        name = "capacity",
        nullable = false
    )
    private Integer capacity;


    // ==========================================
    // ZONE
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(
        name = "zone",
        nullable = false,
        length = 20
    )
    private Zone zone;


    // ==========================================
    // STATUS
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(
        name = "status",
        nullable = false,
        length = 20
    )
    private Status status;


    // ==========================================
    // ACTIVE
    // ==========================================

    @Column(
        name = "active",
        nullable = false
    )
    private Boolean active = true;


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
    // ENUMS
    // ==========================================

    public enum Zone {

        COUNTER,
        LOUNGE,
        VIP,
        OUTDOOR
    }


    public enum Status {

        AVAILABLE,
        OCCUPIED,
        RESERVED,
        CLEANING
    }


    // ==========================================
    // PRE PERSIST
    // ==========================================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status = Status.AVAILABLE;
        }

        if (active == null) {
            active = true;
        }
    }


    // ==========================================
    // PRE UPDATE
    // ==========================================

    @PreUpdate
    protected void onUpdate() {

        updatedAt =
                LocalDateTime.now();
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


    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }


    public Zone getZone() {
        return zone;
    }

    public void setZone(Zone zone) {
        this.zone = zone;
    }


    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
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