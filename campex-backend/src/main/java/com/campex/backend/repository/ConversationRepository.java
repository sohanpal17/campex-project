package com.campex.backend.repository;

import com.campex.backend.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    
    @Query("SELECT c FROM Conversation c WHERE c.user1.id = :userId OR c.user2.id = :userId ORDER BY c.lastMessageAt DESC")
    List<Conversation> findByUser(@Param("userId") Long userId);

    @Query("SELECT c FROM Conversation c " +
           "LEFT JOIN FETCH c.user1 " +
           "LEFT JOIN FETCH c.user2 " +
           "LEFT JOIN FETCH c.product " +
           "WHERE ((c.user1.id = :user1Id AND c.user2.id = :user2Id) OR " +
           "(c.user1.id = :user2Id AND c.user2.id = :user1Id)) " +
           "ORDER BY " +
           "CASE WHEN :productId IS NOT NULL AND c.product.id = :productId THEN 0 " +
           "WHEN :productId IS NULL AND c.product IS NULL THEN 0 " +
           "ELSE 1 END, " +
           "c.lastMessageAt DESC")
    List<Conversation> findExistingConversations(
            @Param("user1Id") Long user1Id, 
            @Param("user2Id") Long user2Id,
            @Param("productId") Long productId);
}