package com.campex.backend.controller;

import com.campex.backend.dto.request.CreateReportRequest;
import com.campex.backend.dto.response.ApiResponse;
import com.campex.backend.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createReport(@Valid @RequestBody CreateReportRequest request) {
        reportService.createReport(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Report submitted"));
    }
}