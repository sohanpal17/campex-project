package com.campex.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String profilePhotoUrl;
    private String academicYear;
    private String phoneNumber;
    private boolean isVerified;
    private LocalDateTime createdAt;
}