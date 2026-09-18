package com.barmanagement.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.barmanagement.model.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expiration;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration) {

        this.secretKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

        this.expiration = expiration;
    }


    // ==========================================
    // GENERATE JWT TOKEN
    // ==========================================

    public String generateToken(User user) {

        Date issuedAt = new Date();

        Date expirationDate =
                new Date(issuedAt.getTime() + expiration);

        return Jwts.builder()

                .subject(user.getEmail())

                .claim("userId", user.getId())

                .claim("fullName", user.getFullName())

                .claim("role", user.getRole().name())

                .issuedAt(issuedAt)

                .expiration(expirationDate)

                .signWith(secretKey)

                .compact();
    }


    // ==========================================
    // EXTRACT EMAIL
    // ==========================================

    public String extractEmail(String token) {

        return extractAllClaims(token)
                .getSubject();
    }


    // ==========================================
    // EXTRACT ALL CLAIMS
    // ==========================================

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    // ==========================================
    // VALIDATE TOKEN
    // ==========================================

    public boolean isTokenValid(
            String token,
            String email) {

        try {

            String tokenEmail =
                    extractEmail(token);

            return tokenEmail.equals(email)
                    && !isTokenExpired(token);

        } catch (Exception exception) {

            return false;
        }
    }


    // ==========================================
    // CHECK TOKEN EXPIRATION
    // ==========================================

    private boolean isTokenExpired(String token) {

        Date expirationDate =
                extractAllClaims(token)
                        .getExpiration();

        return expirationDate.before(
                new Date()
        );
    }
}