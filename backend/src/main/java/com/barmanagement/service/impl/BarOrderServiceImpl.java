package com.barmanagement.service.impl;

import com.barmanagement.enums.BarOrderStatus;
import com.barmanagement.enums.BarOrderType;
import com.barmanagement.enums.InventoryTransactionType;

import com.barmanagement.model.BarInventory;
import com.barmanagement.model.BarMenuItem;
import com.barmanagement.model.BarOrder;
import com.barmanagement.model.BarOrderItem;
import com.barmanagement.model.BarTable;

import com.barmanagement.payload.request.BarInventoryTransactionRequest;
import com.barmanagement.payload.request.BarOrderItemRequest;
import com.barmanagement.payload.request.BarOrderRequest;

import com.barmanagement.payload.response.BarOrderItemResponse;
import com.barmanagement.payload.response.BarOrderResponse;

import com.barmanagement.repository.BarInventoryRepository;
import com.barmanagement.repository.BarMenuItemRepository;
import com.barmanagement.repository.BarOrderRepository;
import com.barmanagement.repository.BarTableRepository;

import com.barmanagement.service.BarInventoryTransactionService;
import com.barmanagement.service.BarOrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@Transactional
public class BarOrderServiceImpl
        implements BarOrderService {


    // ==========================================
    // REPOSITORIES
    // ==========================================

    @Autowired
    private BarOrderRepository barOrderRepository;


    @Autowired
    private BarMenuItemRepository barMenuItemRepository;


    @Autowired
    private BarTableRepository barTableRepository;


    @Autowired
    private BarInventoryRepository barInventoryRepository;


    // ==========================================
    // SERVICES
    // ==========================================

    @Autowired
    private BarInventoryTransactionService
            barInventoryTransactionService;


    /*
     * Tax rate is currently ZERO because the
     * client's actual GST/tax configuration
     * has not been confirmed yet.
     *
     * Do not hard-code 5%, 12%, 18%, etc.
     */
    private static final BigDecimal TAX_RATE =
            BigDecimal.ZERO;


    // ==========================================
    // CREATE ORDER
    // ==========================================

    @Override
    public BarOrderResponse createOrder(
            BarOrderRequest request) {

        validateCreateRequest(request);


        // --------------------------------------
        // Validate Table for DINE_IN
        // --------------------------------------

        BarTable table = null;

        if (request.getOrderType()
                == BarOrderType.DINE_IN) {

            table = findAvailableTable(
                    request.getTableId()
            );
        }


        // --------------------------------------
        // Prevent Duplicate Menu Items
        // --------------------------------------

        Set<Long> menuItemIds =
                new HashSet<>();


        for (BarOrderItemRequest itemRequest
                : request.getItems()) {

            if (!menuItemIds.add(
                    itemRequest.getMenuItemId())) {

                throw new RuntimeException(
                        "Duplicate menu item in order: "
                                + itemRequest.getMenuItemId()
                );
            }
        }


        // ======================================
        // CREATE ORDER
        // ======================================

        BarOrder order =
                new BarOrder();


        order.setOrderNumber(
                generateOrderNumber()
        );


        order.setOrderType(
                request.getOrderType()
        );


        order.setStatus(
                BarOrderStatus.OPEN
        );


        order.setTable(
                table
        );


        order.setDiscount(
                normalizeDiscount(
                        request.getDiscount()
                )
        );


        order.setNotes(
                normalizeNotes(
                        request.getNotes()
                )
        );


        // ======================================
        // CREATE ORDER ITEMS
        // ======================================

        BigDecimal subtotal =
                BigDecimal.ZERO;


        for (BarOrderItemRequest itemRequest
                : request.getItems()) {


            // ----------------------------------
            // Find Active Menu Item
            // ----------------------------------

            BarMenuItem menuItem =
                    findActiveMenuItem(
                            itemRequest.getMenuItemId()
                    );


            // ----------------------------------
            // Get Price From Database
            // ----------------------------------

            BigDecimal unitPrice =
                    menuItem.getPrice();


            Integer quantity =
                    itemRequest.getQuantity();


            // ----------------------------------
            // Calculate Line Total
            // ----------------------------------

            BigDecimal lineTotal =
                    unitPrice.multiply(
                            BigDecimal.valueOf(
                                    quantity
                            )
                    );


            // ==================================
            // CREATE ORDER ITEM
            // ==================================

            BarOrderItem orderItem =
                    new BarOrderItem();


            orderItem.setMenuItem(
                    menuItem
            );


            /*
             * Snapshot of menu item name.
             *
             * If menu item name changes later,
             * old order still keeps original name.
             */

            orderItem.setItemNameSnapshot(
                    menuItem.getItemName()
            );


            /*
             * Snapshot of price.
             *
             * If menu price changes later,
             * old order still keeps original price.
             */

            orderItem.setUnitPrice(
                    unitPrice
            );


            orderItem.setQuantity(
                    quantity
            );


            orderItem.setLineTotal(
                    lineTotal
            );


            // ----------------------------------
            // Add Item To Order
            // ----------------------------------

            order.addOrderItem(
                    orderItem
            );


            // ----------------------------------
            // Add To Subtotal
            // ----------------------------------

            subtotal =
                    subtotal.add(
                            lineTotal
                    );
        }


        // ======================================
        // CALCULATE TOTALS
        // ======================================

        BigDecimal discount =
                order.getDiscount();


        // --------------------------------------
        // Discount Validation
        // --------------------------------------

        if (discount.compareTo(subtotal) > 0) {

            throw new RuntimeException(
                    "Discount cannot be greater than subtotal."
            );
        }


        // --------------------------------------
        // Taxable Amount
        // --------------------------------------

        BigDecimal taxableAmount =
                subtotal.subtract(
                        discount
                );


        // --------------------------------------
        // Tax
        // --------------------------------------

        BigDecimal tax =
                taxableAmount.multiply(
                        TAX_RATE
                );


        // --------------------------------------
        // Grand Total
        // --------------------------------------

        BigDecimal grandTotal =
                taxableAmount.add(
                        tax
                );


        order.setSubtotal(
                subtotal
        );


        order.setTax(
                tax
        );


        order.setGrandTotal(
                grandTotal
        );


        // ======================================
        // SAVE ORDER
        // ======================================

        BarOrder savedOrder =
                barOrderRepository.save(
                        order
                );


        // ======================================
        // OCCUPY TABLE
        // ======================================

        if (table != null) {

            table.setStatus(
                    BarTable.Status.OCCUPIED
            );

            barTableRepository.save(
                    table
            );
        }


        return mapToResponse(
                savedOrder
        );
    }


    // ==========================================
    // GET ALL ORDERS
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public List<BarOrderResponse> getAllOrders() {

        return barOrderRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // ==========================================
    // GET ORDER BY ID
    // ==========================================

    @Override
    @Transactional(readOnly = true)
    public BarOrderResponse getOrderById(
            Long id) {

        BarOrder order =
                findOrderById(id);


        return mapToResponse(
                order
        );
    }


    // ==========================================
    // UPDATE ORDER STATUS
    // ==========================================

    @Override
    public BarOrderResponse updateOrderStatus(
            Long id,
            String status) {

        BarOrder order =
                findOrderById(id);


        BarOrderStatus currentStatus =
                order.getStatus();


        BarOrderStatus newStatus =
                parseStatus(status);


        validateStatusTransition(
                currentStatus,
                newStatus
        );


        // ======================================
        // OPEN → CONFIRMED
        // INVENTORY STOCK OUT
        // ======================================

        if (currentStatus == BarOrderStatus.OPEN
                && newStatus == BarOrderStatus.CONFIRMED) {

            deductInventoryForOrder(
                    order
            );
        }


        // ======================================
        // UPDATE ORDER STATUS
        // ======================================

        order.setStatus(
                newStatus
        );


        BarOrder updatedOrder =
                barOrderRepository.save(
                        order
                );


        return mapToResponse(
                updatedOrder
        );
    }


    // ==========================================
    // DEDUCT INVENTORY FOR ORDER
    // ==========================================

    private void deductInventoryForOrder(
            BarOrder order) {

        if (order.getOrderItems() == null
                || order.getOrderItems().isEmpty()) {

            throw new RuntimeException(
                    "Cannot confirm order without items."
            );
        }


        for (BarOrderItem orderItem
                : order.getOrderItems()) {

            if (orderItem == null) {

                throw new RuntimeException(
                        "Order item cannot be null."
                );
            }


            BarMenuItem menuItem =
                    orderItem.getMenuItem();


            if (menuItem == null) {

                throw new RuntimeException(
                        "Menu item is missing for order item."
                );
            }


            // ----------------------------------
            // Consumption Quantity
            // ----------------------------------

            BigDecimal consumptionQuantity =
                    menuItem.getConsumptionQuantity();


            if (consumptionQuantity == null
                    || consumptionQuantity
                    .compareTo(BigDecimal.ZERO) <= 0) {

                throw new RuntimeException(
                        "Invalid consumption quantity for menu item: "
                                + menuItem.getItemName()
                );
            }


            // ----------------------------------
            // Order Quantity
            // ----------------------------------

            Integer orderQuantity =
                    orderItem.getQuantity();


            if (orderQuantity == null
                    || orderQuantity <= 0) {

                throw new RuntimeException(
                        "Invalid order quantity for menu item: "
                                + menuItem.getItemName()
                );
            }


            // ==================================
            // CALCULATE REQUIRED STOCK
            // ==================================

            BigDecimal requiredQuantity =
                    consumptionQuantity.multiply(
                            BigDecimal.valueOf(
                                    orderQuantity
                            )
                    );


            // ==================================
            // FIND INVENTORY
            // ==================================

            BarInventory inventory =
                    barInventoryRepository
                            .findByMenuItemId(
                                    menuItem.getId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Inventory not found for menu item: "
                                                    + menuItem.getItemName()
                                    )
                            );


            // ==================================
            // ACTIVE INVENTORY CHECK
            // ==================================

            if (!Boolean.TRUE.equals(
                    inventory.getActive())) {

                throw new RuntimeException(
                        "Inventory is inactive for menu item: "
                                + menuItem.getItemName()
                );
            }


            // ==================================
            // STOCK CHECK
            // ==================================

            BigDecimal currentQuantity =
                    inventory.getCurrentQuantity();


            if (currentQuantity == null) {

                throw new RuntimeException(
                        "Current inventory quantity is missing for menu item: "
                                + menuItem.getItemName()
                );
            }


            if (currentQuantity.compareTo(
                    requiredQuantity) < 0) {

                throw new RuntimeException(
                        "Insufficient stock for menu item: "
                                + menuItem.getItemName()
                                + ". Required: "
                                + requiredQuantity
                                + " "
                                + inventory.getUnit()
                                + ", Available: "
                                + currentQuantity
                                + " "
                                + inventory.getUnit()
                );
            }


            // ==================================
            // CREATE STOCK OUT TRANSACTION
            // ==================================

            BarInventoryTransactionRequest
                    transactionRequest =
                    new BarInventoryTransactionRequest();


            transactionRequest.setInventoryId(
                    inventory.getId()
            );


            transactionRequest.setTransactionType(
                    InventoryTransactionType.STOCK_OUT
            );


            transactionRequest.setQuantity(
                    requiredQuantity
            );


            transactionRequest.setReason(
                    "Order consumption - "
                            + order.getOrderNumber()
            );


            transactionRequest.setReferenceNumber(
                    order.getOrderNumber()
            );


            // ==================================
            // SAVE STOCK OUT
            // ==================================

            barInventoryTransactionService
                    .createTransaction(
                            transactionRequest
                    );
        }
    }


    // ==========================================
    // CANCEL ORDER
    // ==========================================

    @Override
    public BarOrderResponse cancelOrder(
            Long id) {

        BarOrder order =
                findOrderById(id);


        if (order.getStatus()
                == BarOrderStatus.CANCELLED) {

            throw new RuntimeException(
                    "Order is already cancelled."
            );
        }


        if (order.getStatus()
                == BarOrderStatus.COMPLETED) {

            throw new RuntimeException(
                    "Completed order cannot be cancelled."
            );
        }


        /*
         * IMPORTANT:
         *
         * Inventory is deducted only when
         * OPEN → CONFIRMED.
         *
         * Therefore an OPEN order cancellation
         * does not require stock restoration.
         *
         * However, a CONFIRMED/PREPARING/READY/SERVED
         * order has already consumed inventory.
         *
         * We do NOT automatically add stock back
         * during cancellation because the physical
         * stock may already have been consumed/served.
         */

        order.setStatus(
                BarOrderStatus.CANCELLED
        );


        BarOrder updatedOrder =
                barOrderRepository.save(
                        order
                );


        // --------------------------------------
        // Release Table
        // --------------------------------------

        releaseTableAfterCancellation(
                order
        );


        return mapToResponse(
                updatedOrder
        );
    }


    // ==========================================
    // COMPLETE ORDER
    // ==========================================

    @Override
    public BarOrderResponse completeOrder(
            Long id) {

        BarOrder order =
                findOrderById(id);


        if (order.getStatus()
                == BarOrderStatus.COMPLETED) {

            throw new RuntimeException(
                    "Order is already completed."
            );
        }


        if (order.getStatus()
                == BarOrderStatus.CANCELLED) {

            throw new RuntimeException(
                    "Cancelled order cannot be completed."
            );
        }


        /*
         * Order completion is kept separate from billing.
         *
         * Flow:
         *
         * Order
         *   ↓
         * COMPLETED
         *   ↓
         * Generate Bill
         *   ↓
         * Payment
         *
         * The table remains OCCUPIED until payment succeeds.
         * Successful payment moves the table to CLEANING.
         */

        order.setStatus(
                BarOrderStatus.COMPLETED
        );


        BarOrder completedOrder =
                barOrderRepository.save(
                        order
                );


        return mapToResponse(
                completedOrder
        );
    }


    // ==========================================
    // FIND ORDER BY ID
    // ==========================================

    private BarOrder findOrderById(
            Long id) {

        if (id == null) {

            throw new RuntimeException(
                    "Order ID is required."
            );
        }


        return barOrderRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Bar order not found with id: "
                                        + id
                        )
                );
    }


    // ==========================================
    // FIND AVAILABLE TABLE
    // ==========================================

    private BarTable findAvailableTable(
            Long tableId) {

        if (tableId == null) {

            throw new RuntimeException(
                    "Table ID is required for DINE_IN order."
            );
        }


        BarTable table =
                barTableRepository
                        .findById(tableId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bar table not found with id: "
                                                + tableId
                                )
                        );


        // --------------------------------------
        // Active Check
        // --------------------------------------

        if (!Boolean.TRUE.equals(
                table.getActive())) {

            throw new RuntimeException(
                    "Cannot create order for inactive table."
            );
        }


        // --------------------------------------
        // Status Check
        // --------------------------------------

        if (table.getStatus()
                != BarTable.Status.AVAILABLE) {

            throw new RuntimeException(
                    "Table "
                            + table.getTableNumber()
                            + " is not available. Current status: "
                            + table.getStatus()
            );
        }


        // --------------------------------------
        // Existing OPEN Order Check
        // --------------------------------------

        if (barOrderRepository
                .existsByTable_IdAndStatus(
                        table.getId(),
                        BarOrderStatus.OPEN
                )) {

            throw new RuntimeException(
                    "An open order already exists for table "
                            + table.getTableNumber()
            );
        }


        return table;
    }


    // ==========================================
    // FIND ACTIVE MENU ITEM
    // ==========================================

    private BarMenuItem findActiveMenuItem(
            Long menuItemId) {

        if (menuItemId == null) {

            throw new RuntimeException(
                    "Menu item ID is required."
            );
        }


        BarMenuItem menuItem =
                barMenuItemRepository
                        .findById(menuItemId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Menu item not found with id: "
                                                + menuItemId
                                )
                        );


        // --------------------------------------
        // Active Check
        // --------------------------------------

        if (!Boolean.TRUE.equals(
                menuItem.getActive())) {

            throw new RuntimeException(
                    "Menu item is inactive: "
                            + menuItem.getItemName()
            );
        }


        // --------------------------------------
        // Price Check
        // --------------------------------------

        if (menuItem.getPrice() == null
                || menuItem.getPrice()
                .compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Invalid price for menu item: "
                            + menuItem.getItemName()
            );
        }


        return menuItem;
    }


    // ==========================================
    // VALIDATE CREATE REQUEST
    // ==========================================

    private void validateCreateRequest(
            BarOrderRequest request) {

        if (request == null) {

            throw new RuntimeException(
                    "Order request is required."
            );
        }


        // --------------------------------------
        // Order Type
        // --------------------------------------

        if (request.getOrderType() == null) {

            throw new RuntimeException(
                    "Order type is required."
            );
        }


        // --------------------------------------
        // Items
        // --------------------------------------

        if (request.getItems() == null
                || request.getItems().isEmpty()) {

            throw new RuntimeException(
                    "Order must contain at least one item."
            );
        }


        // --------------------------------------
        // Validate Each Item
        // --------------------------------------

        for (BarOrderItemRequest item
                : request.getItems()) {

            if (item == null) {

                throw new RuntimeException(
                        "Order item cannot be null."
                );
            }


            if (item.getMenuItemId() == null) {

                throw new RuntimeException(
                        "Menu item ID is required."
                );
            }


            if (item.getQuantity() == null
                    || item.getQuantity() <= 0) {

                throw new RuntimeException(
                        "Quantity must be greater than zero."
                );
            }
        }


        // --------------------------------------
        // Discount
        // --------------------------------------

        if (request.getDiscount() != null
                && request.getDiscount()
                .compareTo(BigDecimal.ZERO) < 0) {

            throw new RuntimeException(
                    "Discount cannot be negative."
            );
        }


        // --------------------------------------
        // TAKEAWAY
        // --------------------------------------

        if (request.getOrderType()
                == BarOrderType.TAKEAWAY) {

            /*
             * Takeaway order does not require
             * a table.
             */

            request.setTableId(
                    null
            );
        }
    }


    // ==========================================
    // NORMALIZE DISCOUNT
    // ==========================================

    private BigDecimal normalizeDiscount(
            BigDecimal discount) {

        if (discount == null) {

            return BigDecimal.ZERO;
        }


        return discount;
    }


    // ==========================================
    // NORMALIZE NOTES
    // ==========================================

    private String normalizeNotes(
            String notes) {

        if (notes == null) {

            return null;
        }


        String normalized =
                notes.trim();


        if (normalized.isEmpty()) {

            return null;
        }


        if (normalized.length() > 500) {

            throw new RuntimeException(
                    "Notes cannot exceed 500 characters."
            );
        }


        return normalized;
    }


    // ==========================================
    // GENERATE ORDER NUMBER
    // ==========================================

    private String generateOrderNumber() {

        long nextNumber =
                barOrderRepository.count() + 1;


        String orderNumber;


        do {

            orderNumber =
                    String.format(
                            "ORD-%04d",
                            nextNumber
                    );


            nextNumber++;


        } while (
                barOrderRepository
                        .existsByOrderNumber(
                                orderNumber
                        )
        );


        return orderNumber;
    }


    // ==========================================
    // PARSE STATUS
    // ==========================================

    private BarOrderStatus parseStatus(
            String status) {

        if (status == null
                || status.trim().isEmpty()) {

            throw new RuntimeException(
                    "Order status is required."
            );
        }


        try {

            return BarOrderStatus.valueOf(
                    status
                            .trim()
                            .toUpperCase()
            );

        } catch (Exception ex) {

            throw new RuntimeException(
                    "Invalid order status. Allowed values: "
                            + "OPEN, CONFIRMED, PREPARING, "
                            + "READY, SERVED, COMPLETED, CANCELLED"
            );
        }
    }


    // ==========================================
    // VALIDATE STATUS TRANSITION
    // ==========================================

    private void validateStatusTransition(
            BarOrderStatus currentStatus,
            BarOrderStatus newStatus) {

        if (currentStatus == null) {

            throw new RuntimeException(
                    "Current order status is missing."
            );
        }


        if (currentStatus == newStatus) {

            throw new RuntimeException(
                    "Order is already in status "
                            + newStatus
            );
        }


        if (currentStatus
                == BarOrderStatus.CANCELLED) {

            throw new RuntimeException(
                    "Cancelled order cannot change status."
            );
        }


        if (currentStatus
                == BarOrderStatus.COMPLETED) {

            throw new RuntimeException(
                    "Completed order cannot change status."
            );
        }


        // ======================================
        // NORMAL ORDER FLOW
        // ======================================

        boolean valid = false;


        switch (currentStatus) {


            case OPEN:

                valid =
                        newStatus
                                == BarOrderStatus.CONFIRMED

                                || newStatus
                                == BarOrderStatus.CANCELLED;

                break;


            case CONFIRMED:

                valid =
                        newStatus
                                == BarOrderStatus.PREPARING

                                || newStatus
                                == BarOrderStatus.CANCELLED;

                break;


            case PREPARING:

                valid =
                        newStatus
                                == BarOrderStatus.READY;

                break;


            case READY:

                valid =
                        newStatus
                                == BarOrderStatus.SERVED;

                break;


            case SERVED:

                valid =
                        newStatus
                                == BarOrderStatus.COMPLETED;

                break;


            default:

                valid = false;
        }


        if (!valid) {

            throw new RuntimeException(
                    "Invalid order status transition: "
                            + currentStatus
                            + " → "
                            + newStatus
            );
        }
    }


    // ==========================================
    // RELEASE TABLE AFTER CANCELLATION
    // ==========================================

    private void releaseTableAfterCancellation(
            BarOrder order) {

        if (order.getTable() == null) {

            return;
        }


        BarTable table =
                order.getTable();


        table.setStatus(
                BarTable.Status.AVAILABLE
        );


        barTableRepository.save(
                table
        );
    }


    // ==========================================
    // ENTITY → RESPONSE
    // ==========================================

    private BarOrderResponse mapToResponse(
            BarOrder order) {

        BarOrderResponse response =
                new BarOrderResponse();


        response.setId(
                order.getId()
        );


        response.setOrderNumber(
                order.getOrderNumber()
        );


        response.setOrderType(
                order.getOrderType()
        );


        response.setStatus(
                order.getStatus()
        );


        // --------------------------------------
        // Table Information
        // --------------------------------------

        if (order.getTable() != null) {

            response.setTableId(
                    order.getTable().getId()
            );


            response.setTableNumber(
                    order.getTable().getTableNumber()
            );
        }


        // --------------------------------------
        // Financial Information
        // --------------------------------------

        response.setSubtotal(
                order.getSubtotal()
        );


        response.setDiscount(
                order.getDiscount()
        );


        response.setTax(
                order.getTax()
        );


        response.setGrandTotal(
                order.getGrandTotal()
        );


        // --------------------------------------
        // Other Information
        // --------------------------------------

        response.setNotes(
                order.getNotes()
        );


        response.setCreatedAt(
                order.getCreatedAt()
        );


        response.setUpdatedAt(
                order.getUpdatedAt()
        );


        // ======================================
        // ORDER ITEMS
        // ======================================

        List<BarOrderItemResponse> itemResponses =
                order.getOrderItems()
                        .stream()
                        .map(this::mapItemToResponse)
                        .collect(Collectors.toList());


        response.setItems(
                itemResponses
        );


        return response;
    }


    // ==========================================
    // ORDER ITEM → RESPONSE
    // ==========================================

    private BarOrderItemResponse mapItemToResponse(
            BarOrderItem item) {

        BarOrderItemResponse response =
                new BarOrderItemResponse();


        response.setId(
                item.getId()
        );


        // --------------------------------------
        // Order ID
        // --------------------------------------

        if (item.getOrder() != null) {

            response.setOrderId(
                    item.getOrder().getId()
            );
        }


        // --------------------------------------
        // Menu Item ID
        // --------------------------------------

        if (item.getMenuItem() != null) {

            response.setMenuItemId(
                    item.getMenuItem().getId()
            );
        }


        /*
         * IMPORTANT:
         *
         * Use snapshot name instead of current
         * menu item name.
         */

        response.setItemName(
                item.getItemNameSnapshot()
        );


        response.setUnitPrice(
                item.getUnitPrice()
        );


        response.setQuantity(
                item.getQuantity()
        );


        response.setLineTotal(
                item.getLineTotal()
        );


        return response;
    }
}