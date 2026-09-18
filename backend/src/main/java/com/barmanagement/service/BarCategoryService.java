package com.barmanagement.service;

import com.barmanagement.payload.request.BarCategoryRequest;
import com.barmanagement.payload.response.BarCategoryResponse;

import java.util.List;

public interface BarCategoryService {

    BarCategoryResponse createCategory(
            BarCategoryRequest request
    );


    List<BarCategoryResponse> getAllCategories();


    List<BarCategoryResponse> getActiveCategories();


    BarCategoryResponse getCategoryById(
            Long id
    );


    BarCategoryResponse updateCategory(
            Long id,
            BarCategoryRequest request
    );


    BarCategoryResponse activateCategory(
            Long id
    );


    BarCategoryResponse deactivateCategory(
            Long id
    );


    void deleteCategory(
            Long id
    );


    List<BarCategoryResponse> searchCategories(
            String keyword
    );
}