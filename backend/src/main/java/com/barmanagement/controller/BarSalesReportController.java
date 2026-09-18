package com.barmanagement.controller;

import com.barmanagement.payload.response.BarSalesReportResponse;
import com.barmanagement.service.BarSalesReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/bar/reports")
public class BarSalesReportController {

    private final BarSalesReportService barSalesReportService;

    public BarSalesReportController(
            BarSalesReportService barSalesReportService
    ) {
        this.barSalesReportService = barSalesReportService;
    }

    @GetMapping("/sales")
    public ResponseEntity<BarSalesReportResponse> getSalesReport(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate
    ) {
        return ResponseEntity.ok(
                barSalesReportService.getSalesReport(
                        fromDate,
                        toDate
                )
        );
    }
}
