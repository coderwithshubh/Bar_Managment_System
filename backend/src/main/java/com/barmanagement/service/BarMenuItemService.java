package com.barmanagement.service;

import com.barmanagement.payload.request.BarMenuItemRequest;
import com.barmanagement.payload.response.BarMenuItemResponse;

import java.util.List;

public interface BarMenuItemService {


    // ==========================================
    // CREATE
    // ==========================================

    BarMenuItemResponse createItem(
            BarMenuItemRequest request
    );


    // ==========================================
    // GET ALL
    // ==========================================

    List<BarMenuItemResponse> getAllItems();


    // ==========================================
    // GET ACTIVE
    // ==========================================

    List<BarMenuItemResponse> getActiveItems();


    // ==========================================
    // GET BY ID
    // ==========================================

    BarMenuItemResponse getItemById(
            Long id
    );


    // ==========================================
    // GET BY CATEGORY
    // ==========================================

    List<BarMenuItemResponse> getItemsByCategory(
            Long categoryId
    );


    // ==========================================
    // GET ACTIVE BY CATEGORY
    // ==========================================

    List<BarMenuItemResponse> getActiveItemsByCategory(
            Long categoryId
    );


    // ==========================================
    // UPDATE
    // ==========================================

    BarMenuItemResponse updateItem(
            Long id,
            BarMenuItemRequest request
    );


    // ==========================================
    // ACTIVATE
    // ==========================================

    BarMenuItemResponse activateItem(
            Long id
    );


    // ==========================================
    // DEACTIVATE
    // ==========================================

    BarMenuItemResponse deactivateItem(
            Long id
    );


    // ==========================================
    // DELETE
    // ==========================================

    void deleteItem(
            Long id
    );


    // ==========================================
    // SEARCH
    // ==========================================

    List<BarMenuItemResponse> searchItems(
            String keyword
    );
}