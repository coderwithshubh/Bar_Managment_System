package com.barmanagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.barmanagement.model.PasswordResetToken;

@Repository
public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    // ==========================================
    // FIND TOKEN
    // ==========================================

    Optional<PasswordResetToken> findByToken(String token);


    // ==========================================
    // CHECK TOKEN EXISTS
    // ==========================================

    boolean existsByToken(String token);
}