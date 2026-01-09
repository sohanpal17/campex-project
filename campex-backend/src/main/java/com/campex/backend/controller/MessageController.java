package com.campex.backend.controller;

import com.campex.backend.dto.request.SendMessageRequest;
import com.campex.backend.dto.response.ApiResponse;
import com.campex.backend.dto.response.ConversationResponse;
import com.campex.backend.dto.response.MessageResponse;
import com.campex.backend.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        MessageResponse message = messageService.sendMessage(request);
        return ResponseEntity.ok(ApiResponse.success(message, "Message sent"));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> getConversations() {
        return ResponseEntity.ok(messageService.getConversations());
    }

    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<Page<MessageResponse>> getMessages(
            @PathVariable Long conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        return ResponseEntity.ok(messageService.getMessages(conversationId, PageRequest.of(page, size)));
    }

    @PostMapping("/conversations/get-or-create")
    public ResponseEntity<ApiResponse<ConversationResponse>> getOrCreateConversation(
            @RequestParam Long sellerId,
            @RequestParam(required = false) Long productId) {
        ConversationResponse conversation = messageService.getOrCreateConversation(sellerId, productId);
        return ResponseEntity.ok(ApiResponse.success(conversation, "Conversation ready"));
    }

    @DeleteMapping("/conversations/{conversationId}")
    public ResponseEntity<ApiResponse<Void>> deleteConversation(@PathVariable Long conversationId) {
        messageService.deleteConversation(conversationId);
        return ResponseEntity.ok(ApiResponse.success(null, "Conversation deleted"));
    }
}