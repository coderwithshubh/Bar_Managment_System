package com.barmanagement.payload.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class BarSalesReportResponse {

    private LocalDate fromDate;
    private LocalDate toDate;

    private long totalOrders;
    private long completedOrders;
    private long cancelledOrders;
    private long dineInOrders;
    private long takeawayOrders;

    private long totalBills;
    private long paidBills;
    private long unpaidBills;
    private long voidBills;

    private BigDecimal grossSales = BigDecimal.ZERO;
    private BigDecimal discountAmount = BigDecimal.ZERO;
    private BigDecimal taxAmount = BigDecimal.ZERO;
    private BigDecimal netSales = BigDecimal.ZERO;

    private BigDecimal collectedAmount = BigDecimal.ZERO;
    private BigDecimal outstandingAmount = BigDecimal.ZERO;

    private List<BarSalesDailyResponse> dailySales = new ArrayList<>();

    public LocalDate getFromDate() { return fromDate; }
    public void setFromDate(LocalDate fromDate) { this.fromDate = fromDate; }

    public LocalDate getToDate() { return toDate; }
    public void setToDate(LocalDate toDate) { this.toDate = toDate; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public long getCompletedOrders() { return completedOrders; }
    public void setCompletedOrders(long completedOrders) { this.completedOrders = completedOrders; }

    public long getCancelledOrders() { return cancelledOrders; }
    public void setCancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; }

    public long getDineInOrders() { return dineInOrders; }
    public void setDineInOrders(long dineInOrders) { this.dineInOrders = dineInOrders; }

    public long getTakeawayOrders() { return takeawayOrders; }
    public void setTakeawayOrders(long takeawayOrders) { this.takeawayOrders = takeawayOrders; }

    public long getTotalBills() { return totalBills; }
    public void setTotalBills(long totalBills) { this.totalBills = totalBills; }

    public long getPaidBills() { return paidBills; }
    public void setPaidBills(long paidBills) { this.paidBills = paidBills; }

    public long getUnpaidBills() { return unpaidBills; }
    public void setUnpaidBills(long unpaidBills) { this.unpaidBills = unpaidBills; }

    public long getVoidBills() { return voidBills; }
    public void setVoidBills(long voidBills) { this.voidBills = voidBills; }

    public BigDecimal getGrossSales() { return grossSales; }
    public void setGrossSales(BigDecimal grossSales) { this.grossSales = grossSales; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }

    public BigDecimal getNetSales() { return netSales; }
    public void setNetSales(BigDecimal netSales) { this.netSales = netSales; }

    public BigDecimal getCollectedAmount() { return collectedAmount; }
    public void setCollectedAmount(BigDecimal collectedAmount) { this.collectedAmount = collectedAmount; }

    public BigDecimal getOutstandingAmount() { return outstandingAmount; }
    public void setOutstandingAmount(BigDecimal outstandingAmount) { this.outstandingAmount = outstandingAmount; }

    public List<BarSalesDailyResponse> getDailySales() { return dailySales; }
    public void setDailySales(List<BarSalesDailyResponse> dailySales) { this.dailySales = dailySales; }
}
