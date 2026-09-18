package com.barmanagement.security;

import com.barmanagement.model.User;
import com.barmanagement.repository.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public CustomUserDetailsService(
            UserRepository userRepository) {

        this.userRepository = userRepository;
    }


    // ==========================================
    // LOAD USER BY EMAIL
    // ==========================================

    @Override
    public UserDetails loadUserByUsername(
            String email)
            throws UsernameNotFoundException {

        // ------------------------------------------
        // Find User From Database
        // ------------------------------------------

        User user = userRepository.findByEmail(
                email.trim().toLowerCase()
        ).orElseThrow(() ->
                new UsernameNotFoundException(
                        "User not found with email: " + email
                )
        );


        // ------------------------------------------
        // Convert Our User Into Spring Security User
        // ------------------------------------------

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .disabled(!user.getActive())
                .build();
    }
}