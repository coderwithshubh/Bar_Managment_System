package com.barmanagement.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }


    // =====================================================
    // CORS CONFIGURATION
    // =====================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        "http://localhost:5174",
                        "https://bar-managment-system-pi.vercel.app"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                // =================================================
                // CORS
                // =================================================

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )


                // =================================================
                // CSRF
                // =================================================

                .csrf(csrf ->
                        csrf.disable()
                )


                // =================================================
                // STATELESS SESSION
                // =================================================

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // =================================================
                // AUTHORIZATION
                // =================================================

                .authorizeHttpRequests(auth -> auth

                        // -------------------------------------------------
                        // CORS PREFLIGHT
                        // -------------------------------------------------

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()


                        // -------------------------------------------------
                        // PUBLIC AUTHENTICATION ENDPOINTS
                        // -------------------------------------------------

                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password"
                        )
                        .permitAll()


                        // -------------------------------------------------
                        // TEST - ADMIN ONLY
                        // -------------------------------------------------

                        .requestMatchers(
                                "/api/test/admin"
                        )
                        .hasRole("ADMIN")


                        // -------------------------------------------------
                        // TEST - BARTENDER ONLY
                        // -------------------------------------------------

                        .requestMatchers(
                                "/api/test/bartender"
                        )
                        .hasRole("BARTENDER")


                        // =================================================
                        // PROFILE UPDATE
                        // =================================================
                        //
                        // Logged-in user can update their own profile.
                        //
                        // This MUST come before the generic
                        // PUT /api/** rule.
                        //
                        // =================================================

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/auth/profile"
                        )
                        .authenticated()


                        // =================================================
                        // REPORTS
                        // =================================================
                        //
                        // Reports contain business/financial information.
                        //
                        // ADMIN       -> allowed
                        // BAR_MANAGER -> allowed
                        // BARTENDER   -> denied
                        // CASHIER     -> denied
                        // NORMAL_USER -> denied
                        //
                        // =================================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/bar/reports/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "BAR_MANAGER"
                        )


                        // =================================================
                        // READ OPERATIONS
                        // =================================================
                        //
                        // Authenticated users can access GET APIs.
                        //
                        // =================================================

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/**"
                        )
                        .authenticated()


                        // =================================================
                        // CREATE OPERATIONS
                        // =================================================
                        //
                        // Only ADMIN and BAR_MANAGER can create data.
                        //
                        // =================================================

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "BAR_MANAGER"
                        )


                        // =================================================
                        // UPDATE OPERATIONS
                        // =================================================
                        //
                        // Profile update is already handled above.
                        //
                        // Other PUT operations require
                        // ADMIN or BAR_MANAGER.
                        //
                        // =================================================

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "BAR_MANAGER"
                        )


                        // =================================================
                        // PARTIAL UPDATE OPERATIONS
                        // =================================================

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "BAR_MANAGER"
                        )


                        // =================================================
                        // DELETE OPERATIONS
                        // =================================================

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "BAR_MANAGER"
                        )


                        // -------------------------------------------------
                        // FALLBACK
                        // -------------------------------------------------

                        .anyRequest()
                        .authenticated()
                )


                // =====================================================
                // JWT AUTHENTICATION FILTER
                // =====================================================

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}