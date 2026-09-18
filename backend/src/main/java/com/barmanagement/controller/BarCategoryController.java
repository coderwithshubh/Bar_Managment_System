package com.barmanagement.controller;

import com.barmanagement.payload.request.BarCategoryRequest;
import com.barmanagement.payload.response.BarCategoryResponse;
import com.barmanagement.service.BarCategoryService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bar/categories")
@CrossOrigin(origins = "http://localhost:5174")
public class BarCategoryController {

    private final BarCategoryService categoryService;


    public BarCategoryController(
            BarCategoryService categoryService) {

        this.categoryService = categoryService;
    }


    // =====================================================
    // CREATE
    // =====================================================

    @PostMapping
    public ResponseEntity<BarCategoryResponse> createCategory(
            @Valid @RequestBody BarCategoryRequest request) {

        BarCategoryResponse response =
                categoryService.createCategory(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =====================================================
    // GET ALL
    // =====================================================

    @GetMapping
    public ResponseEntity<List<BarCategoryResponse>>
            getAllCategories() {

        return ResponseEntity.ok(
                categoryService.getAllCategories()
        );
    }


    // =====================================================
    // GET ACTIVE
    // =====================================================

    @GetMapping("/active")
    public ResponseEntity<List<BarCategoryResponse>>
            getActiveCategories() {

        return ResponseEntity.ok(
                categoryService.getActiveCategories()
        );
    }


    // =====================================================
    // SEARCH
    // =====================================================

    @GetMapping("/search")
    public ResponseEntity<List<BarCategoryResponse>>
            searchCategories(
                    @RequestParam String keyword) {

        return ResponseEntity.ok(
                categoryService.searchCategories(keyword)
        );
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<BarCategoryResponse>
            getCategoryById(
                    @PathVariable Long id) {

        return ResponseEntity.ok(
                categoryService.getCategoryById(id)
        );
    }


    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<BarCategoryResponse>
            updateCategory(
                    @PathVariable Long id,
                    @Valid @RequestBody
                    BarCategoryRequest request) {

        return ResponseEntity.ok(
                categoryService.updateCategory(
                        id,
                        request
                )
        );
    }


    // =====================================================
    // ACTIVATE
    // =====================================================

    @PatchMapping("/{id}/activate")
    public ResponseEntity<BarCategoryResponse>
            activateCategory(
                    @PathVariable Long id) {

        return ResponseEntity.ok(
                categoryService.activateCategory(id)
        );
    }


    // =====================================================
    // DEACTIVATE
    // =====================================================

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<BarCategoryResponse>
            deactivateCategory(
                    @PathVariable Long id) {

        return ResponseEntity.ok(
                categoryService.deactivateCategory(id)
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long id) {

        categoryService.deleteCategory(id);

        return ResponseEntity.noContent().build();
    }
}