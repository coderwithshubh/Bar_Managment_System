package com.barmanagement.service.impl;

import com.barmanagement.model.BarCategory;
import com.barmanagement.payload.request.BarCategoryRequest;
import com.barmanagement.payload.response.BarCategoryResponse;
import com.barmanagement.repository.BarCategoryRepository;
import com.barmanagement.service.BarCategoryService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BarCategoryServiceImpl
        implements BarCategoryService {

    private final BarCategoryRepository categoryRepository;


    public BarCategoryServiceImpl(
            BarCategoryRepository categoryRepository) {

        this.categoryRepository = categoryRepository;
    }


    // =====================================================
    // CREATE
    // =====================================================

    @Override
    public BarCategoryResponse createCategory(
            BarCategoryRequest request) {

        String categoryName =
                normalizeName(request.getCategoryName());


        if (categoryRepository
                .existsByCategoryNameIgnoreCase(categoryName)) {

            throw new RuntimeException(
                    "Bar category already exists."
            );
        }


        BarCategory category = new BarCategory();

        category.setCategoryCode(
                generateCategoryCode()
        );

        category.setCategoryName(
                categoryName
        );

        category.setDescription(
                normalizeDescription(
                        request.getDescription()
                )
        );

        category.setDisplayOrder(
                request.getDisplayOrder() != null
                        ? request.getDisplayOrder()
                        : 0
        );

        category.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true
        );


        BarCategory savedCategory =
                categoryRepository.save(category);


        return mapToResponse(savedCategory);
    }


    // =====================================================
    // GET ALL
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<BarCategoryResponse> getAllCategories() {

        return categoryRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET ACTIVE
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<BarCategoryResponse> getActiveCategories() {

        return categoryRepository
                .findByActiveTrueOrderByDisplayOrderAsc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public BarCategoryResponse getCategoryById(
            Long id) {

        return mapToResponse(
                findCategoryById(id)
        );
    }


    // =====================================================
    // UPDATE
    // =====================================================

    @Override
    public BarCategoryResponse updateCategory(
            Long id,
            BarCategoryRequest request) {

        BarCategory category =
                findCategoryById(id);


        String categoryName =
                normalizeName(request.getCategoryName());


        boolean nameChanged =
                !category.getCategoryName()
                        .equalsIgnoreCase(categoryName);


        if (nameChanged &&
                categoryRepository
                        .existsByCategoryNameIgnoreCase(
                                categoryName
                        )) {

            throw new RuntimeException(
                    "Another bar category with this name already exists."
            );
        }


        category.setCategoryName(categoryName);

        category.setDescription(
                normalizeDescription(
                        request.getDescription()
                )
        );

        category.setDisplayOrder(
                request.getDisplayOrder() != null
                        ? request.getDisplayOrder()
                        : 0
        );


        if (request.getActive() != null) {

            category.setActive(
                    request.getActive()
            );
        }


        BarCategory updatedCategory =
                categoryRepository.save(category);


        return mapToResponse(updatedCategory);
    }


    // =====================================================
    // ACTIVATE
    // =====================================================

    @Override
    public BarCategoryResponse activateCategory(
            Long id) {

        BarCategory category =
                findCategoryById(id);

        category.setActive(true);

        return mapToResponse(
                categoryRepository.save(category)
        );
    }


    // =====================================================
    // DEACTIVATE
    // =====================================================

    @Override
    public BarCategoryResponse deactivateCategory(
            Long id) {

        BarCategory category =
                findCategoryById(id);

        category.setActive(false);

        return mapToResponse(
                categoryRepository.save(category)
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @Override
    public void deleteCategory(Long id) {

        BarCategory category =
                findCategoryById(id);

        categoryRepository.delete(category);
    }


    // =====================================================
    // SEARCH
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<BarCategoryResponse> searchCategories(
            String keyword) {

        if (keyword == null ||
                keyword.trim().isEmpty()) {

            return getAllCategories();
        }


        String searchKeyword =
                keyword.trim().toLowerCase();


        return categoryRepository
                .findAll()
                .stream()
                .filter(category -> {

                    String name =
                            category.getCategoryName()
                                    .toLowerCase();

                    String description =
                            category.getDescription() != null
                                    ? category.getDescription()
                                            .toLowerCase()
                                    : "";

                    return name.contains(searchKeyword)
                            || description.contains(searchKeyword);
                })
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GENERATE CATEGORY CODE
    // =====================================================

    private String generateCategoryCode() {

        long nextNumber =
                categoryRepository.count() + 1;


        String categoryCode =
                String.format(
                        "BARCAT%03d",
                        nextNumber
                );


        while (categoryRepository
                .existsByCategoryCode(categoryCode)) {

            nextNumber++;

            categoryCode =
                    String.format(
                            "BARCAT%03d",
                            nextNumber
                    );
        }


        return categoryCode;
    }


    // =====================================================
    // FIND CATEGORY
    // =====================================================

    private BarCategory findCategoryById(
            Long id) {

        if (id == null) {

            throw new RuntimeException(
                    "Category ID cannot be null."
            );
        }


        return categoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bar category not found with ID: "
                                        + id
                        )
                );
    }


    // =====================================================
    // NORMALIZE NAME
    // =====================================================

    private String normalizeName(String name) {

        if (name == null ||
                name.trim().isEmpty()) {

            throw new RuntimeException(
                    "Category name is required."
            );
        }


        return name.trim()
                .replaceAll("\\s+", " ");
    }


    // =====================================================
    // NORMALIZE DESCRIPTION
    // =====================================================

    private String normalizeDescription(
            String description) {

        if (description == null) {
            return null;
        }


        String cleaned =
                description.trim()
                        .replaceAll("\\s+", " ");


        return cleaned.isEmpty()
                ? null
                : cleaned;
    }


    // =====================================================
    // ENTITY -> RESPONSE
    // =====================================================

    private BarCategoryResponse mapToResponse(
            BarCategory category) {

        BarCategoryResponse response =
                new BarCategoryResponse();

        response.setId(category.getId());

        response.setCategoryCode(
                category.getCategoryCode()
        );

        response.setCategoryName(
                category.getCategoryName()
        );

        response.setDescription(
                category.getDescription()
        );

        response.setDisplayOrder(
                category.getDisplayOrder()
        );

        response.setActive(
                category.getActive()
        );

        response.setCreatedAt(
                category.getCreatedAt()
        );

        response.setUpdatedAt(
                category.getUpdatedAt()
        );


        return response;
    }
}