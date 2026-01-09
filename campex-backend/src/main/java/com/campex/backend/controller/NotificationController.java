package com.campex.backend.controller;

import com.campex.backend.dto.response.ApiResponse;
import com.campex.backend.model.Notification;
import com.campex.backend.repository.NotificationRepository;
import com.campex.backend.repository.UserRepository;
import com.campex.backend.security.SecurityUtils;
import com.campex.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Pageable pageable) {
        String uid = SecurityUtils.getCurrentFirebaseUid();
        if (uid == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        Long userId = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User profile not created. Please create your profile first."))
                .getId();
        Page<Notification> page = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return ResponseEntity.ok(page.getContent());
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Marked as read"));
    }

    @PostMapping("/mark-all-read")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok(ApiResponse.success(null, "All marked as read"));
    }

    @DeleteMapping("/all")
    public ResponseEntity<ApiResponse<Void>> deleteAllNotifications() {
        notificationService.deleteAllNotifications();
        return ResponseEntity.ok(ApiResponse.success(null, "All notifications deleted"));
    }
}