package com.barmanagement.service.impl;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import com.barmanagement.enums.Role;
import com.barmanagement.model.User;
import com.barmanagement.payload.request.ChangePasswordRequest;
import com.barmanagement.payload.request.ForgotPasswordRequest;
import com.barmanagement.payload.request.LoginRequest;
import com.barmanagement.payload.request.RegisterRequest;
import com.barmanagement.payload.request.ResetPasswordRequest;
import com.barmanagement.payload.request.UpdateProfileRequest;
import com.barmanagement.payload.response.LoginResponse;
import com.barmanagement.payload.response.RegisterResponse;
import com.barmanagement.repository.UserRepository;
import com.barmanagement.security.JwtService;
import com.barmanagement.service.AuthService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;


    // ==========================================
    // OTP STORAGE
    // ==========================================

    /*
     * Stores OTP temporarily in application memory.
     *
     * Email -> OTP
     */
    private final Map<String, String> otpStorage =
            new ConcurrentHashMap<>();


    /*
     * Stores OTP expiry time.
     *
     * Email -> Expiry Time
     */
    private final Map<String, LocalDateTime> otpExpiryStorage =
            new ConcurrentHashMap<>();


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;

        this.passwordEncoder = passwordEncoder;

        this.jwtService = jwtService;
    }


    // ==========================================
    // REGISTER USER
    // ==========================================

    @Override
    public RegisterResponse register(
            RegisterRequest request) {

        if (request == null) {

            throw new RuntimeException(
                    "Registration request cannot be empty."
            );
        }


        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required."
            );
        }


        if (request.getPassword() == null ||
                request.getPassword().isEmpty()) {

            throw new RuntimeException(
                    "Password is required."
            );
        }


        if (request.getConfirmPassword() == null ||
                request.getConfirmPassword().isEmpty()) {

            throw new RuntimeException(
                    "Confirm password is required."
            );
        }


        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // ------------------------------------------
        // Check Email
        // ------------------------------------------

        if (userRepository.existsByEmail(email)) {

            throw new RuntimeException(
                    "Email is already registered."
            );
        }


        // ------------------------------------------
        // Check Password Confirmation
        // ------------------------------------------

        if (!request.getPassword().equals(
                request.getConfirmPassword())) {

            throw new RuntimeException(
                    "Password and confirm password do not match."
            );
        }


        // ------------------------------------------
        // Create User
        // ------------------------------------------

        User user = new User();


        user.setFullName(
                request.getFullName().trim()
        );


        user.setEmail(email);


        user.setMobileNumber(
                request.getMobileNumber().trim()
        );


        // ------------------------------------------
        // Encrypt Password
        // ------------------------------------------

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );


        // ------------------------------------------
        // Default Role
        // ------------------------------------------

        // Publicly registered users are NORMAL_USER
        user.setRole(Role.NORMAL_USER);

        user.setActive(true);


        // ------------------------------------------
        // Save User
        // ------------------------------------------

        User savedUser =
                userRepository.save(user);


        // ------------------------------------------
        // Registration Response
        // ------------------------------------------

        RegisterResponse response =
                new RegisterResponse();


        response.setId(
                savedUser.getId()
        );


        response.setFullName(
                savedUser.getFullName()
        );


        response.setEmail(
                savedUser.getEmail()
        );


        response.setMobileNumber(
                savedUser.getMobileNumber()
        );


        response.setRole(
                savedUser.getRole()
        );


        response.setActive(
                savedUser.getActive()
        );


        return response;
    }


    // ==========================================
    // LOGIN USER
    // ==========================================

    @Override
    public LoginResponse login(
            LoginRequest request) {

        if (request == null) {

            throw new RuntimeException(
                    "Login request cannot be empty."
            );
        }


        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required."
            );
        }


        if (request.getPassword() == null ||
                request.getPassword().isEmpty()) {

            throw new RuntimeException(
                    "Password is required."
            );
        }


        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // ------------------------------------------
        // Find User
        // ------------------------------------------

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid email or password."
                                )
                        );


        // ------------------------------------------
        // Check Account Status
        // ------------------------------------------

        if (!user.getActive()) {

            throw new RuntimeException(
                    "Your account is inactive."
            );
        }


        // ------------------------------------------
        // Check Password
        // ------------------------------------------

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );


        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid email or password."
            );
        }


        // ------------------------------------------
        // Generate JWT Token
        // ------------------------------------------

        String token =
                jwtService.generateToken(user);


        // ------------------------------------------
        // Login Response
        // ------------------------------------------

        LoginResponse response =
                new LoginResponse();


        response.setToken(token);


        response.setUserId(
                user.getId()
        );


        response.setFullName(
                user.getFullName()
        );


        response.setEmail(
                user.getEmail()
        );


        response.setMobileNumber(
                user.getMobileNumber()
        );


        response.setRole(
                user.getRole().name()
        );


        response.setActive(
                user.getActive()
        );


        return response;
    }


    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    @Override
    public LoginResponse updateProfile(
            UpdateProfileRequest request) {

        if (request == null) {
            throw new RuntimeException(
                    "Update profile request cannot be empty."
            );
        }

        if (request.getFullName() == null ||
                request.getFullName().trim().isEmpty()) {
            throw new RuntimeException(
                    "Full name is required."
            );
        }

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {
            throw new RuntimeException(
                    "Email is required."
            );
        }

        if (request.getMobileNumber() == null ||
                request.getMobileNumber().trim().isEmpty()) {
            throw new RuntimeException(
                    "Mobile number is required."
            );
        }

        String newEmail =
                request.getEmail().trim().toLowerCase();

        String fullName =
                request.getFullName().trim();

        String mobileNumber =
                request.getMobileNumber().trim();

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {
            throw new RuntimeException(
                    "User is not authenticated."
            );
        }

        String currentEmail =
                authentication.getName();

        if (currentEmail == null ||
                currentEmail.trim().isEmpty()) {
            throw new RuntimeException(
                    "Unable to identify logged-in user."
            );
        }

        currentEmail =
                currentEmail.trim().toLowerCase();

        User user =
                userRepository.findByEmail(currentEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User account not found."
                                )
                        );

        if (!user.getActive()) {
            throw new RuntimeException(
                    "Your account is inactive."
            );
        }

        if (!newEmail.equals(currentEmail) &&
                userRepository.existsByEmailAndIdNot(
                        newEmail,
                        user.getId()
                )) {
            throw new RuntimeException(
                    "Email is already registered by another account."
            );
        }

        user.setFullName(fullName);
        user.setEmail(newEmail);
        user.setMobileNumber(mobileNumber);

        User updatedUser =
                userRepository.save(user);

        String token =
                jwtService.generateToken(updatedUser);

        LoginResponse response =
                new LoginResponse();

        response.setToken(token);
        response.setUserId(updatedUser.getId());
        response.setFullName(updatedUser.getFullName());
        response.setEmail(updatedUser.getEmail());
        response.setMobileNumber(updatedUser.getMobileNumber());
        response.setRole(updatedUser.getRole().name());
        response.setActive(updatedUser.getActive());

        return response;
    }


    // ==========================================
    // FORGOT PASSWORD
    // ==========================================

    @Override
    public void forgotPassword(
            ForgotPasswordRequest request) {

        if (request == null) {

            throw new RuntimeException(
                    "Forgot password request cannot be empty."
            );
        }


        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required."
            );
        }


        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // ------------------------------------------
        // Find Registered User
        // ------------------------------------------

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No account found with this email."
                                )
                        );


        // ------------------------------------------
        // Generate 6 Digit OTP
        // ------------------------------------------

        Random random = new Random();


        String otp =
                String.format(
                        "%06d",
                        random.nextInt(1000000)
                );


        // ------------------------------------------
        // OTP Valid For 15 Minutes
        // ------------------------------------------

        LocalDateTime expiryTime =
                LocalDateTime.now()
                        .plusMinutes(15);


        // ------------------------------------------
        // Store OTP In Memory
        // ------------------------------------------

        otpStorage.put(
                email,
                otp
        );


        otpExpiryStorage.put(
                email,
                expiryTime
        );


        // ------------------------------------------
        // Print OTP In Backend Terminal
        // ------------------------------------------

        System.out.println();

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "          PASSWORD RESET OTP"
        );

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "Email       : " + user.getEmail()
        );

        System.out.println(
                "OTP         : " + otp
        );

        System.out.println(
                "Valid Until : " + expiryTime
        );

        System.out.println(
                "=========================================="
        );

        System.out.println();
    }


    // ==========================================
    // RESET PASSWORD
    // ==========================================

    @Override
    public void resetPassword(
            ResetPasswordRequest request) {

        if (request == null) {

            throw new RuntimeException(
                    "Reset password request cannot be empty."
            );
        }


        // ------------------------------------------
        // Check Email
        // ------------------------------------------

        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            throw new RuntimeException(
                    "Email is required."
            );
        }


        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();


        // ------------------------------------------
        // Check OTP
        // ------------------------------------------

        if (request.getToken() == null ||
                request.getToken().trim().isEmpty()) {

            throw new RuntimeException(
                    "OTP is required."
            );
        }


        String enteredOtp =
                request.getToken().trim();


        // ------------------------------------------
        // Check OTP Format
        // ------------------------------------------

        if (!enteredOtp.matches("\\d{6}")) {

            throw new RuntimeException(
                    "OTP must contain exactly 6 digits."
            );
        }


        // ------------------------------------------
        // Get Stored OTP
        // ------------------------------------------

        String storedOtp =
                otpStorage.get(email);


        if (storedOtp == null) {

            throw new RuntimeException(
                    "OTP not found. Please request a new OTP."
            );
        }


        // ------------------------------------------
        // Get OTP Expiry
        // ------------------------------------------

        LocalDateTime expiryTime =
                otpExpiryStorage.get(email);


        if (expiryTime == null) {

            otpStorage.remove(email);

            otpExpiryStorage.remove(email);

            throw new RuntimeException(
                    "OTP information not found. Please request a new OTP."
            );
        }


        // ------------------------------------------
        // Check OTP Expired
        // ------------------------------------------

        if (expiryTime.isBefore(
                LocalDateTime.now()
        )) {

            otpStorage.remove(email);

            otpExpiryStorage.remove(email);

            throw new RuntimeException(
                    "OTP has expired. Please request a new OTP."
            );
        }


        // ------------------------------------------
        // Verify OTP
        // ------------------------------------------

        if (!storedOtp.equals(enteredOtp)) {

            throw new RuntimeException(
                    "Invalid OTP. Please enter the correct OTP."
            );
        }


        // ------------------------------------------
        // Check New Password
        // ------------------------------------------

        if (request.getNewPassword() == null ||
                request.getNewPassword().isEmpty()) {

            throw new RuntimeException(
                    "New password is required."
            );
        }


        if (request.getConfirmPassword() == null ||
                request.getConfirmPassword().isEmpty()) {

            throw new RuntimeException(
                    "Confirm password is required."
            );
        }


        // ------------------------------------------
        // Check Password Confirmation
        // ------------------------------------------

        if (!request.getNewPassword().equals(
                request.getConfirmPassword())) {

            throw new RuntimeException(
                    "New password and confirm password do not match."
            );
        }


        // ------------------------------------------
        // Find User
        // ------------------------------------------

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        );


        // ------------------------------------------
        // Encrypt New Password
        // ------------------------------------------

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );


        // ------------------------------------------
        // Save Updated User
        // ------------------------------------------

        userRepository.save(user);


        // ------------------------------------------
        // Remove OTP
        // ------------------------------------------

        otpStorage.remove(email);

        otpExpiryStorage.remove(email);


        // ------------------------------------------
        // Success Message
        // ------------------------------------------

        System.out.println();

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "       PASSWORD RESET SUCCESSFUL"
        );

        System.out.println(
                "Email : " + email
        );

        System.out.println(
                "=========================================="
        );

        System.out.println();
    }


    // ==========================================
    // CHANGE PASSWORD
    // ==========================================

    @Override
    public void changePassword(
            ChangePasswordRequest request) {

        if (request == null) {

            throw new RuntimeException(
                    "Change password request cannot be empty."
            );
        }


        // ------------------------------------------
        // Get Authentication
        // ------------------------------------------

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated."
            );
        }


        // ------------------------------------------
        // Get Logged-In User Email From JWT
        // ------------------------------------------

        String email =
                authentication.getName();


        if (email == null ||
                email.trim().isEmpty()) {

            throw new RuntimeException(
                    "Unable to identify logged-in user."
            );
        }


        email =
                email.trim().toLowerCase();


        // ------------------------------------------
        // Find User
        // ------------------------------------------

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User account not found."
                                )
                        );


        // ------------------------------------------
        // Check Account
        // ------------------------------------------

        if (!user.getActive()) {

            throw new RuntimeException(
                    "Your account is inactive."
            );
        }


        // ------------------------------------------
        // Check Current Password
        // ------------------------------------------

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "Current password is incorrect."
            );
        }


        // ------------------------------------------
        // Check New Password
        // ------------------------------------------

        if (request.getNewPassword() == null ||
                request.getNewPassword().trim().isEmpty()) {

            throw new RuntimeException(
                    "New password is required."
            );
        }


        if (request.getNewPassword().length() < 8) {

            throw new RuntimeException(
                    "New password must contain at least 8 characters."
            );
        }


        // ------------------------------------------
        // Prevent Same Password
        // ------------------------------------------

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "New password must be different from current password."
            );
        }


        // ------------------------------------------
        // Check Confirm Password
        // ------------------------------------------

        if (request.getConfirmPassword() == null ||
                request.getConfirmPassword().trim().isEmpty()) {

            throw new RuntimeException(
                    "Confirm password is required."
            );
        }


        if (!request.getNewPassword().equals(
                request.getConfirmPassword()
        )) {

            throw new RuntimeException(
                    "New password and confirm password do not match."
            );
        }


        // ------------------------------------------
        // Encode New Password
        // ------------------------------------------

        String encodedPassword =
                passwordEncoder.encode(
                        request.getNewPassword()
                );


        user.setPassword(
                encodedPassword
        );


        // ------------------------------------------
        // Save User
        // ------------------------------------------

        userRepository.save(user);


        // ------------------------------------------
        // Success Log
        // ------------------------------------------

        System.out.println();

        System.out.println(
                "=========================================="
        );

        System.out.println(
                "       PASSWORD CHANGE SUCCESSFUL"
        );

        System.out.println(
                "Email : " + email
        );

        System.out.println(
                "=========================================="
        );

        System.out.println();
    }
}