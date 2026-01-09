package com.campex.backend.service;

import com.campex.backend.dto.request.CreateItemRequestRequest;
import com.campex.backend.dto.response.ItemRequestResponse;
import com.campex.backend.dto.response.UserResponse;
import com.campex.backend.model.ItemRequest;
import com.campex.backend.model.User;
import com.campex.backend.repository.ItemRequestRepository;
import com.campex.backend.repository.UserRepository;
import com.campex.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ItemRequestService {

    private final ItemRequestRepository itemRequestRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public ItemRequestResponse createRequest(CreateItemRequestRequest request) {
        String uid = SecurityUtils.getCurrentFirebaseUid();
        if (uid == null) {
            throw new IllegalArgumentException("User not authenticated");
        }

        User requester = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User profile not created"));

        ItemRequest itemRequest = ItemRequest.builder()
                .requester(requester)
                .title(request.getTitle())
                .description(request.getDescription())
                .status("OPEN")
                .build();

        ItemRequest saved = itemRequestRepository.save(itemRequest);

        // Broadcast notification to all other users
        userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(requester.getId()))
                .forEach(user -> {
                    notificationService.sendNotification(
                            user,
                            "New Item Request",
                            requester.getFullName() + " is looking for: " + request.getTitle(),
                            "ITEM_REQUEST"
                    );
                });

        return mapToResponse(saved, requester.getId());
    }

    public Page<ItemRequestResponse> getAllRequests(Pageable pageable) {
        String uid = SecurityUtils.getCurrentFirebaseUid();
        Long currentUserId = null;
        
        if (uid != null) {
            currentUserId = userRepository.findByFirebaseUid(uid)
                    .map(User::getId)
                    .orElse(null);
        }

        Long finalCurrentUserId = currentUserId;
        
        // Exclude current user's requests from "all" requests
        if (currentUserId != null) {
            return itemRequestRepository
                    .findByStatusAndRequesterIdNotOrderByCreatedAtDesc("OPEN", currentUserId, pageable)
                    .map(request -> mapToResponse(request, finalCurrentUserId));
        } else {
            return itemRequestRepository
                    .findByStatusOrderByCreatedAtDesc("OPEN", pageable)
                    .map(request -> mapToResponse(request, finalCurrentUserId));
        }
    }

    public Page<ItemRequestResponse> getMyRequests(Pageable pageable) {
        String uid = SecurityUtils.getCurrentFirebaseUid();
        if (uid == null) {
            throw new IllegalArgumentException("User not authenticated");
        }

        User user = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User profile not created"));

        return itemRequestRepository.findByRequesterIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(request -> mapToResponse(request, user.getId()));
    }

    @Transactional
    public void deleteRequest(Long requestId) {
        String uid = SecurityUtils.getCurrentFirebaseUid();
        if (uid == null) {
            throw new IllegalArgumentException("User not authenticated");
        }

        User user = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User profile not created"));

        ItemRequest request = itemRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (!request.getRequester().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized to delete this request");
        }

        itemRequestRepository.delete(request);
    }

    @Transactional
    public ItemRequestResponse updateStatus(Long requestId, String status) {
        String uid = SecurityUtils.getCurrentFirebaseUid();
        if (uid == null) {
            throw new IllegalArgumentException("User not authenticated");
        }

        User user = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User profile not created"));

        ItemRequest request = itemRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (!request.getRequester().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Unauthorized to update this request");
        }

        request.setStatus(status);
        ItemRequest updated = itemRequestRepository.save(request);
        return mapToResponse(updated, user.getId());
    }

    private ItemRequestResponse mapToResponse(ItemRequest request, Long currentUserId) {
        User requester = request.getRequester();
        UserResponse requesterResponse = UserResponse.builder()
                .id(requester.getId())
                .fullName(requester.getFullName())
                .profilePhotoUrl(requester.getProfilePhotoUrl())
                .academicYear(requester.getAcademicYear())
                .build();

        return ItemRequestResponse.builder()
                .id(request.getId())
                .requester(requesterResponse)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .canChat(currentUserId != null && !requester.getId().equals(currentUserId))
                .build();
    }
}
