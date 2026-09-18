package com.barmanagement.service.impl;

import com.barmanagement.enums.InventoryTransactionType;
import com.barmanagement.model.BarInventory;
import com.barmanagement.model.BarInventoryTransaction;
import com.barmanagement.model.BarMenuItem;
import com.barmanagement.payload.request.BarInventoryRequest;
import com.barmanagement.payload.response.BarInventoryResponse;
import com.barmanagement.repository.BarInventoryRepository;
import com.barmanagement.repository.BarInventoryTransactionRepository;
import com.barmanagement.repository.BarMenuItemRepository;
import com.barmanagement.service.BarInventoryService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BarInventoryServiceImpl
        implements BarInventoryService {

    private final BarInventoryRepository inventoryRepository;

    private final BarInventoryTransactionRepository
            transactionRepository;

    private final BarMenuItemRepository menuItemRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public BarInventoryServiceImpl(
            BarInventoryRepository inventoryRepository,
            BarInventoryTransactionRepository transactionRepository,
            BarMenuItemRepository menuItemRepository) {

        this.inventoryRepository = inventoryRepository;
        this.transactionRepository = transactionRepository;
        this.menuItemRepository = menuItemRepository;
    }


    // =====================================================
    // CREATE INVENTORY
    // =====================================================

    @Override
    public BarInventoryResponse createInventory(
            BarInventoryRequest request) {

        if (request == null) {

            throw new RuntimeException(
                    "Inventory request is required."
            );
        }


        if (request.getMenuItemId() == null) {

            throw new RuntimeException(
                    "Menu item is required."
            );
        }


        if (inventoryRepository.existsByMenuItemId(
                request.getMenuItemId())) {

            throw new RuntimeException(
                    "Inventory already exists for this menu item."
            );
        }


        String qrCode = normalizeQrCode(
                request.getQrCode()
        );

        if (qrCode != null &&
                inventoryRepository.existsByQrCode(qrCode)) {

            throw new RuntimeException(
                    "This QR code is already assigned to another inventory item."
            );
        }


        if (request.getUnit() == null) {

            throw new RuntimeException(
                    "Inventory unit is required."
            );
        }


        validateQuantity(
                request.getOpeningQuantity(),
                "Opening quantity"
        );


        validateQuantity(
                request.getMinimumQuantity(),
                "Minimum quantity"
        );


        BarMenuItem menuItem =
                menuItemRepository
                        .findById(
                                request.getMenuItemId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bar menu item not found with id: "
                                                + request.getMenuItemId()
                                )
                        );


        // =================================================
        // CREATE INVENTORY
        // =================================================

        BarInventory inventory =
                new BarInventory();

        inventory.setMenuItem(menuItem);

        inventory.setQrCode(qrCode);

        inventory.setCurrentQuantity(
                request.getOpeningQuantity()
        );

        inventory.setUnit(
                request.getUnit()
        );

        inventory.setMinimumQuantity(
                request.getMinimumQuantity()
        );

        inventory.setActive(
                request.getActive() != null
                        ? request.getActive()
                        : true
        );


        BarInventory savedInventory =
                inventoryRepository.save(inventory);


        // =================================================
        // OPENING STOCK TRANSACTION
        // =================================================

        if (request.getOpeningQuantity()
                .compareTo(BigDecimal.ZERO) > 0) {

            BarInventoryTransaction transaction =
                    new BarInventoryTransaction();

            transaction.setInventory(
                    savedInventory
            );

            transaction.setTransactionType(
                    InventoryTransactionType.OPENING_STOCK
            );

            transaction.setQuantity(
                    request.getOpeningQuantity()
            );

            transaction.setReason(
                    "Initial Stock"
            );

            transactionRepository.save(transaction);
        }


        return mapToResponse(
                savedInventory
        );
    }


    // =====================================================
    // GET ALL
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<BarInventoryResponse>
    getAllInventory() {

        return inventoryRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =====================================================
    // GET ACTIVE
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<BarInventoryResponse>
    getActiveInventory() {

        return inventoryRepository
                .findByActiveTrueOrderByMenuItemItemNameAsc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public BarInventoryResponse getInventoryById(
            Long id) {

        return mapToResponse(
                findInventory(id)
        );
    }


    // =====================================================
    // GET BY MENU ITEM
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public BarInventoryResponse getInventoryByMenuItem(
            Long menuItemId) {

        if (menuItemId == null) {

            throw new RuntimeException(
                    "Menu item ID is required."
            );
        }


        BarInventory inventory =
                inventoryRepository
                        .findByMenuItemId(menuItemId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Inventory not found for menu item id: "
                                                + menuItemId
                                )
                        );


        return mapToResponse(inventory);
    }


    // =====================================================
    // GET BY QR CODE
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public BarInventoryResponse getInventoryByQrCode(
            String qrCode) {

        String normalizedQrCode =
                normalizeQrCode(qrCode);

        // -------------------------------------------------
        // EMPTY QR CODE
        // -------------------------------------------------

        if (normalizedQrCode == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "QR code is required."
            );
        }


        // -------------------------------------------------
        // FIND INVENTORY BY QR CODE
        // -------------------------------------------------

        BarInventory inventory =
                inventoryRepository
                        .findByQrCode(normalizedQrCode)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "No inventory item found for this QR code."
                                )
                        );


        // -------------------------------------------------
        // RETURN INVENTORY
        // -------------------------------------------------

        return mapToResponse(inventory);
    }


    // =====================================================
    // UPDATE MINIMUM QUANTITY
    // =====================================================

    @Override
    public BarInventoryResponse updateMinimumQuantity(
            Long id,
            BigDecimal minimumQuantity) {

        validateQuantity(
                minimumQuantity,
                "Minimum quantity"
        );


        BarInventory inventory =
                findInventory(id);


        inventory.setMinimumQuantity(
                minimumQuantity
        );


        return mapToResponse(
                inventoryRepository.save(inventory)
        );
    }


    // =====================================================
    // ACTIVATE
    // =====================================================

    @Override
    public BarInventoryResponse activateInventory(
            Long id) {

        BarInventory inventory =
                findInventory(id);

        inventory.setActive(true);

        return mapToResponse(
                inventoryRepository.save(inventory)
        );
    }


    // =====================================================
    // DEACTIVATE
    // =====================================================

    @Override
    public BarInventoryResponse deactivateInventory(
            Long id) {

        BarInventory inventory =
                findInventory(id);

        inventory.setActive(false);

        return mapToResponse(
                inventoryRepository.save(inventory)
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @Override
    public void deleteInventory(Long id) {

        BarInventory inventory =
                findInventory(id);


        if (transactionRepository
                .existsByInventoryId(id)) {

            throw new RuntimeException(
                    "Inventory cannot be deleted because transaction history exists. "
                    + "Deactivate it instead."
            );
        }


        inventoryRepository.delete(inventory);
    }


    // =====================================================
    // FIND INVENTORY
    // =====================================================

    private BarInventory findInventory(
            Long id) {

        if (id == null) {

            throw new RuntimeException(
                    "Inventory ID is required."
            );
        }


        return inventoryRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Inventory not found with id: "
                                        + id
                        )
                );
    }


    // =====================================================
    // NORMALIZE QR CODE
    // =====================================================

    private String normalizeQrCode(
            String qrCode) {

        if (qrCode == null) {
            return null;
        }

        String normalized =
                qrCode.trim();

        return normalized.isEmpty()
                ? null
                : normalized;
    }


    // =====================================================
    // VALIDATE QUANTITY
    // =====================================================

    private void validateQuantity(
            BigDecimal quantity,
            String fieldName) {

        if (quantity == null) {

            throw new RuntimeException(
                    fieldName + " is required."
            );
        }


        if (quantity.compareTo(
                BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    fieldName + " cannot be negative."
            );
        }
    }


    // =====================================================
    // ENTITY → RESPONSE
    // =====================================================

    private BarInventoryResponse mapToResponse(
            BarInventory inventory) {

        BarInventoryResponse response =
                new BarInventoryResponse();


        response.setId(
                inventory.getId()
        );

        response.setQrCode(
                inventory.getQrCode()
        );


        BarMenuItem menuItem =
                inventory.getMenuItem();


        if (menuItem != null) {

            response.setMenuItemId(
                    menuItem.getId()
            );

            response.setItemCode(
                    menuItem.getItemCode()
            );

            response.setItemName(
                    menuItem.getItemName()
            );


            if (menuItem.getCategory() != null) {

                response.setCategoryId(
                        menuItem.getCategory().getId()
                );

                response.setCategoryName(
                        menuItem.getCategory()
                                .getCategoryName()
                );
            }
        }


        response.setCurrentQuantity(
                inventory.getCurrentQuantity()
        );


        response.setUnit(
                inventory.getUnit()
        );


        response.setMinimumQuantity(
                inventory.getMinimumQuantity()
        );


        response.setLowStock(
                inventory.getCurrentQuantity()
                        .compareTo(
                                inventory.getMinimumQuantity()
                        ) <= 0
        );


        response.setActive(
                inventory.getActive()
        );


        response.setCreatedAt(
                inventory.getCreatedAt()
        );


        response.setUpdatedAt(
                inventory.getUpdatedAt()
        );


        return response;
    }
}