package com.barmanagement.repository;

import com.barmanagement.model.BarTable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BarTableRepository
        extends JpaRepository<BarTable, Long> {


    // ==========================================
    // FIND BY TABLE NUMBER
    // ==========================================

    Optional<BarTable> findByTableNumber(
            String tableNumber
    );


    // ==========================================
    // CHECK TABLE NUMBER
    // ==========================================

    boolean existsByTableNumber(
            String tableNumber
    );


    // ==========================================
    // ACTIVE TABLES
    // ==========================================

    List<BarTable> findByActiveTrue();


    // ==========================================
    // TABLES BY STATUS
    // ==========================================

    List<BarTable> findByStatus(
            BarTable.Status status
    );


    // ==========================================
    // TABLES BY ZONE
    // ==========================================

    List<BarTable> findByZone(
            BarTable.Zone zone
    );


    // ==========================================
    // ACTIVE TABLES BY ZONE
    // ==========================================

    List<BarTable> findByZoneAndActiveTrue(
            BarTable.Zone zone
    );


    // ==========================================
    // ACTIVE TABLES BY STATUS
    // ==========================================

    List<BarTable> findByStatusAndActiveTrue(
            BarTable.Status status
    );
}