package com.campex.backend.repository;

import com.campex.backend.model.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByConversationIdOrderByCreatedAtDesc(Long conversationId, Pageable pageable);
    
    // Get messages by sender/receiver for deletion
    List<Message> findBySenderId(Long senderId);
    List<Message> findByReceiverId(Long receiverId);
    
    // Get latest message for a conversation
    Optional<Message> findFirstByConversationIdOrderByCreatedAtDesc(Long conversationId);
    
    // Count unread messages for a user in a specific conversation
    @Query("SELECT COUNT(m) FROM Message m WHERE m.conversation.id = :conversationId AND m.receiver.id = :userId AND m.isRead = false")
    long countUnreadMessages(@Param("conversationId") Long conversationId, @Param("userId") Long userId);
    
    // Count unread messages for a user
    long countByReceiverIdAndIsReadFalse(Long receiverId);
    
    // Delete all messages in a conversation
    void deleteByConversationId(Long conversationId);
}