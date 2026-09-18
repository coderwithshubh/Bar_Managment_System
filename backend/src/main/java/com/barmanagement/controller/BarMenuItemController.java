package com.barmanagement.controller;

import com.barmanagement.payload.request.BarMenuItemRequest;
import com.barmanagement.payload.response.BarMenuItemResponse;
import com.barmanagement.service.BarMenuItemService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bar/menu")
@CrossOrigin(
    origins = "http://localhost:5174"
)
public class BarMenuItemController {


    private final BarMenuItemService menuItemService;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public BarMenuItemController(
            BarMenuItemService menuItemService) {

        this.menuItemService = menuItemService;
    }


    // ==========================================
    // CREATE MENU ITEM
    // POST /api/bar/menu
    // ==========================================

    @PostMapping
    public ResponseEntity<BarMenuItemResponse> createItem(
            @Valid @RequestBody BarMenuItemRequest request) {

        BarMenuItemResponse response =
                menuItemService.createItem(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // ==========================================
    // GET ALL MENU ITEMS
    // GET /api/bar/menu
    // ==========================================

    @GetMapping
    public ResponseEntity<List<BarMenuItemResponse>>
    getAllItems() {

        return ResponseEntity.ok(
                menuItemService.getAllItems()
        );
    }


    // ==========================================
    // GET ACTIVE MENU ITEMS
    // GET /api/bar/menu/active
    // ==========================================

    @GetMapping("/active")
    public ResponseEntity<List<BarMenuItemResponse>>
    getActiveItems() {

        return ResponseEntity.ok(
                menuItemService.getActiveItems()
        );
    }


    // ==========================================
    // SEARCH MENU ITEMS
    // GET /api/bar/menu/search?keyword=
    // ==========================================

    @GetMapping("/search")
    public ResponseEntity<List<BarMenuItemResponse>>
    searchItems(
            @RequestParam String keyword) {

        return ResponseEntity.ok(
                menuItemService.searchItems(keyword)
        );
    }


    // ==========================================
    // GET ITEMS BY CATEGORY
    // GET /api/bar/menu/category/{categoryId}
    // ==========================================

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<BarMenuItemResponse>>
    getItemsByCategory(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                menuItemService.getItemsByCategory(
                        categoryId
                )
        );
    }


    // ==========================================
    // GET ACTIVE ITEMS BY CATEGORY
    // GET /api/bar/menu/category/{categoryId}/active
    // ==========================================

    @GetMapping("/category/{categoryId}/active")
    public ResponseEntity<List<BarMenuItemResponse>>
    getActiveItemsByCategory(
            @PathVariable Long categoryId) {

        return ResponseEntity.ok(
                menuItemService.getActiveItemsByCategory(
                        categoryId
                )
        );
    }


    // ==========================================
    // GET MENU ITEM BY ID
    // GET /api/bar/menu/{id}
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<BarMenuItemResponse>
    getItemById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                menuItemService.getItemById(id)
        );
    }


    // ==========================================
    // UPDATE MENU ITEM
    // PUT /api/bar/menu/{id}
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<BarMenuItemResponse>
    updateItem(
            @PathVariable Long id,
            @Valid @RequestBody BarMenuItemRequest request) {

        return ResponseEntity.ok(
                menuItemService.updateItem(
                        id,
                        request
                )
        );
    }


    // ==========================================
    // ACTIVATE MENU ITEM
    // PATCH /api/bar/menu/{id}/activate
    // ==========================================

    @PatchMapping("/{id}/activate")
    public ResponseEntity<BarMenuItemResponse>
    activateItem(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                menuItemService.activateItem(id)
        );
    }


    // ==========================================
    // DEACTIVATE MENU ITEM
    // PATCH /api/bar/menu/{id}/deactivate
    // ==========================================

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<BarMenuItemResponse>
    deactivateItem(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                menuItemService.deactivateItem(id)
        );
    }


    // ==========================================
    // DELETE MENU ITEM
    // DELETE /api/bar/menu/{id}
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteItem(
            @PathVariable Long id) {

        menuItemService.deleteItem(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}