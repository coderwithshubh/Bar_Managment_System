package com.barmanagement.service;

import com.barmanagement.payload.request.BarTableRequest;
import com.barmanagement.payload.response.BarTableResponse;

import java.util.List;

public interface BarTableService {

    // ==========================================
    // CREATE
    // ==========================================

    BarTableResponse createTable(
            BarTableRequest request
    );


    // ==========================================
    // GET ALL
    // ==========================================

    List<BarTableResponse> getAllTables();


    // ==========================================
    // GET BY ID
    // ==========================================

    BarTableResponse getTableById(
            Long id
    );


    // ==========================================
    // UPDATE
    // ==========================================

    BarTableResponse updateTable(
            Long id,
            BarTableRequest request
    );


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    BarTableResponse updateTableStatus(
            Long id,
            String status
    );


    // ==========================================
    // ACTIVATE
    // ==========================================

    BarTableResponse activateTable(
            Long id
    );


    // ==========================================
    // DEACTIVATE
    // ==========================================

    BarTableResponse deactivateTable(
            Long id
    );


    // ==========================================
    // DELETE
    // ==========================================

    void deleteTable(
            Long id
    );
}