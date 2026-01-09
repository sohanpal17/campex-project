package com.campex.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ConversationResponse {
    private Long id;
    private UserResponse otherUser;
    private ProductResponse product;
    private String lastMessage;
    private boolean isLastMessageRead;
    private Long lastMessageSenderId;
    private LocalDateTime lastMessageAt;
}