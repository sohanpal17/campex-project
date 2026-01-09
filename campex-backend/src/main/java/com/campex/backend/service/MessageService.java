package com.campex.backend.service;

import com.campex.backend.dto.request.SendMessageRequest;
import com.campex.backend.dto.response.ConversationResponse;
import com.campex.backend.dto.response.MessageResponse;
import com.campex.backend.dto.response.ProductResponse;
import com.campex.backend.dto.response.UserResponse;
import com.campex.backend.model.Conversation;
import com.campex.backend.model.Message;
import com.campex.backend.model.Product;
import com.campex.backend.model.User;
import com.campex.backend.repository.BlockedUserRepository;
import com.campex.backend.repository.ConversationRepository;
import com.campex.backend.repository.MessageRepository;
import com.campex.backend.repository.ProductRepository;
import com.campex.backend.repository.UserRepository;
import com.campex.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final NotificationService notificationService;
    private final BlockedUserRepository blockedUserRepository;

    @Transactional
    public MessageResponse sendMessage(SendMessageRequest request) {
        String uid = SecurityUtils.getCurrentFirebaseUid();
        if (uid == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        User sender = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User profile not created. Please create your profile first."));

        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        // Check if either user blocked the other
        boolean isSenderBlocked = blockedUserRepository.existsByBlockerIdAndBlockedId(
            sender.getId(), receiver.getId());
        boolean isReceiverBlocked = blockedUserRepository.existsByBlockerIdAndBlockedId(
            receiver.getId(), sender.getId());
        
        if (isSenderBlocked || isReceiverBlocked) {
            throw new IllegalArgumentException("Cannot send message to blocked user");
        }

        final Product product = request.getProductId() != null 
            ? productRepository.findById(request.getProductId()).orElse(null)
            : null;

        // Find or create conversation
        List<Conversation> conversations = conversationRepository
                .findExistingConversations(sender.getId(), receiver.getId(), request.getProductId());
        
        Conversation conversation;
        if (!conversations.isEmpty()) {
            conversation = conversations.get(0); // Get the best match (ordered by CASE)
        } else {
            Conversation newConv = Conversation.builder()
                    .user1(sender)
                    .user2(receiver)
                    .product(product)
                    .lastMessageAt(LocalDateTime.now())
                    .build();
            conversation = conversationRepository.save(newConv);
        }

        // Create message
        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .isRead(false)
                .build();

        message = messageRepository.save(message);

        // Update last message timestamp
        conversation.setLastMessageAt(message.getCreatedAt());
        conversationRepository.save(conversation);

        // Send notification
        notificationService.sendNotification(
                receiver, 
                "New Message", 
                sender.getFullName() + ": " + request.getContent(),
                "MESSAGE"
        );

        return mapToMessageResponse(message);
    }

    public List<ConversationResponse> getConversations() {
        String uid = SecurityUtils.getCurrentFirebaseUid();
        if (uid == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        User currentUser = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User profile not created"));

        List<Conversation> conversations = conversationRepository.findByUser(currentUser.getId());
        
        // Filter out conversations with blocked users
        return conversations.stream()
                .filter(c -> {
                    User otherUser = c.getUser1().getId().equals(currentUser.getId()) 
                        ? c.getUser2() 
                        : c.getUser1();
                    
                    // Check if either user blocked the other
                    boolean isBlocked = blockedUserRepository.existsByBlockerIdAndBlockedId(
                        currentUser.getId(), otherUser.getId());
                    boolean isBlockedBy = blockedUserRepository.existsByBlockerIdAndBlockedId(
                        otherUser.getId(), currentUser.getId());
                    
                    return !isBlocked && !isBlockedBy;
                })
                .map(c -> mapToConversationResponse(c, currentUser.getId()))
                .collect(Collectors.toList());
    }

    public Page<MessageResponse> getMessages(Long conversationId, Pageable pageable) {
        return messageRepository.findByConversationIdOrderByCreatedAtDesc(conversationId, pageable)
                .map(this::mapToMessageResponse);
    }

    @Transactional
    public ConversationResponse getOrCreateConversation(Long sellerId, Long productId) {
        String uid = SecurityUtils.getCurrentFirebaseUid();
        if (uid == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        User currentUser = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User profile not created"));

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));

        // Find or create conversation
        List<Conversation> conversations = conversationRepository
                .findExistingConversations(currentUser.getId(), seller.getId(), productId);
        
        Conversation conversation;
        if (!conversations.isEmpty()) {
            conversation = conversations.get(0); // Get the best match (ordered by CASE)
        } else {
            Conversation newConv = Conversation.builder()
                    .user1(currentUser)
                    .user2(seller)
                    .product(productId != null ? 
                            productRepository.findById(productId).orElse(null) : null)
                    .lastMessageAt(LocalDateTime.now())
                    .build();
            conversation = conversationRepository.save(newConv);
        }

        return mapToConversationResponse(conversation, currentUser.getId());
    }

    private MessageResponse mapToMessageResponse(Message msg) {
        return MessageResponse.builder()
                .id(msg.getId())
                .senderId(msg.getSender().getId())
                .receiverId(msg.getReceiver().getId())
                .content(msg.getContent())
                .isRead(msg.isRead())
                .createdAt(msg.getCreatedAt())
                .build();
    }

    private ConversationResponse mapToConversationResponse(Conversation c, Long currentUserId) {
        // Determine the other user (not current user)
        User otherUser = c.getUser1().getId().equals(currentUserId) ? c.getUser2() : c.getUser1();
        
        // Map other user to UserResponse
        UserResponse otherUserResponse = UserResponse.builder()
                .id(otherUser.getId())
                .email(otherUser.getEmail())
                .fullName(otherUser.getFullName())
                .profilePhotoUrl(otherUser.getProfilePhotoUrl())
                .academicYear(otherUser.getAcademicYear())
                .phoneNumber(otherUser.getPhoneNumber())
                .isVerified(otherUser.isVerified())
                .createdAt(otherUser.getCreatedAt())
                .build();
        
        // Map product if exists (minimal info for conversation list)
        ProductResponse productResponse = null;
        if (c.getProduct() != null) {
            Product p = c.getProduct();
            productResponse = ProductResponse.builder()
                    .id(p.getId())
                    .seller(null) // Not needed for conversation list
                    .title(p.getTitle())
                    .description(null) // Not needed
                    .category(p.getCategory())
                    .price(p.getPrice())
                    .isFree(p.isFree())
                    .isNegotiable(p.isNegotiable())
                    .status(p.getStatus())
                    .images(p.getImages())
                    .isSaved(false) // Not relevant in conversation context
                    .createdAt(p.getCreatedAt())
                    .build();
        }
        
        // Get the latest message
        Message lastMessage = messageRepository
                .findFirstByConversationIdOrderByCreatedAtDesc(c.getId())
                .orElse(null);

        return ConversationResponse.builder()
                .id(c.getId())
                .otherUser(otherUserResponse)
                .product(productResponse)
                .lastMessage(lastMessage != null ? lastMessage.getContent() : null)
                .isLastMessageRead(lastMessage != null && lastMessage.isRead())
                .lastMessageSenderId(lastMessage != null && lastMessage.getSender() != null 
                        ? lastMessage.getSender().getId() : null)
                .lastMessageAt(c.getLastMessageAt())
                .build();
    }

    @Transactional
    public void deleteConversation(Long conversationId) {
        String uid = SecurityUtils.getCurrentFirebaseUid();
        if (uid == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        User currentUser = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User profile not created"));

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new IllegalArgumentException("Conversation not found"));

        // Check if user is part of this conversation
        if (!conversation.getUser1().getId().equals(currentUser.getId()) &&
            !conversation.getUser2().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You don't have permission to delete this conversation");
        }

        // Delete all messages in the conversation first
        messageRepository.deleteByConversationId(conversationId);
        
        // Delete the conversation
        conversationRepository.delete(conversation);
    }
}