package com.barmanagement.repository;

import com.barmanagement.enums.BarBillStatus;
import com.barmanagement.model.BarBill;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BarBillRepository
        extends JpaRepository<BarBill, Long> {

    // =====================================================
    // FIND BY BILL NUMBER
    // =====================================================

    Optional<BarBill> findByBillNumber(
            String billNumber
    );

    // =====================================================
    // CHECK DUPLICATE BILL NUMBER
    // =====================================================

    boolean existsByBillNumber(
            String billNumber
    );

    // =====================================================
    // FIND BILL BY ORDER
    // One order should have one bill
    // =====================================================

    Optional<BarBill> findByOrderId(
            Long orderId
    );

    // =====================================================
    // CHECK WHETHER ORDER ALREADY HAS A BILL
    // =====================================================

    boolean existsByOrderId(
            Long orderId
    );

    // =====================================================
    // GET ALL BILLS - LATEST FIRST
    // =====================================================

    List<BarBill> findAllByOrderByCreatedAtDesc();

    // =====================================================
    // GET BILLS BY PAYMENT STATUS
    // =====================================================

    List<BarBill>
    findByPaymentStatusOrderByCreatedAtDesc(
            BarBillStatus paymentStatus
    );
}