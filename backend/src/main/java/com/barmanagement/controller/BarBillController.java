package com.barmanagement.controller;

import com.barmanagement.payload.request.BarBillPaymentRequest;
import com.barmanagement.payload.request.BarBillRequest;
import com.barmanagement.payload.response.BarBillResponse;
import com.barmanagement.service.BarBillService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bar/bills")
public class BarBillController {

    private final BarBillService barBillService;

    public BarBillController(
            BarBillService barBillService
    ) {
        this.barBillService = barBillService;
    }

    // =====================================================
    // CREATE BILL
    // =====================================================

    @PostMapping
    public ResponseEntity<BarBillResponse> createBill(
            @Valid @RequestBody BarBillRequest request
    ) {

        BarBillResponse response =
                barBillService.createBill(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =====================================================
    // GET ALL BILLS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<BarBillResponse>> getAllBills() {

        return ResponseEntity.ok(
                barBillService.getAllBills()
        );
    }

    // =====================================================
    // GET BILL BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<BarBillResponse> getBillById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                barBillService.getBillById(id)
        );
    }

    // =====================================================
    // GET BILL BY BILL NUMBER
    // =====================================================

    @GetMapping("/number/{billNumber}")
    public ResponseEntity<BarBillResponse> getBillByNumber(
            @PathVariable String billNumber
    ) {

        return ResponseEntity.ok(
                barBillService.getBillByNumber(
                        billNumber
                )
        );
    }

    // =====================================================
    // GET BILL BY ORDER ID
    // =====================================================

    @GetMapping("/order/{orderId}")
    public ResponseEntity<BarBillResponse> getBillByOrderId(
            @PathVariable Long orderId
    ) {

        return ResponseEntity.ok(
                barBillService.getBillByOrderId(
                        orderId
                )
        );
    }

    // =====================================================
    // GET BILLS BY PAYMENT STATUS
    // =====================================================

    @GetMapping("/status/{paymentStatus}")
    public ResponseEntity<List<BarBillResponse>>
    getBillsByPaymentStatus(
            @PathVariable String paymentStatus
    ) {

        return ResponseEntity.ok(
                barBillService.getBillsByPaymentStatus(
                        paymentStatus
                )
        );
    }

    // =====================================================
    // MARK BILL AS PAID
    // =====================================================

    @PatchMapping("/{id}/payment")
    public ResponseEntity<BarBillResponse> updatePayment(
            @PathVariable Long id,
            @Valid @RequestBody BarBillPaymentRequest request
    ) {

        return ResponseEntity.ok(
                barBillService.updatePayment(
                        id,
                        request
                )
        );
    }

    // =====================================================
    // VOID BILL
    // =====================================================

    @PatchMapping("/{id}/void")
    public ResponseEntity<BarBillResponse> voidBill(
            @PathVariable Long id,
            @RequestParam String reason
    ) {

        return ResponseEntity.ok(
                barBillService.voidBill(
                        id,
                        reason
                )
        );
    }
}