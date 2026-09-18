package com.barmanagement.repository;

import com.barmanagement.model.BarInventory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BarInventoryRepository
        extends JpaRepository<BarInventory, Long> {

    // =====================================================
    // FIND BY MENU ITEM
    // =====================================================

    Optional<BarInventory> findByMenuItemId(
            Long menuItemId
    );


    // =====================================================
    // CHECK DUPLICATE
    // =====================================================

    boolean existsByMenuItemId(
            Long menuItemId
    );


    // =====================================================
    // FIND / CHECK BY QR CODE
    // =====================================================

    Optional<BarInventory> findByQrCode(String qrCode);

    boolean existsByQrCode(String qrCode);


    // =====================================================
    // ACTIVE INVENTORY
    // =====================================================

    List<BarInventory>
    findByActiveTrueOrderByMenuItemItemNameAsc();


    // =====================================================
    // INVENTORY BY STATUS
    // =====================================================

    List<BarInventory>
    findByActiveOrderByMenuItemItemNameAsc(
            Boolean active
    );
}