package com.barmanagement.controller;

import com.barmanagement.payload.request.BarInventoryRequest;
import com.barmanagement.payload.response.BarInventoryResponse;
import com.barmanagement.service.BarInventoryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/bar/inventory")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174"
        }
)
public class BarInventoryController {

    private final BarInventoryService inventoryService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public BarInventoryController(
            BarInventoryService inventoryService) {

        this.inventoryService = inventoryService;
    }


    // =====================================================
    // CREATE INVENTORY
    // =====================================================

    @PostMapping
    public ResponseEntity<BarInventoryResponse>
    createInventory(
            @Valid @RequestBody BarInventoryRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        inventoryService.createInventory(
                                request
                        )
                );
    }


    // =====================================================
    // GET ALL
    // =====================================================

    @GetMapping
    public ResponseEntity<List<BarInventoryResponse>>
    getAllInventory() {

        return ResponseEntity.ok(
                inventoryService.getAllInventory()
        );
    }


    // =====================================================
    // GET ACTIVE
    // =====================================================

    @GetMapping("/active")
    public ResponseEntity<List<BarInventoryResponse>>
    getActiveInventory() {

        return ResponseEntity.ok(
                inventoryService.getActiveInventory()
        );
    }


    // =====================================================
    // GET BY MENU ITEM
    // =====================================================

    @GetMapping("/menu-item/{menuItemId}")
    public ResponseEntity<BarInventoryResponse>
    getInventoryByMenuItem(
            @PathVariable Long menuItemId) {

        return ResponseEntity.ok(
                inventoryService.getInventoryByMenuItem(
                        menuItemId
                )
        );
    }


    // =====================================================
    // GET BY QR CODE
    // =====================================================

    @GetMapping("/qr/{qrCode:.+}")
    public ResponseEntity<BarInventoryResponse>
    getInventoryByQrCode(
            @PathVariable String qrCode) {

        return ResponseEntity.ok(
                inventoryService.getInventoryByQrCode(
                        qrCode
                )
        );
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<BarInventoryResponse>
    getInventoryById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                inventoryService.getInventoryById(id)
        );
    }


    // =====================================================
    // UPDATE MINIMUM QUANTITY
    // =====================================================

    @PatchMapping("/{id}/minimum-quantity")
    public ResponseEntity<BarInventoryResponse>
    updateMinimumQuantity(
            @PathVariable Long id,
            @RequestParam BigDecimal minimumQuantity) {

        return ResponseEntity.ok(
                inventoryService.updateMinimumQuantity(
                        id,
                        minimumQuantity
                )
        );
    }


    // =====================================================
    // ACTIVATE
    // =====================================================

    @PatchMapping("/{id}/activate")
    public ResponseEntity<BarInventoryResponse>
    activateInventory(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                inventoryService.activateInventory(id)
        );
    }


    // =====================================================
    // DEACTIVATE
    // =====================================================

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<BarInventoryResponse>
    deactivateInventory(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                inventoryService.deactivateInventory(id)
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteInventory(
            @PathVariable Long id) {

        inventoryService.deleteInventory(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}