package com.barmanagement.service.impl;

import com.barmanagement.enums.BarBillStatus;
import com.barmanagement.enums.BarOrderStatus;
import com.barmanagement.model.BarBill;
import com.barmanagement.model.BarOrder;
import com.barmanagement.model.BarTable;
import com.barmanagement.payload.request.BarBillPaymentRequest;
import com.barmanagement.payload.request.BarBillRequest;
import com.barmanagement.payload.response.BarBillResponse;
import com.barmanagement.repository.BarBillRepository;
import com.barmanagement.repository.BarOrderRepository;
import com.barmanagement.repository.BarTableRepository;
import com.barmanagement.service.BarBillService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@Transactional
public class BarBillServiceImpl implements BarBillService {

    private static final BigDecimal ONE_HUNDRED =
            new BigDecimal("100");

    private final BarBillRepository barBillRepository;
    private final BarOrderRepository barOrderRepository;
    private final BarTableRepository barTableRepository;

    public BarBillServiceImpl(
            BarBillRepository barBillRepository,
            BarOrderRepository barOrderRepository,
            BarTableRepository barTableRepository
    ) {
        this.barBillRepository = barBillRepository;
        this.barOrderRepository = barOrderRepository;
        this.barTableRepository = barTableRepository;
    }

    // =====================================================
    // CREATE BILL NUMBER
    // =====================================================

    private String generateBillNumber() {

        String date =
                LocalDate.now()
                        .format(
                                DateTimeFormatter.ofPattern("yyyyMMdd")
                        );

        long sequence =
                barBillRepository.count() + 1;

        String billNumber;

        do {

            billNumber =
                    String.format(
                            "BBILL-%s-%04d",
                            date,
                            sequence
                    );

            sequence++;

        } while (
                barBillRepository
                        .existsByBillNumber(billNumber)
        );

        return billNumber;
    }

    // =====================================================
    // MONEY ROUNDING
    // =====================================================

    private BigDecimal money(BigDecimal value) {

        if (value == null) {
            return BigDecimal.ZERO.setScale(
                    2,
                    RoundingMode.HALF_UP
            );
        }

        return value.setScale(
                2,
                RoundingMode.HALF_UP
        );
    }

    // =====================================================
    // CREATE BILL
    // =====================================================

    @Override
    public BarBillResponse createBill(
            BarBillRequest request
    ) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Bill request cannot be empty."
            );
        }

        if (request.getOrderId() == null) {
            throw new IllegalArgumentException(
                    "Order ID is required."
            );
        }

        // ---------------------------------------------
        // FIND ORDER
        // ---------------------------------------------

        BarOrder order =
                barOrderRepository.findById(
                        request.getOrderId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Bar order not found: "
                                        + request.getOrderId()
                        )
                );

        // ---------------------------------------------
        // VALIDATE ORDER STATUS
        // ---------------------------------------------

        if (order.getStatus() != BarOrderStatus.COMPLETED) {

            throw new IllegalStateException(
                    "Bill can be generated only for a "
                            + "COMPLETED order."
            );
        }

        // ---------------------------------------------
        // CHECK EXISTING BILL
        // ---------------------------------------------

        if (
                barBillRepository.existsByOrderId(
                        order.getId()
                )
        ) {

            throw new IllegalStateException(
                    "Bill already exists for order: "
                            + order.getOrderNumber()
            );
        }

        // ---------------------------------------------
        // SNAPSHOT ORDER TOTALS
        // ---------------------------------------------
        //
        // Bill must preserve the amount calculated by
        // the completed order. We do not recalculate the
        // financial total from frontend input here.
        // This prevents the bill from disagreeing with
        // the original order.
        // ---------------------------------------------

        BigDecimal subtotal =
                money(order.getSubtotal());

        BigDecimal discount =
                money(order.getDiscount());

        BigDecimal taxAmount =
                money(order.getTax());

        BigDecimal taxableAmount =
                money(subtotal.subtract(discount));

        if (subtotal.compareTo(BigDecimal.ZERO) < 0) {

            throw new IllegalStateException(
                    "Order subtotal cannot be negative."
            );
        }

        if (discount.compareTo(BigDecimal.ZERO) < 0) {

            throw new IllegalStateException(
                    "Order discount cannot be negative."
            );
        }

        if (discount.compareTo(subtotal) > 0) {

            throw new IllegalStateException(
                    "Order discount cannot be greater than subtotal."
            );
        }

        if (taxAmount.compareTo(BigDecimal.ZERO) < 0) {

            throw new IllegalStateException(
                    "Order tax cannot be negative."
            );
        }

        BigDecimal grandTotal =
                money(order.getGrandTotal());

        /*
         * Current order tax configuration is 0%.
         * The bill stores the percentage separately
         * for future tax configuration.
         */
        BigDecimal taxPercent =
                BigDecimal.ZERO;

        if (taxableAmount.compareTo(BigDecimal.ZERO) > 0
                && taxAmount.compareTo(BigDecimal.ZERO) > 0) {

            taxPercent =
                    taxAmount
                            .multiply(ONE_HUNDRED)
                            .divide(
                                    taxableAmount,
                                    2,
                                    RoundingMode.HALF_UP
                            );
        }

        // ---------------------------------------------
        // CREATE BILL
        // ---------------------------------------------

        BarBill bill = new BarBill();

        bill.setBillNumber(
                generateBillNumber()
        );

        bill.setOrderId(
                order.getId()
        );

        bill.setSubtotal(
                subtotal
        );

        bill.setDiscountAmount(
                discount
        );

        bill.setTaxableAmount(
                taxableAmount
        );

        bill.setTaxPercent(
                taxPercent
        );

        bill.setTaxAmount(
                taxAmount
        );

        bill.setGrandTotal(
                grandTotal
        );

        // ---------------------------------------------
        // PAYMENT DEFAULT
        // ---------------------------------------------

        bill.setPaymentStatus(
                BarBillStatus.UNPAID
        );

        bill.setPaymentMethod(
                null
        );

        bill.setRemarks(
                request.getRemarks()
        );

        // ---------------------------------------------
        // SAVE
        // ---------------------------------------------

        BarBill savedBill =
                barBillRepository.save(bill);

        return mapToResponse(savedBill, order);
    }

    // =====================================================
    // GET ALL BILLS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<BarBillResponse> getAllBills() {

        return barBillRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(bill -> {

                    BarOrder order =
                            barOrderRepository.findById(
                                    bill.getOrderId()
                            ).orElse(null);

                    return mapToResponse(
                            bill,
                            order
                    );
                })
                .toList();
    }

    // =====================================================
    // GET BILL BY ID
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public BarBillResponse getBillById(Long id) {

        BarBill bill =
                barBillRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bar bill not found: "
                                                + id
                                )
                        );

        BarOrder order =
                barOrderRepository.findById(
                        bill.getOrderId()
                ).orElse(null);

        return mapToResponse(
                bill,
                order
        );
    }

    // =====================================================
    // GET BILL BY BILL NUMBER
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public BarBillResponse getBillByNumber(
            String billNumber
    ) {

        if (
                billNumber == null
                        || billNumber.trim().isEmpty()
        ) {
            throw new IllegalArgumentException(
                    "Bill number is required."
            );
        }

        BarBill bill =
                barBillRepository
                        .findByBillNumber(
                                billNumber.trim()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bar bill not found: "
                                                + billNumber
                                )
                        );

        BarOrder order =
                barOrderRepository.findById(
                        bill.getOrderId()
                ).orElse(null);

        return mapToResponse(
                bill,
                order
        );
    }

    // =====================================================
    // GET BILL BY ORDER ID
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public BarBillResponse getBillByOrderId(
            Long orderId
    ) {

        BarBill bill =
                barBillRepository
                        .findByOrderId(orderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No bill found for order: "
                                                + orderId
                                )
                        );

        BarOrder order =
                barOrderRepository.findById(
                        orderId
                ).orElse(null);

        return mapToResponse(
                bill,
                order
        );
    }

    // =====================================================
    // GET BILLS BY PAYMENT STATUS
    // =====================================================

    @Override
    @Transactional(readOnly = true)
    public List<BarBillResponse> getBillsByPaymentStatus(
            String paymentStatus
    ) {

        if (
                paymentStatus == null
                        || paymentStatus.trim().isEmpty()
        ) {
            throw new IllegalArgumentException(
                    "Payment status is required."
            );
        }

        BarBillStatus status;

        try {

            status =
                    BarBillStatus.valueOf(
                            paymentStatus
                                    .trim()
                                    .toUpperCase()
                    );

        } catch (IllegalArgumentException ex) {

            throw new IllegalArgumentException(
                    "Invalid payment status: "
                            + paymentStatus
                            + ". Allowed values: "
                            + "UNPAID, PAID, VOID"
            );
        }

        return barBillRepository
                .findByPaymentStatusOrderByCreatedAtDesc(
                        status
                )
                .stream()
                .map(bill -> {

                    BarOrder order =
                            barOrderRepository.findById(
                                    bill.getOrderId()
                            ).orElse(null);

                    return mapToResponse(
                            bill,
                            order
                    );
                })
                .toList();
    }

    // =====================================================
    // UPDATE PAYMENT
    // =====================================================

    @Override
    public BarBillResponse updatePayment(
            Long id,
            BarBillPaymentRequest request
    ) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Payment request cannot be empty."
            );
        }

        if (request.getPaymentMethod() == null) {
            throw new IllegalArgumentException(
                    "Payment method is required."
            );
        }

        BarBill bill =
                barBillRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bar bill not found: "
                                                + id
                                )
                        );

        // ---------------------------------------------
        // VOID BILL
        // ---------------------------------------------

        if (
                bill.getPaymentStatus()
                        == BarBillStatus.VOID
        ) {

            throw new IllegalStateException(
                    "A void bill cannot be paid."
            );
        }

        // ---------------------------------------------
        // ALREADY PAID
        // ---------------------------------------------

        if (
                bill.getPaymentStatus()
                        == BarBillStatus.PAID
        ) {

            throw new IllegalStateException(
                    "This bill is already paid."
            );
        }

        // ---------------------------------------------
        // UPDATE PAYMENT
        // ---------------------------------------------

        bill.setPaymentMethod(
                request.getPaymentMethod()
        );

        bill.setPaymentStatus(
                BarBillStatus.PAID
        );

        bill.setPaidAt(
                LocalDateTime.now()
        );

        if (
                request.getRemarks() != null
                        && !request.getRemarks().isBlank()
        ) {

            bill.setRemarks(
                    request.getRemarks().trim()
            );
        }

        BarBill updatedBill =
                barBillRepository.save(bill);

        BarOrder order =
                barOrderRepository.findById(
                        bill.getOrderId()
                ).orElse(null);

        // ---------------------------------------------
        // RELEASE TABLE AFTER SUCCESSFUL PAYMENT
        // ---------------------------------------------
        //
        // Order is already COMPLETED.
        // Payment completion is the financial close.
        // Move the dine-in table to CLEANING first.
        // Staff can later mark it AVAILABLE.
        // ---------------------------------------------

        if (order != null
                && order.getTable() != null) {

            BarTable table =
                    order.getTable();

            table.setStatus(
                    BarTable.Status.CLEANING
            );

            barTableRepository.save(table);
        }

        return mapToResponse(
                updatedBill,
                order
        );
    }

    // =====================================================
    // VOID BILL
    // =====================================================

    @Override
    public BarBillResponse voidBill(
            Long id,
            String reason
    ) {

        if (
                reason == null
                        || reason.trim().isEmpty()
        ) {

            throw new IllegalArgumentException(
                    "Void reason is required."
            );
        }

        BarBill bill =
                barBillRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Bar bill not found: "
                                                + id
                                )
                        );

        // ---------------------------------------------
        // PAID BILL CANNOT BE VOIDED
        // ---------------------------------------------

        if (
                bill.getPaymentStatus()
                        == BarBillStatus.PAID
        ) {

            throw new IllegalStateException(
                    "A paid bill cannot be voided directly."
            );
        }

        bill.setPaymentStatus(
                BarBillStatus.VOID
        );

        bill.setVoidReason(
                reason.trim()
        );

        BarBill updatedBill =
                barBillRepository.save(bill);

        BarOrder order =
                barOrderRepository.findById(
                        bill.getOrderId()
                ).orElse(null);

        return mapToResponse(
                updatedBill,
                order
        );
    }

    // =====================================================
    // ENTITY -> RESPONSE
    // =====================================================

    private BarBillResponse mapToResponse(
            BarBill bill,
            BarOrder order
    ) {

        BarBillResponse response =
                new BarBillResponse();

        response.setId(
                bill.getId()
        );

        response.setBillNumber(
                bill.getBillNumber()
        );

        response.setOrderId(
                bill.getOrderId()
        );

        if (order != null) {

            response.setOrderNumber(
                    order.getOrderNumber()
            );
        }

        response.setSubtotal(
                bill.getSubtotal()
        );

        response.setDiscountAmount(
                bill.getDiscountAmount()
        );

        response.setTaxableAmount(
                bill.getTaxableAmount()
        );

        response.setTaxPercent(
                bill.getTaxPercent()
        );

        response.setTaxAmount(
                bill.getTaxAmount()
        );

        response.setGrandTotal(
                bill.getGrandTotal()
        );

        response.setPaymentStatus(
                bill.getPaymentStatus()
        );

        response.setPaymentMethod(
                bill.getPaymentMethod()
        );

        response.setPaidAt(
                bill.getPaidAt()
        );

        response.setRemarks(
                bill.getRemarks()
        );

        response.setVoidReason(
                bill.getVoidReason()
        );

        response.setCreatedAt(
                bill.getCreatedAt()
        );

        response.setUpdatedAt(
                bill.getUpdatedAt()
        );

        return response;
    }
}