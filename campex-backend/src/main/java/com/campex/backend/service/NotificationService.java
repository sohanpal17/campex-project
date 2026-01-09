package com.campex.backend.service;

import com.campex.backend.model.Notification;
import com.campex.backend.model.User;
import com.campex.backend.repository.NotificationRepository;
import com.campex.backend.repository.UserRepository;
import com.campex.backend.security.SecurityUtils;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Async
    public void sendNotification(User user, String title, String body, String type) {
        // Save to database
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .body(body)
                .type(type)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        
        notificationRepository.save(notification);

        // Send Push Notification via Firebase
        if (user.getFcmToken() != null && !user.getFcmToken().isEmpty()) {
            try {
                Message message = Message.builder()
                        .setToken(user.getFcmToken())
                        .putData("title", title)
                        .putData("body", body)
                        .putData("type", type)
                        .build();

                FirebaseMessaging.getInstance().send(message);
            } catch (Exception e) {
                System.err.println("Failed to send FCM notification: " + e.getMessage());
            }
        }
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        String uid = SecurityUtils.getCurrentFirebaseUid();
        if (uid == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        
        User user = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User profile not created"));

        // Verify notification exists and belongs to user
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized to mark this notification as read");
        }

        // Use direct update query for immediate database persistence
        notificationRepository.markAsReadById(notificationId);
    }

    @Transactional
    public void markAllAsRead() {
        String uid = SecurityUtils.getCurrentFirebaseUid();
        if (uid == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        
        User user = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User profile not created"));

        // Use direct update query for immediate database persistence
        notificationRepository.markAllAsReadByUserId(user.getId());
    }

    @Transactional
    public void deleteAllNotifications() {
        String uid = SecurityUtils.getCurrentFirebaseUid();
        if (uid == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        
        User user = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User profile not created"));

        notificationRepository.deleteByUserId(user.getId());
    }
}