package com.barmanagement.model;

import com.barmanagement.enums.Role;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "users",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_users_email",
            columnNames = "email"
        )
    }
)
public class User {

    // ==========================================
    // Primary Key
    // ==========================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // Full Name
    // ==========================================

    @Column(
        name = "full_name",
        nullable = false,
        length = 100
    )
    private String fullName;


    // ==========================================
    // Email
    // ==========================================

    @Column(
        nullable = false,
        length = 150
    )
    private String email;


    // ==========================================
    // Mobile Number
    // ==========================================

    @Column(
        name = "mobile_number",
        nullable = false,
        length = 15
    )
    private String mobileNumber;


    // ==========================================
    // Password
    // ==========================================

    @Column(
        nullable = false
    )
    private String password;


    // ==========================================
    // Role
    // ==========================================

    @Enumerated(EnumType.STRING)
    @Column(
        nullable = false,
        length = 30
    )
    private Role role;


    // ==========================================
    // Active Status
    // ==========================================

    @Column(
        nullable = false
    )
    private Boolean active = true;


    // ==========================================
    // Created At
    // ==========================================

    @Column(
        name = "created_at",
        nullable = false,
        updatable = false
    )
    private LocalDateTime createdAt;


    // ==========================================
    // Updated At
    // ==========================================

    @Column(
        name = "updated_at",
        nullable = false
    )
    private LocalDateTime updatedAt;


    // ==========================================
    // Default Constructor
    // ==========================================

    public User() {
    }


    // ==========================================
    // Pre Persist
    // ==========================================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now = LocalDateTime.now();

        createdAt = now;
        updatedAt = now;

        if (active == null) {
            active = true;
        }

        if (role == null) {
            role = Role.BARTENDER;
        }
    }


    // ==========================================
    // Pre Update
    // ==========================================

    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
    }


    // ==========================================
    // Getters and Setters
    // ==========================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
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