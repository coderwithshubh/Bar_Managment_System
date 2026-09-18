package com.barmanagement.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    // ==========================================
    // PRIMARY KEY
    // ==========================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // ==========================================
    // RESET TOKEN
    // ==========================================

    @Column(nullable = false, unique = true, length = 255)
    private String token;


    // ==========================================
    // USER
    // ==========================================

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;


    // ==========================================
    // EXPIRATION
    // ==========================================

    @Column(nullable = false)
    private LocalDateTime expiryDate;


    // ==========================================
    // USED STATUS
    // ==========================================

    @Column(nullable = false)
    private boolean used = false;


    // ==========================================
    // CONSTRUCTORS
    // ==========================================

    public PasswordResetToken() {
    }


    public PasswordResetToken(
            String token,
            User user,
            LocalDateTime expiryDate) {

        this.token = token;
        this.user = user;
        this.expiryDate = expiryDate;
        this.used = false;
    }


    // ==========================================
    // GETTERS AND SETTERS
    // ==========================================

    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getToken() {
        return token;
    }


    public void setToken(String token) {
        this.token = token;
    }


    public User getUser() {
        return user;
    }


    public void setUser(User user) {
        this.user = user;
    }


    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }


    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }


    public boolean isUsed() {
        return used;
    }


    public void setUsed(boolean used) {
        this.used = used;
    }
}