package com.barmanagement.controller;

import com.barmanagement.payload.request.BarTableRequest;
import com.barmanagement.payload.response.BarTableResponse;
import com.barmanagement.service.BarTableService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bar/tables")
@CrossOrigin
public class BarTableController {


    @Autowired
    private BarTableService barTableService;


    // ==========================================
    // CREATE
    // ==========================================

    @PostMapping
    public ResponseEntity<BarTableResponse> createTable(
            @RequestBody BarTableRequest request) {

        BarTableResponse response =
                barTableService.createTable(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // ==========================================
    // GET ALL
    // ==========================================

    @GetMapping
    public ResponseEntity<List<BarTableResponse>> getAllTables() {

        return ResponseEntity.ok(
                barTableService.getAllTables()
        );
    }


    // ==========================================
    // GET BY ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<BarTableResponse> getTableById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                barTableService.getTableById(id)
        );
    }


    // ==========================================
    // UPDATE
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<BarTableResponse> updateTable(
            @PathVariable Long id,
            @RequestBody BarTableRequest request) {

        return ResponseEntity.ok(
                barTableService.updateTable(
                        id,
                        request
                )
        );
    }


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    @PatchMapping("/{id}/status")
    public ResponseEntity<BarTableResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                barTableService.updateTableStatus(
                        id,
                        status
                )
        );
    }


    // ==========================================
    // ACTIVATE
    // ==========================================

    @PatchMapping("/{id}/activate")
    public ResponseEntity<BarTableResponse> activateTable(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                barTableService.activateTable(id)
        );
    }


    // ==========================================
    // DEACTIVATE
    // ==========================================

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<BarTableResponse> deactivateTable(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                barTableService.deactivateTable(id)
        );
    }


    // ==========================================
    // DELETE
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTable(
            @PathVariable Long id) {

        barTableService.deleteTable(id);

        return ResponseEntity.noContent().build();
    }
}