package com.barmanagement.service;

import com.barmanagement.payload.response.BarSalesReportResponse;

import java.time.LocalDate;

public interface BarSalesReportService {

    BarSalesReportResponse getSalesReport(
            LocalDate fromDate,
            LocalDate toDate
    );
}
