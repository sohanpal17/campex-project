package com.campex.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class NotificationResponse {
    private Long id;
    private String type;
    private String title;
    private String body;
    private Map<String, Object> data;
    private boolean isRead;
    private LocalDateTime createdAt;
}