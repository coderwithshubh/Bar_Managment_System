package com.barmanagement.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ResetPasswordRequest {

    // ==========================================
    // EMAIL
    // ==========================================

    @NotBlank(message = "Email is required.")
    @Email(message = "Please enter a valid email address.")
    private String email;


    // ==========================================
    // OTP
    // ==========================================

    @NotBlank(message = "OTP is required.")
    @Size(min = 6, max = 6, message = "OTP must contain exactly 6 digits.")
    private String token;


    // ==========================================
    // NEW PASSWORD
    // ==========================================

    @NotBlank(message = "New password is required.")
    @Size(min = 8, message = "Password must contain at least 8 characters.")
    private String newPassword;


    // ==========================================
    // CONFIRM PASSWORD
    // ==========================================

    @NotBlank(message = "Confirm password is required.")
    private String confirmPassword;


    // ==========================================
    // GET EMAIL
    // ==========================================

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    // ==========================================
    // GET OTP
    // ==========================================

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }


    // ==========================================
    // GET NEW PASSWORD
    // ==========================================

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }


    // ==========================================
    // GET CONFIRM PASSWORD
    // ==========================================

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}