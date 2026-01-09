package com.campex.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfileSetupRequest {
    @NotBlank
    private String fullName;

    @NotBlank
    private String academicYear; // FE, SE, TE, BE

    private String phoneNumber;
}