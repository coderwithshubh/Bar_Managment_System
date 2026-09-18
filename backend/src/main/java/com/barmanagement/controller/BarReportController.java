package com.barmanagement.controller;

import com.barmanagement.payload.response.BarReportSummaryResponse;
import com.barmanagement.service.BarReportService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/bar/reports")
public class BarReportController {

    private final BarReportService barReportService;

    public BarReportController(
            BarReportService barReportService
    ) {
        this.barReportService = barReportService;
    }

    @GetMapping("/summary")
    public ResponseEntity<BarReportSummaryResponse> getSummary(

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fromDate,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate toDate
    ) {

        return ResponseEntity.ok(
                barReportService.getSummary(
                        fromDate,
                        toDate
                )
        );
    }
}
