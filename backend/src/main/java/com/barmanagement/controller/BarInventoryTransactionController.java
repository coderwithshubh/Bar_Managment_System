package com.barmanagement.controller;

import com.barmanagement.enums.InventoryTransactionType;
import com.barmanagement.payload.request.BarInventoryTransactionRequest;
import com.barmanagement.payload.response.BarInventoryTransactionResponse;
import com.barmanagement.service.BarInventoryTransactionService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bar/inventory/transactions")
@CrossOrigin(origins = "http://localhost:5173")
public class BarInventoryTransactionController {

    private final BarInventoryTransactionService
            transactionService;


    public BarInventoryTransactionController(
            BarInventoryTransactionService transactionService) {

        this.transactionService = transactionService;
    }


    // =====================================================
    // CREATE TRANSACTION
    // =====================================================

    @PostMapping
    public ResponseEntity<
            BarInventoryTransactionResponse>
    createTransaction(
            @Valid @RequestBody
            BarInventoryTransactionRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        transactionService.createTransaction(
                                request
                        )
                );
    }


    // =====================================================
    // GET ALL
    // =====================================================

    @GetMapping
    public ResponseEntity<
            List<BarInventoryTransactionResponse>>
    getAllTransactions() {

        return ResponseEntity.ok(
                transactionService.getAllTransactions()
        );
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<
            BarInventoryTransactionResponse>
    getTransactionById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                transactionService.getTransactionById(id)
        );
    }


    // =====================================================
    // GET BY INVENTORY
    // =====================================================

    @GetMapping("/inventory/{inventoryId}")
    public ResponseEntity<
            List<BarInventoryTransactionResponse>>
    getTransactionsByInventory(
            @PathVariable Long inventoryId) {

        return ResponseEntity.ok(
                transactionService
                        .getTransactionsByInventory(
                                inventoryId
                        )
        );
    }


    // =====================================================
    // GET BY TYPE
    // =====================================================

    @GetMapping("/type/{transactionType}")
    public ResponseEntity<
            List<BarInventoryTransactionResponse>>
    getTransactionsByType(
            @PathVariable
            InventoryTransactionType transactionType) {

        return ResponseEntity.ok(
                transactionService
                        .getTransactionsByType(
                                transactionType
                        )
        );
    }
}