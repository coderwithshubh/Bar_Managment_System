package com.barmanagement.repository;

import com.barmanagement.enums.InventoryTransactionType;
import com.barmanagement.model.BarInventoryTransaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BarInventoryTransactionRepository
        extends JpaRepository<
                BarInventoryTransaction,
                Long> {

    // =====================================================
    // BY INVENTORY
    // =====================================================

    List<BarInventoryTransaction>
    findByInventoryIdOrderByCreatedAtDesc(
            Long inventoryId
    );


    // =====================================================
    // BY TRANSACTION TYPE
    // =====================================================

    List<BarInventoryTransaction>
    findByTransactionTypeOrderByCreatedAtDesc(
            InventoryTransactionType transactionType
    );


    // =====================================================
    // BY INVENTORY AND TYPE
    // =====================================================

    List<BarInventoryTransaction>
    findByInventoryIdAndTransactionTypeOrderByCreatedAtDesc(
            Long inventoryId,
            InventoryTransactionType transactionType
    );


    // =====================================================
    // CHECK TRANSACTION HISTORY
    // =====================================================

    boolean existsByInventoryId(
            Long inventoryId
    );
}