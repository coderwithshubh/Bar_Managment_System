package com.barmanagement.service.impl;

import com.barmanagement.enums.BarBillStatus;
import com.barmanagement.enums.BarOrderStatus;
import com.barmanagement.enums.BarOrderType;
import com.barmanagement.model.BarBill;
import com.barmanagement.model.BarOrder;
import com.barmanagement.payload.response.BarSalesDailyResponse;
import com.barmanagement.payload.response.BarSalesReportResponse;
import com.barmanagement.repository.BarBillRepository;
import com.barmanagement.repository.BarOrderRepository;
import com.barmanagement.service.BarSalesReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Service
@Transactional(readOnly = true)
public class BarSalesReportServiceImpl implements BarSalesReportService {

    private final BarOrderRepository barOrderRepository;
    private final BarBillRepository barBillRepository;

    public BarSalesReportServiceImpl(
            BarOrderRepository barOrderRepository,
            BarBillRepository barBillRepository
    ) {
        this.barOrderRepository = barOrderRepository;
        this.barBillRepository = barBillRepository;
    }

    @Override
    public BarSalesReportResponse getSalesReport(
            LocalDate fromDate,
            LocalDate toDate
    ) {
        LocalDate resolvedFrom =
                fromDate != null ? fromDate : LocalDate.now();

        LocalDate resolvedTo =
                toDate != null ? toDate : resolvedFrom;

        if (resolvedFrom.isAfter(resolvedTo)) {
            throw new IllegalArgumentException(
                    "From date cannot be after to date."
            );
        }

        LocalDateTime fromDateTime = resolvedFrom.atStartOfDay();
        LocalDateTime toDateTime =
                LocalDateTime.of(resolvedTo, LocalTime.MAX);

        List<BarOrder> orders =
                barOrderRepository.findAll()
                        .stream()
                        .filter(order -> isBetween(
                                order.getCreatedAt(),
                                fromDateTime,
                                toDateTime
                        ))
                        .toList();

        List<BarBill> bills =
                barBillRepository.findAll()
                        .stream()
                        .filter(bill -> isBetween(
                                bill.getCreatedAt(),
                                fromDateTime,
                                toDateTime
                        ))
                        .toList();

        List<BarBill> activeBills =
                bills.stream()
                        .filter(bill ->
                                bill.getPaymentStatus()
                                        != BarBillStatus.VOID)
                        .toList();

        BarSalesReportResponse response =
                new BarSalesReportResponse();

        response.setFromDate(resolvedFrom);
        response.setToDate(resolvedTo);

        response.setTotalOrders(orders.size());

        response.setCompletedOrders(
                orders.stream()
                        .filter(order ->
                                order.getStatus()
                                        == BarOrderStatus.COMPLETED)
                        .count()
        );

        response.setCancelledOrders(
                orders.stream()
                        .filter(order ->
                                order.getStatus()
                                        == BarOrderStatus.CANCELLED)
                        .count()
        );

        response.setDineInOrders(
                orders.stream()
                        .filter(order ->
                                order.getOrderType()
                                        == BarOrderType.DINE_IN)
                        .count()
        );

        response.setTakeawayOrders(
                orders.stream()
                        .filter(order ->
                                order.getOrderType()
                                        == BarOrderType.TAKEAWAY)
                        .count()
        );

        response.setTotalBills(bills.size());

        response.setPaidBills(
                bills.stream()
                        .filter(bill ->
                                bill.getPaymentStatus()
                                        == BarBillStatus.PAID)
                        .count()
        );

        response.setUnpaidBills(
                bills.stream()
                        .filter(bill ->
                                bill.getPaymentStatus()
                                        == BarBillStatus.UNPAID)
                        .count()
        );

        response.setVoidBills(
                bills.stream()
                        .filter(bill ->
                                bill.getPaymentStatus()
                                        == BarBillStatus.VOID)
                        .count()
        );

        response.setGrossSales(
                sum(activeBills, BarBill::getSubtotal)
        );

        response.setDiscountAmount(
                sum(activeBills, BarBill::getDiscountAmount)
        );

        response.setTaxAmount(
                sum(activeBills, BarBill::getTaxAmount)
        );

        response.setNetSales(
                sum(activeBills, BarBill::getGrandTotal)
        );

        response.setCollectedAmount(
                sum(
                        activeBills.stream()
                                .filter(bill ->
                                        bill.getPaymentStatus()
                                                == BarBillStatus.PAID)
                                .toList(),
                        BarBill::getGrandTotal
                )
        );

        response.setOutstandingAmount(
                sum(
                        activeBills.stream()
                                .filter(bill ->
                                        bill.getPaymentStatus()
                                                == BarBillStatus.UNPAID)
                                .toList(),
                        BarBill::getGrandTotal
                )
        );

        response.setDailySales(
                buildDailySales(
                        activeBills,
                        resolvedFrom,
                        resolvedTo
                )
        );

        return response;
    }

    private List<BarSalesDailyResponse> buildDailySales(
            List<BarBill> bills,
            LocalDate fromDate,
            LocalDate toDate
    ) {
        Map<LocalDate, List<BarBill>> groupedBills =
                new HashMap<>();

        for (BarBill bill : bills) {
            if (bill.getCreatedAt() == null) {
                continue;
            }

            LocalDate date =
                    bill.getCreatedAt().toLocalDate();

            groupedBills
                    .computeIfAbsent(
                            date,
                            ignored -> new ArrayList<>()
                    )
                    .add(bill);
        }

        List<BarSalesDailyResponse> dailySales =
                new ArrayList<>();

        LocalDate currentDate = fromDate;

        while (!currentDate.isAfter(toDate)) {
            List<BarBill> dayBills =
                    groupedBills.getOrDefault(
                            currentDate,
                            List.of()
                    );

            BarSalesDailyResponse daily =
                    new BarSalesDailyResponse();

            daily.setDate(currentDate);
            daily.setBillCount(dayBills.size());

            daily.setGrossSales(
                    sum(dayBills, BarBill::getSubtotal)
            );

            daily.setDiscountAmount(
                    sum(dayBills, BarBill::getDiscountAmount)
            );

            daily.setTaxAmount(
                    sum(dayBills, BarBill::getTaxAmount)
            );

            daily.setNetSales(
                    sum(dayBills, BarBill::getGrandTotal)
            );

            daily.setCollectedAmount(
                    sum(
                            dayBills.stream()
                                    .filter(bill ->
                                            bill.getPaymentStatus()
                                                    == BarBillStatus.PAID)
                                    .toList(),
                            BarBill::getGrandTotal
                    )
            );

            daily.setOutstandingAmount(
                    sum(
                            dayBills.stream()
                                    .filter(bill ->
                                            bill.getPaymentStatus()
                                                    == BarBillStatus.UNPAID)
                                    .toList(),
                            BarBill::getGrandTotal
                    )
            );

            dailySales.add(daily);
            currentDate = currentDate.plusDays(1);
        }

        dailySales.sort(
                Comparator.comparing(
                        BarSalesDailyResponse::getDate
                )
        );

        return dailySales;
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
            Function<BarBill, BigDecimal> getter
    ) {
        return bills.stream()
                .map(getter)
                .filter(value -> value != null)
                .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                )
                .setScale(2, RoundingMode.HALF_UP);
    }
}
