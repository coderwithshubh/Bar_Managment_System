package com.barmanagement.service;

import com.barmanagement.enums.InventoryTransactionType;
import com.barmanagement.payload.request.BarInventoryTransactionRequest;
import com.barmanagement.payload.response.BarInventoryTransactionResponse;

import java.util.List;

public interface BarInventoryTransactionService {

    // =====================================================
    // CREATE TRANSACTION
    // =====================================================

    BarInventoryTransactionResponse createTransaction(
            BarInventoryTransactionRequest request
    );


    // =====================================================
    // GET TRANSACTION BY ID
    // =====================================================

    BarInventoryTransactionResponse getTransactionById(
            Long id
    );


    // =====================================================
    // GET ALL TRANSACTIONS
    // =====================================================

    List<BarInventoryTransactionResponse> getAllTransactions();


    // =====================================================
    // GET TRANSACTIONS BY INVENTORY
    // =====================================================

    List<BarInventoryTransactionResponse>
    getTransactionsByInventory(
            Long inventoryId
    );


    // =====================================================
    // GET TRANSACTIONS BY TYPE
    // =====================================================

    List<BarInventoryTransactionResponse>
    getTransactionsByType(
            InventoryTransactionType transactionType
    );
}