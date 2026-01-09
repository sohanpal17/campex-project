package com.campex.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SendMessageRequest {
    @NotNull
    private Long receiverId;

    private Long productId; // Optional, for first message

    @NotBlank
    private String content;
}