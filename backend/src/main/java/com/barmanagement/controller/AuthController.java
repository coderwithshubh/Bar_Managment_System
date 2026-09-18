package com.barmanagement.controller;

import com.barmanagement.payload.request.ChangePasswordRequest;
import com.barmanagement.payload.request.ForgotPasswordRequest;
import com.barmanagement.payload.request.LoginRequest;
import com.barmanagement.payload.request.RegisterRequest;
import com.barmanagement.payload.request.ResetPasswordRequest;
import com.barmanagement.payload.request.UpdateProfileRequest;
import com.barmanagement.payload.response.LoginResponse;
import com.barmanagement.payload.response.RegisterResponse;
import com.barmanagement.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174"
        }
)
public class AuthController {

    private final AuthService authService;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    // =====================================================
    // REGISTER
    // =====================================================

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        RegisterResponse response =
                authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response =
                authService.login(request);

        return ResponseEntity.ok(response);
    }


    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    @PutMapping("/profile")
    public ResponseEntity<LoginResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request) {

        LoginResponse response =
                authService.updateProfile(request);

        return ResponseEntity.ok(response);
    }


    // =====================================================
    // FORGOT PASSWORD
    // =====================================================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(request);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "message",
                        "OTP generated successfully."
                )
        );
    }


    // =====================================================
    // RESET PASSWORD
    // =====================================================

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(request);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "message",
                        "Password reset successfully."
                )
        );
    }


    // =====================================================
    // CHANGE PASSWORD
    // =====================================================

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {

        authService.changePassword(request);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "message",
                        "Password changed successfully."
                )
        );
    }
}