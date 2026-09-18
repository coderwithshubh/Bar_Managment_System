package com.barmanagement.security;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // No Authorization header
        if (authHeader == null || authHeader.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        // Authorization header is not Bearer token
        if (!authHeader.startsWith("Bearer ")) {
            sendUnauthorized(response, "Invalid Authorization header.");
            return;
        }

        String jwt = authHeader.substring(7).trim();

        // Empty JWT
        if (jwt.isEmpty()) {
            sendUnauthorized(response, "JWT token is missing.");
            return;
        }

        String email;

        // Extract email from JWT
        try {
            email = jwtService.extractEmail(jwt);
        } catch (Exception exception) {

            System.out.println(
                    "JWT extraction failed: "
                            + exception.getMessage()
            );

            sendUnauthorized(response, "Invalid or expired JWT token.");
            return;
        }

        // Authenticate user
        if (email != null
                && SecurityContextHolder
                        .getContext()
                        .getAuthentication() == null) {

            UserDetails userDetails;

            try {

                userDetails =
                        userDetailsService
                                .loadUserByUsername(email);

            } catch (Exception exception) {

                System.out.println(
                        "User loading failed: "
                                + exception.getMessage()
                );

                sendUnauthorized(response, "User not found.");
                return;
            }

            // Check whether user is enabled
            if (!userDetails.isEnabled()) {
                sendForbidden(response, "User account is disabled.");
                return;
            }

            // Validate JWT
            boolean validToken;

            try {

                validToken =
                        jwtService.isTokenValid(
                                jwt,
                                userDetails.getUsername()
                        );

            } catch (Exception exception) {

                System.out.println(
                        "JWT validation failed: "
                                + exception.getMessage()
                );

                sendUnauthorized(
                        response,
                        "Invalid JWT token."
                );

                return;
            }

            if (!validToken) {

                sendUnauthorized(
                        response,
                        "Invalid or expired JWT token."
                );

                return;
            }

            // Create authenticated user
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            System.out.println(
                    "JWT authentication successful for: "
                            + email
            );

            System.out.println(
                    "Authorities: "
                            + userDetails.getAuthorities()
            );
        }

        filterChain.doFilter(request, response);
    }

    private void sendUnauthorized(
            HttpServletResponse response,
            String message)
            throws IOException {

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");

        response.getWriter().write(
                "{\"message\":\"" + message + "\"}"
        );
    }

    private void sendForbidden(
            HttpServletResponse response,
            String message)
            throws IOException {

        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.setContentType("application/json");

        response.getWriter().write(
                "{\"message\":\"" + message + "\"}"
        );
    }
}