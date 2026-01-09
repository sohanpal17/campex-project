package com.campex.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateReportRequest {
    private Long reportedUserId;
    private Long reportedProductId;

    @NotBlank
    private String reportType;

    private String description;
}