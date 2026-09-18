package com.barmanagement.service;

import com.barmanagement.payload.request.ChangePasswordRequest;
import com.barmanagement.payload.request.ForgotPasswordRequest;
import com.barmanagement.payload.request.LoginRequest;
import com.barmanagement.payload.request.RegisterRequest;
import com.barmanagement.payload.request.ResetPasswordRequest;
import com.barmanagement.payload.request.UpdateProfileRequest;
import com.barmanagement.payload.response.LoginResponse;
import com.barmanagement.payload.response.RegisterResponse;

public interface AuthService {

    // ==========================================
    // REGISTER
    // ==========================================

    RegisterResponse register(RegisterRequest request);

    // ==========================================
    // LOGIN
    // ==========================================

    LoginResponse login(LoginRequest request);

    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    LoginResponse updateProfile(UpdateProfileRequest request);

    // ==========================================
    // FORGOT PASSWORD
    // ==========================================

    void forgotPassword(ForgotPasswordRequest request);

    // ==========================================
    // RESET PASSWORD
    // ==========================================

    void resetPassword(ResetPasswordRequest request);

    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    void changePassword(ChangePasswordRequest request);
}