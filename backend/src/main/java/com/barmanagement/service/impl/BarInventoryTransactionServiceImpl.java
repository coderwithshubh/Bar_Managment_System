package com.barmanagement.service.impl;

import com.barmanagement.enums.InventoryTransactionType;
import com.barmanagement.model.BarInventory;
import com.barmanagement.model.BarInventoryTransaction;
import com.barmanagement.payload.request.BarInventoryTransactionRequest;
import com.barmanagement.payload.response.BarInventoryTransactionResponse;
import com.barmanagement.repository.BarInventoryRepository;
import com.barmanagement.repository.BarInventoryTransactionRepository;
import com.barmanagement.service.BarInventoryTransactionService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class BarInventoryTransactionServiceImpl
        implements BarInventoryTransactionService {

    private final BarInventoryRepository inventoryRepository;

    private final BarInventoryTransactionRepository
            transactionRepository;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public BarInventoryTransactionServiceImpl(
            BarInventoryRepository inventoryRepository,
            BarInventoryTransactionRepository transactionRepository) {

        this.inventoryRepository = inventoryRepository;
        this.transactionRepository = transactionRepository;
    }


    // =====================================================
    // CREATE TRANSACTION
    // =====================================================

    @Override
    public BarInventoryTransactionResponse
    createTransaction(
            BarInventoryTransactionRequest request) {

        validateRequest(request);


        BarInventory inventory =
                findInventory(
                        request.getInventoryId()
                );


        InventoryTransactionType type =
                request.getTransactionType();


        // =================================================
        // OPENING STOCK
        // =================================================

        if (type ==
                InventoryTransactionType.OPENING_STOCK) {

            throw new RuntimeException(
                    "Opening stock can only be created when inventory is created."
            );
        }


        BigDecimal current =
                inventory.getCurrentQuantity();

        BigDecimal quantity =
                request.getQuantity();

        BigDecimal newQuantity;


        // =================================================
        // STOCK IN
        // =================================================

        if (type ==
                InventoryTransactionType.STOCK_IN) {

            newQuantity =
                    current.add(quantity);
        }


        // =================================================
        // STOCK OUT
        // =================================================

        else if (type ==
                InventoryTransactionType.STOCK_OUT) {

            if (current.compareTo(quantity) < 0) {

                throw new RuntimeException(
                        "Insufficient stock. Current stock: "
                                + current
                                + " "
                                + inventory.getUnit()
                );
            }


            newQuantity =
                    current.subtract(quantity);
        }


        // =================================================
        // ADJUSTMENT
        // =================================================

        else if (type ==
                InventoryTransactionType.ADJUSTMENT) {

            if (request.getIncreaseStock() == null) {

                throw new RuntimeException(
                        "Adjustment direction is required."
                );
            }


            if (Boolean.TRUE.equals(
                    request.getIncreaseStock())) {

                newQuantity =
                        current.add(quantity);

            } else {

                if (current.compareTo(quantity) < 0) {

                    throw new RuntimeException(
                            "Adjustment cannot reduce stock below zero."
                    );
                }


                newQuantity =
                        current.subtract(quantity);
            }
        }

        else {

            throw new RuntimeException(
                    "Invalid transaction type."
            );
        }


        // =================================================
        // UPDATE CURRENT STOCK
        // =================================================

        inventory.setCurrentQuantity(
                newQuantity
        );


        inventoryRepository.save(
                inventory
        );


        // =================================================
        // CREATE HISTORY RECORD
        // =================================================

        BarInventoryTransaction transaction =
                new BarInventoryTransaction();


        transaction.setInventory(
                inventory
        );


        transaction.setTransactionType(
                type
        );


        transaction.setQuantity(
                quantity
        );


        transaction.setReason(
                request.getReason()
        );


        transaction.setReferenceNumber(
                request.getReferenceNumber()
        );


        BarInventoryTransaction saved =
                transactionRepository.save(
                        transaction
                );


        return mapToResponse(saved);
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public BarInventoryTransactionResponse
    getTransactionById(Long id) {

        if (id == null) {

            throw new RuntimeException(
                    "Transaction ID is required."
            );
        }


        BarInventoryTransaction transaction =
                transactionRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Transaction not found with id: "
                                                + id
                                )
                        );


        return mapToResponse(transaction);
    }


    // =====================================================
    // GET ALL
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<BarInventoryTransactionResponse>
    getAllTransactions() {

        return transactionRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =====================================================
    // GET BY INVENTORY
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<BarInventoryTransactionResponse>
    getTransactionsByInventory(
            Long inventoryId) {

        if (inventoryId == null) {

            throw new RuntimeException(
                    "Inventory ID is required."
            );
        }


        return transactionRepository
                .findByInventoryIdOrderByCreatedAtDesc(
                        inventoryId
                )
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =====================================================
    // GET BY TYPE
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<BarInventoryTransactionResponse>
    getTransactionsByType(
            InventoryTransactionType transactionType) {

        if (transactionType == null) {

            throw new RuntimeException(
                    "Transaction type is required."
            );
        }


        return transactionRepository
                .findByTransactionTypeOrderByCreatedAtDesc(
                        transactionType
                )
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =====================================================
    // VALIDATE REQUEST
    // =====================================================

    private void validateRequest(
            BarInventoryTransactionRequest request) {

        if (request == null) {

            throw new RuntimeException(
                    "Transaction request is required."
            );
        }


        if (request.getInventoryId() == null) {

            throw new RuntimeException(
                    "Inventory is required."
            );
        }


        if (request.getTransactionType() == null) {

            throw new RuntimeException(
                    "Transaction type is required."
            );
        }


        if (request.getQuantity() == null) {

            throw new RuntimeException(
                    "Transaction quantity is required."
            );
        }


        if (request.getQuantity()
                .compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Transaction quantity must be greater than zero."
            );
        }
    }


    // =====================================================
    // FIND INVENTORY
    // =====================================================

    private BarInventory findInventory(
            Long inventoryId) {

        return inventoryRepository
                .findById(inventoryId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Inventory not found with id: "
                                        + inventoryId
                        )
                );
    }


    // =====================================================
    // ENTITY → RESPONSE
    // =====================================================

    private BarInventoryTransactionResponse
    mapToResponse(
            BarInventoryTransaction transaction) {

        BarInventoryTransactionResponse response =
                new BarInventoryTransactionResponse();


        response.setId(
                transaction.getId()
        );


        BarInventory inventory =
                transaction.getInventory();


        if (inventory != null) {

            response.setInventoryId(
                    inventory.getId()
            );


            response.setUnit(
                    inventory.getUnit()
            );


            if (inventory.getMenuItem() != null) {

                response.setMenuItemId(
                        inventory.getMenuItem().getId()
                );


                response.setItemCode(
                        inventory.getMenuItem().getItemCode()
                );


                response.setItemName(
                        inventory.getMenuItem().getItemName()
                );


                if (inventory.getMenuItem()
                        .getCategory() != null) {

                    response.setCategoryId(
                            inventory.getMenuItem()
                                    .getCategory()
                                    .getId()
                    );


                    response.setCategoryName(
                            inventory.getMenuItem()
                                    .getCategory()
                                    .getCategoryName()
                    );
                }
            }
        }


        response.setTransactionType(
                transaction.getTransactionType()
        );


        response.setQuantity(
                transaction.getQuantity()
        );


        response.setReason(
                transaction.getReason()
        );


        response.setReferenceNumber(
                transaction.getReferenceNumber()
        );


        response.setCreatedAt(
                transaction.getCreatedAt()
        );


        return response;
    }
}