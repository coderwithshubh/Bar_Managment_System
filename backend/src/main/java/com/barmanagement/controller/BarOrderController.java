package com.barmanagement.controller;

import com.barmanagement.payload.request.BarOrderRequest;
import com.barmanagement.payload.response.BarOrderResponse;
import com.barmanagement.service.BarOrderService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bar/orders")
@CrossOrigin(origins = "http://localhost:5174")
public class BarOrderController {

    @Autowired
    private BarOrderService barOrderService;


    // ==========================================
    // CREATE ORDER
    // ==========================================

    @PostMapping
    public ResponseEntity<BarOrderResponse> createOrder(
            @Valid @RequestBody BarOrderRequest request) {

        BarOrderResponse response =
                barOrderService.createOrder(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // ==========================================
    // GET ALL ORDERS
    // ==========================================

    @GetMapping
    public ResponseEntity<List<BarOrderResponse>> getAllOrders() {

        return ResponseEntity.ok(
                barOrderService.getAllOrders()
        );
    }


    // ==========================================
    // GET ORDER BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<BarOrderResponse> getOrderById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                barOrderService.getOrderById(id)
        );
    }


    // ==========================================
    // UPDATE ORDER STATUS
    // ==========================================

    @PatchMapping("/{id}/status")
    public ResponseEntity<BarOrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                barOrderService.updateOrderStatus(
                        id,
                        status
                )
        );
    }


    // ==========================================
    // CANCEL ORDER
    // ==========================================

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BarOrderResponse> cancelOrder(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                barOrderService.cancelOrder(id)
        );
    }


    // ==========================================
    // COMPLETE ORDER
    // ==========================================

    @PatchMapping("/{id}/complete")
    public ResponseEntity<BarOrderResponse> completeOrder(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                barOrderService.completeOrder(id)
        );
    }
}