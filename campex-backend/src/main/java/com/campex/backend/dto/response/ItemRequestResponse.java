package com.campex.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ItemRequestResponse {
    private Long id;
    private UserResponse requester;
    private String title;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private boolean canChat; // true if not the requester
}
