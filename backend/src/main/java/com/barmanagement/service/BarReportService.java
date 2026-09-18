package com.barmanagement.service;

import com.barmanagement.payload.response.BarReportSummaryResponse;

import java.time.LocalDate;

public interface BarReportService {

    BarReportSummaryResponse getSummary(
            LocalDate fromDate,
            LocalDate toDate
    );
}
