package com.barmanagement.service.impl;

import com.barmanagement.model.BarCategory;
import com.barmanagement.model.BarMenuItem;

import com.barmanagement.payload.request.BarMenuItemRequest;
import com.barmanagement.payload.response.BarMenuItemResponse;

import com.barmanagement.repository.BarCategoryRepository;
import com.barmanagement.repository.BarMenuItemRepository;

import com.barmanagement.service.BarMenuItemService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BarMenuItemServiceImpl
        implements BarMenuItemService {


    private final BarMenuItemRepository menuItemRepository;

    private final BarCategoryRepository categoryRepository;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public BarMenuItemServiceImpl(
            BarMenuItemRepository menuItemRepository,
            BarCategoryRepository categoryRepository) {

        this.menuItemRepository = menuItemRepository;
        this.categoryRepository = categoryRepository;
    }


    // ==========================================
    // CREATE MENU ITEM
    // ==========================================

    @Override
    public BarMenuItemResponse createItem(
            BarMenuItemRequest request) {

        String itemName =
                normalizeName(request.getItemName());

        validatePrice(request.getPrice());

        validateConsumptionQuantity(
                request.getConsumptionQuantity()
        );

        if (request.getSellingUnit() == null) {

            throw new RuntimeException(
                    "Selling unit is required."
            );
        }


        // Check duplicate name

        if (menuItemRepository
                .existsByItemNameIgnoreCase(itemName)) {

            throw new RuntimeException(
                    "Menu item already exists: "
                            + itemName
            );
        }


        // Find category

        BarCategory category =
                findCategoryById(
                        request.getCategoryId()
                );


        // Generate item code

        String itemCode =
                generateItemCode();


        // Create entity

        BarMenuItem item =
                new BarMenuItem();

        item.setItemCode(itemCode);

        item.setItemName(itemName);

        item.setCategory(category);

        item.setDescription(
                normalizeDescription(
                        request.getDescription()
                )
        );

        item.setPrice(
                request.getPrice()
        );

        item.setSellingUnit(
                request.getSellingUnit()
        );

        item.setConsumptionQuantity(
                request.getConsumptionQuantity()
        );

        item.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true
        );

        item.setDisplayOrder(
                request.getDisplayOrder() != null
                        ? request.getDisplayOrder()
                        : 0
        );


        // Save

        BarMenuItem savedItem =
                menuItemRepository.save(item);


        return mapToResponse(savedItem);
    }


    // ==========================================
    // GET ALL MENU ITEMS
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public List<BarMenuItemResponse> getAllItems() {

        return menuItemRepository
                .findAll()
                .stream()

                .sorted(
                        Comparator
                                .comparing(
                                        (BarMenuItem item) ->
                                                item.getCategory() != null
                                                        && item.getCategory()
                                                        .getCategoryName() != null
                                                        ? item.getCategory()
                                                        .getCategoryName()
                                                        : ""
                                )

                                .thenComparing(
                                        item ->
                                                item.getDisplayOrder() != null
                                                        ? item.getDisplayOrder()
                                                        : 0
                                )

                                .thenComparing(
                                        item ->
                                                item.getItemName() != null
                                                        ? item.getItemName()
                                                        : ""
                                )
                )

                .map(this::mapToResponse)

                .collect(Collectors.toList());
    }


    // ==========================================
    // GET ACTIVE MENU ITEMS
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public List<BarMenuItemResponse> getActiveItems() {

        return menuItemRepository
                .findByActiveTrueOrderByDisplayOrderAscItemNameAsc()
                .stream()

                .map(this::mapToResponse)

                .collect(Collectors.toList());
    }


    // ==========================================
    // GET MENU ITEM BY ID
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public BarMenuItemResponse getItemById(
            Long id) {

        BarMenuItem item =
                findItemById(id);

        return mapToResponse(item);
    }


    // ==========================================
    // GET ITEMS BY CATEGORY
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public List<BarMenuItemResponse> getItemsByCategory(
            Long categoryId) {

        findCategoryById(categoryId);

        return menuItemRepository
                .findByCategoryIdOrderByDisplayOrderAscItemNameAsc(
                        categoryId
                )
                .stream()

                .map(this::mapToResponse)

                .collect(Collectors.toList());
    }


    // ==========================================
    // GET ACTIVE ITEMS BY CATEGORY
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public List<BarMenuItemResponse> getActiveItemsByCategory(
            Long categoryId) {

        findCategoryById(categoryId);

        return menuItemRepository
                .findByCategoryIdAndActiveTrueOrderByDisplayOrderAscItemNameAsc(
                        categoryId
                )
                .stream()

                .map(this::mapToResponse)

                .collect(Collectors.toList());
    }


    // ==========================================
    // UPDATE MENU ITEM
    // ==========================================

    @Override
    public BarMenuItemResponse updateItem(
            Long id,
            BarMenuItemRequest request) {

        BarMenuItem item =
                findItemById(id);


        String itemName =
                normalizeName(request.getItemName());


        validatePrice(request.getPrice());

        validateConsumptionQuantity(
                request.getConsumptionQuantity()
        );


        if (request.getSellingUnit() == null) {

            throw new RuntimeException(
                    "Selling unit is required."
            );
        }


        // Check duplicate name

        menuItemRepository
                .findByItemNameIgnoreCase(itemName)
                .ifPresent(existingItem -> {

                    if (!existingItem.getId().equals(id)) {

                        throw new RuntimeException(
                                "Another menu item already exists with name: "
                                        + itemName
                        );
                    }
                });


        // Find category

        BarCategory category =
                findCategoryById(
                        request.getCategoryId()
                );


        // Update

        item.setItemName(itemName);

        item.setCategory(category);

        item.setDescription(
                normalizeDescription(
                        request.getDescription()
                )
        );

        item.setPrice(
                request.getPrice()
        );

        item.setSellingUnit(
                request.getSellingUnit()
        );

        item.setConsumptionQuantity(
                request.getConsumptionQuantity()
        );

        item.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : item.getActive()
        );

        item.setDisplayOrder(
                request.getDisplayOrder() != null
                        ? request.getDisplayOrder()
                        : item.getDisplayOrder()
        );


        BarMenuItem updatedItem =
                menuItemRepository.save(item);


        return mapToResponse(updatedItem);
    }


    // ==========================================
    // ACTIVATE
    // ==========================================

    @Override
    public BarMenuItemResponse activateItem(
            Long id) {

        BarMenuItem item =
                findItemById(id);

        item.setActive(true);

        BarMenuItem updatedItem =
                menuItemRepository.save(item);

        return mapToResponse(updatedItem);
    }


    // ==========================================
    // DEACTIVATE
    // ==========================================

    @Override
    public BarMenuItemResponse deactivateItem(
            Long id) {

        BarMenuItem item =
                findItemById(id);

        item.setActive(false);

        BarMenuItem updatedItem =
                menuItemRepository.save(item);

        return mapToResponse(updatedItem);
    }


    // ==========================================
    // DELETE
    // ==========================================

    @Override
    public void deleteItem(Long id) {

        BarMenuItem item =
                findItemById(id);

        menuItemRepository.delete(item);
    }


    // ==========================================
    // SEARCH
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public List<BarMenuItemResponse> searchItems(
            String keyword) {

        String searchKeyword =
                keyword == null
                        ? ""
                        : keyword.trim().toLowerCase();


        return menuItemRepository
                .findAll()
                .stream()

                .filter(item -> {

                    String itemName =
                            item.getItemName() != null
                                    ? item.getItemName().toLowerCase()
                                    : "";

                    String itemCode =
                            item.getItemCode() != null
                                    ? item.getItemCode().toLowerCase()
                                    : "";

                    String description =
                            item.getDescription() != null
                                    ? item.getDescription().toLowerCase()
                                    : "";

                    String categoryName =
                            item.getCategory() != null
                                    && item.getCategory()
                                    .getCategoryName() != null
                                    ? item.getCategory()
                                    .getCategoryName()
                                    .toLowerCase()
                                    : "";


                    return itemName.contains(searchKeyword)
                            || itemCode.contains(searchKeyword)
                            || description.contains(searchKeyword)
                            || categoryName.contains(searchKeyword);
                })

                .sorted(
                        Comparator
                                .comparing(
                                        (BarMenuItem item) ->
                                                item.getCategory() != null
                                                        && item.getCategory()
                                                        .getCategoryName() != null
                                                        ? item.getCategory()
                                                        .getCategoryName()
                                                        : ""
                                )

                                .thenComparing(
                                        item ->
                                                item.getDisplayOrder() != null
                                                        ? item.getDisplayOrder()
                                                        : 0
                                )

                                .thenComparing(
                                        item ->
                                                item.getItemName() != null
                                                        ? item.getItemName()
                                                        : ""
                                )
                )

                .map(this::mapToResponse)

                .collect(Collectors.toList());
    }


    // ==========================================
    // FIND CATEGORY
    // ==========================================

    private BarCategory findCategoryById(
            Long categoryId) {

        if (categoryId == null) {

            throw new RuntimeException(
                    "Category is required."
            );
        }


        return categoryRepository
                .findById(categoryId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bar category not found with id: "
                                        + categoryId
                        )
                );
    }


    // ==========================================
    // FIND MENU ITEM
    // ==========================================

    private BarMenuItem findItemById(
            Long id) {

        if (id == null) {

            throw new RuntimeException(
                    "Menu item ID is required."
            );
        }


        return menuItemRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bar menu item not found with id: "
                                        + id
                        )
                );
    }


    // ==========================================
    // GENERATE ITEM CODE
    // ==========================================

    private String generateItemCode() {

        long nextNumber =
                menuItemRepository.count() + 1;


        String itemCode =
                String.format(
                        "BAR%03d",
                        nextNumber
                );


        while (
                menuItemRepository
                        .existsByItemCode(itemCode)
        ) {

            nextNumber++;

            itemCode =
                    String.format(
                            "BAR%03d",
                            nextNumber
                    );
        }


        return itemCode;
    }


    // ==========================================
    // NORMALIZE NAME
    // ==========================================

    private String normalizeName(
            String name) {

        if (name == null) {
            return "";
        }

        return name
                .trim()
                .replaceAll("\\s+", " ");
    }


    // ==========================================
    // NORMALIZE DESCRIPTION
    // ==========================================

    private String normalizeDescription(
            String description) {

        if (description == null) {
            return null;
        }


        String value =
                description
                        .trim()
                        .replaceAll("\\s+", " ");


        return value.isEmpty()
                ? null
                : value;
    }


    // ==========================================
    // VALIDATE PRICE
    // ==========================================

    private void validatePrice(
            BigDecimal price) {

        if (price == null) {

            throw new RuntimeException(
                    "Price is required."
            );
        }


        if (price.compareTo(
                BigDecimal.ZERO
        ) <= 0) {

            throw new RuntimeException(
                    "Price must be greater than zero."
            );
        }
    }


    // ==========================================
    // VALIDATE CONSUMPTION QUANTITY
    // ==========================================

    private void validateConsumptionQuantity(
            BigDecimal consumptionQuantity) {

        if (consumptionQuantity == null) {

            throw new RuntimeException(
                    "Consumption quantity is required."
            );
        }


        if (consumptionQuantity.compareTo(
                BigDecimal.ZERO
        ) <= 0) {

            throw new RuntimeException(
                    "Consumption quantity must be greater than zero."
            );
        }
    }


    // ==========================================
    // ENTITY → RESPONSE
    // ==========================================

    private BarMenuItemResponse mapToResponse(
            BarMenuItem item) {

        BarMenuItemResponse response =
                new BarMenuItemResponse();


        response.setId(
                item.getId()
        );

        response.setItemCode(
                item.getItemCode()
        );

        response.setItemName(
                item.getItemName()
        );


        // Category

        if (item.getCategory() != null) {

            response.setCategoryId(
                    item.getCategory().getId()
            );

            response.setCategoryName(
                    item.getCategory()
                            .getCategoryName()
            );
        }


        response.setDescription(
                item.getDescription()
        );

        response.setPrice(
                item.getPrice()
        );

        response.setSellingUnit(
                item.getSellingUnit()
        );

        response.setConsumptionQuantity(
                item.getConsumptionQuantity()
        );

        response.setActive(
                item.getActive()
        );

        response.setDisplayOrder(
                item.getDisplayOrder()
        );

        response.setCreatedAt(
                item.getCreatedAt()
        );

        response.setUpdatedAt(
                item.getUpdatedAt()
        );


        return response;
    }
}