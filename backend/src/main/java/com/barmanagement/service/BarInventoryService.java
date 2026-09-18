package com.barmanagement.service;

import com.barmanagement.payload.request.BarInventoryRequest;
import com.barmanagement.payload.response.BarInventoryResponse;

import java.math.BigDecimal;
import java.util.List;

public interface BarInventoryService {

    // =====================================================
    // CREATE
    // =====================================================

    BarInventoryResponse createInventory(
            BarInventoryRequest request
    );


    // =====================================================
    // GET ALL
    // =====================================================

    List<BarInventoryResponse> getAllInventory();


    // =====================================================
    // GET ACTIVE
    // =====================================================

    List<BarInventoryResponse> getActiveInventory();


    // =====================================================
    // GET BY ID
    // =====================================================

    BarInventoryResponse getInventoryById(
            Long id
    );


    // =====================================================
    // GET BY MENU ITEM
    // =====================================================

    BarInventoryResponse getInventoryByMenuItem(
            Long menuItemId
    );


    // =====================================================
    // GET BY QR CODE
    // =====================================================

    BarInventoryResponse getInventoryByQrCode(
            String qrCode
    );


    // =====================================================
    // UPDATE MINIMUM QUANTITY
    // =====================================================

    BarInventoryResponse updateMinimumQuantity(
            Long id,
            BigDecimal minimumQuantity
    );


    // =====================================================
    // ACTIVATE
    // =====================================================

    BarInventoryResponse activateInventory(
            Long id
    );


    // =====================================================
    // DEACTIVATE
    // =====================================================

    BarInventoryResponse deactivateInventory(
            Long id
    );


    // =====================================================
    // DELETE
    // =====================================================

    void deleteInventory(
            Long id
    );
}