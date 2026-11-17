package com.dineflow.controller;

import com.dineflow.dto.ApiResponse;
import com.dineflow.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse> getSummary() {
        return ResponseEntity.ok(ApiResponse.success("Report generated", reportService.getSummaryReport()));
    }
}

