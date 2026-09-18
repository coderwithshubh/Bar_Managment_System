package com.barmanagement.repository;

import com.barmanagement.model.BarMenuItem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BarMenuItemRepository
        extends JpaRepository<BarMenuItem, Long> {


    // ==========================================
    // FIND BY ITEM CODE
    // ==========================================

    Optional<BarMenuItem> findByItemCode(
            String itemCode
    );


    // ==========================================
    // FIND BY ITEM NAME
    // ==========================================

    Optional<BarMenuItem> findByItemNameIgnoreCase(
            String itemName
    );


    // ==========================================
    // CHECK DUPLICATE ITEM CODE
    // ==========================================

    boolean existsByItemCode(
            String itemCode
    );


    // ==========================================
    // CHECK DUPLICATE ITEM NAME
    // ==========================================

    boolean existsByItemNameIgnoreCase(
            String itemName
    );


    // ==========================================
    // GET ALL ITEMS
    // ==========================================

    List<BarMenuItem>
    findAllByOrderByDisplayOrderAscItemNameAsc();


    // ==========================================
    // GET ACTIVE ITEMS
    // ==========================================

    List<BarMenuItem>
    findByActiveTrueOrderByDisplayOrderAscItemNameAsc();


    // ==========================================
    // GET ITEMS BY CATEGORY
    // ==========================================

    List<BarMenuItem>
    findByCategoryIdOrderByDisplayOrderAscItemNameAsc(
            Long categoryId
    );


    // ==========================================
    // GET ACTIVE ITEMS BY CATEGORY
    // ==========================================

    List<BarMenuItem>
    findByCategoryIdAndActiveTrueOrderByDisplayOrderAscItemNameAsc(
            Long categoryId
    );


    // ==========================================
    // GET ITEMS BY ACTIVE STATUS
    // ==========================================

    List<BarMenuItem>
    findByActiveOrderByDisplayOrderAscItemNameAsc(
            Boolean active
    );
}