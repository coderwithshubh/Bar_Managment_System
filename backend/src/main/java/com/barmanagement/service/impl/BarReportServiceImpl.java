package com.barmanagement.service.impl;

import com.barmanagement.enums.BarBillStatus;
import com.barmanagement.enums.BarOrderStatus;
import com.barmanagement.model.BarBill;
import com.barmanagement.model.BarOrder;
import com.barmanagement.payload.response.BarReportSummaryResponse;
import com.barmanagement.repository.BarBillRepository;
import com.barmanagement.repository.BarOrderRepository;
import com.barmanagement.service.BarReportService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class BarReportServiceImpl implements BarReportService {

    private final BarOrderRepository barOrderRepository;
    private final BarBillRepository barBillRepository;

    public BarReportServiceImpl(
            BarOrderRepository barOrderRepository,
            BarBillRepository barBillRepository
    ) {
        this.barOrderRepository = barOrderRepository;
        this.barBillRepository = barBillRepository;
    }

    @Override
    public BarReportSummaryResponse getSummary(
            LocalDate fromDate,
            LocalDate toDate
    ) {

        LocalDate resolvedFrom =
                fromDate != null
                        ? fromDate
                        : LocalDate.now();

        LocalDate resolvedTo =
                toDate != null
                        ? toDate
                        : resolvedFrom;

        if (resolvedFrom.isAfter(resolvedTo)) {
            throw new IllegalArgumentException(
                    "From date cannot be after to date."
            );
        }

        LocalDateTime fromDateTime =
                resolvedFrom.atStartOfDay();

        LocalDateTime toDateTime =
                LocalDateTime.of(
                        resolvedTo,
                        LocalTime.MAX
                );

        List<BarOrder> orders =
                barOrderRepository.findAll()
                        .stream()
                        .filter(order ->
                                isBetween(
                                        order.getCreatedAt(),
                                        fromDateTime,
                                        toDateTime
                                )
                        )
                        .toList();

        List<BarBill> bills =
                barBillRepository.findAll()
                        .stream()
                        .filter(bill ->
                                isBetween(
                                        bill.getCreatedAt(),
                                        fromDateTime,
                                        toDateTime
                                )
                        )
                        .toList();

        long totalOrders =
                orders.size();

        long completedOrders =
                orders.stream()
                        .filter(order ->
                                order.getStatus()
                                        == BarOrderStatus.COMPLETED
                        )
                        .count();

        long cancelledOrders =
                orders.stream()
                        .filter(order ->
                                order.getStatus()
                                        == BarOrderStatus.CANCELLED
                        )
                        .count();

        long totalBills =
                bills.size();

        long paidBills =
                bills.stream()
                        .filter(bill ->
                                bill.getPaymentStatus()
                                        == BarBillStatus.PAID
                        )
                        .count();

        long unpaidBills =
                bills.stream()
                        .filter(bill ->
                                bill.getPaymentStatus()
                                        == BarBillStatus.UNPAID
                        )
                        .count();

        long voidBills =
                bills.stream()
                        .filter(bill ->
                                bill.getPaymentStatus()
                                        == BarBillStatus.VOID
                        )
                        .count();

        BigDecimal subtotal =
                sum(
                        bills,
                        BarBill::getSubtotal
                );

        BigDecimal discountAmount =
                sum(
                        bills,
                        BarBill::getDiscountAmount
                );

        BigDecimal taxAmount =
                sum(
                        bills,
                        BarBill::getTaxAmount
                );

        BigDecimal grandTotal =
                sum(
                        bills.stream()
                                .filter(bill ->
                                        bill.getPaymentStatus()
                                                != BarBillStatus.VOID
                                )
                                .toList(),
                        BarBill::getGrandTotal
                );

        BigDecimal paidAmount =
                sum(
                        bills.stream()
                                .filter(bill ->
                                        bill.getPaymentStatus()
                                                == BarBillStatus.PAID
                                )
                                .toList(),
                        BarBill::getGrandTotal
                );

        BigDecimal unpaidAmount =
                sum(
                        bills.stream()
                                .filter(bill ->
                                        bill.getPaymentStatus()
                                                == BarBillStatus.UNPAID
                                )
                                .toList(),
                        BarBill::getGrandTotal
                );

        BarReportSummaryResponse response =
                new BarReportSummaryResponse();

        response.setFromDate(resolvedFrom);
        response.setToDate(resolvedTo);

        response.setTotalOrders(totalOrders);
        response.setCompletedOrders(completedOrders);
        response.setCancelledOrders(cancelledOrders);

        response.setTotalBills(totalBills);
        response.setPaidBills(paidBills);
        response.setUnpaidBills(unpaidBills);
        response.setVoidBills(voidBills);

        response.setSubtotal(subtotal);
        response.setDiscountAmount(discountAmount);
        response.setTaxAmount(taxAmount);
        response.setGrandTotal(grandTotal);

        response.setPaidAmount(paidAmount);
        response.setUnpaidAmount(unpaidAmount);

        return response;
    }

    private boolean isBetween(
            LocalDateTime value,
            LocalDateTime from,
            LocalDateTime to
    ) {
        return value != null
                && !value.isBefore(from)
                && !value.isAfter(to);
    }

    private BigDecimal sum(
            List<BarBill> bills,
            java.util.function.Function<BarBill, BigDecimal> extractor
    ) {

        return bills.stream()
                .map(extractor)
                .map(this::money)
                .reduce(
                        BigDecimal.ZERO.setScale(
                                2,
                                RoundingMode.HALF_UP
                        ),
                        BigDecimal::add
                )
                .setScale(
                        2,
                        RoundingMode.HALF_UP
                );
    }

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
}
