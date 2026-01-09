package com.campex.backend.service;

import com.campex.backend.dto.request.ProfileSetupRequest;
import com.campex.backend.dto.request.UpdateProfileRequest;
import com.campex.backend.dto.response.ProductResponse;
import com.campex.backend.dto.response.UserResponse;
import com.campex.backend.model.BlockedUser;
import com.campex.backend.model.Product;
import com.campex.backend.model.SavedItem;
import com.campex.backend.model.User;
import com.campex.backend.repository.BlockedUserRepository;
import com.campex.backend.repository.ProductRepository;
import com.campex.backend.repository.SavedItemRepository;
import com.campex.backend.repository.UserRepository;
import com.campex.backend.repository.NotificationRepository;
import com.campex.backend.repository.MessageRepository;
import com.campex.backend.repository.ConversationRepository;
import com.campex.backend.repository.ItemRequestRepository;
import com.campex.backend.repository.CampaignInterestRepository;
import com.campex.backend.security.SecurityUtils;
import com.google.firebase.auth.FirebaseAuth;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final SavedItemRepository savedItemRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final NotificationRepository notificationRepository;
    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final ItemRequestRepository itemRequestRepository;
    private final CampaignInterestRepository campaignInterestRepository;

    public UserResponse getMyProfile() {
        User user = getCurrentUser();
        return mapToUserResponse(user);
    }

    public UserResponse createProfile(ProfileSetupRequest request) {
        String uid = SecurityUtils.getCurrentFirebaseUid();
        if (uid == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        
        // Get email from Firebase token (stored in request by FirebaseAuthFilter)
        String email = SecurityUtils.getCurrentUserEmail();
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email not found in authentication token");
        }
        
        // Check if user already exists - update instead of create
        User user = userRepository.findByFirebaseUid(uid).orElse(null);
        
        if (user != null) {
            // Update existing user profile
            user.setFullName(request.getFullName());
            user.setAcademicYear(request.getAcademicYear());
            user.setPhoneNumber(request.getPhoneNumber());
            // Don't update email or firebaseUid as they shouldn't change
        } else {
            // Create new user profile
            user = User.builder()
                    .firebaseUid(uid)
                    .fullName(request.getFullName())
                    .academicYear(request.getAcademicYear())
                    .phoneNumber(request.getPhoneNumber())
                    .email(email)
                    .isVerified(false)
                    .build();
        }

        return mapToUserResponse(userRepository.save(user));
    }

    public UserResponse updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();
        
        // Update fields if provided
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        
        if (request.getAcademicYear() != null && !request.getAcademicYear().isBlank()) {
            user.setAcademicYear(request.getAcademicYear());
        }
        
        
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        
        // Always update profile photo URL when present in request (allows null to remove photo)
        user.setProfilePhotoUrl(request.getProfilePhotoUrl());
        
        return mapToUserResponse(userRepository.save(user));
    }

    public List<ProductResponse> getMyListings(String status) {
        User user = getCurrentUser();
        String queryStatus = status != null ? status : "ACTIVE";
        
        return productRepository.findBySellerIdAndStatus(user.getId(), queryStatus, Pageable.unpaged())
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getSavedItems() {
        User user = getCurrentUser();
        return savedItemRepository.findByUserIdOrderBySavedAtDesc(user.getId(), Pageable.unpaged())
                .stream()
                .map(savedItem -> mapToProductResponse(savedItem.getProduct()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void saveItem(Long productId) {
        User user = getCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (savedItemRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            return; // Already saved
        }

        SavedItem savedItem = SavedItem.builder()
                .user(user)
                .product(product)
                .savedAt(LocalDateTime.now())
                .build();

        savedItemRepository.save(savedItem);
    }

    @Transactional
    public void unsaveItem(Long productId) {
        User user = getCurrentUser();
        savedItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .ifPresent(savedItemRepository::delete);
    }

    @Transactional
    public void blockUser(Long blockedId) {
        User blocker = getCurrentUser();
        User blocked = userRepository.findById(blockedId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (blockedUserRepository.existsByBlockerIdAndBlockedId(blocker.getId(), blocked.getId())) {
            return;
        }

        BlockedUser blockedUser = BlockedUser.builder()
                .blocker(blocker)
                .blocked(blocked)
                .build();

        blockedUserRepository.save(blockedUser);
    }

    @Transactional
    public void unblockUser(Long blockedId) {
        User blocker = getCurrentUser();
        blockedUserRepository.findByBlockerIdAndBlockedId(blocker.getId(), blockedId)
                .ifPresent(blockedUserRepository::delete);
    }

    public List<UserResponse> getBlockedUsers() {
        User blocker = getCurrentUser();
        return blockedUserRepository.findByBlockerId(blocker.getId()).stream()
                .map(blocked -> mapToUserResponse(blocked.getBlocked()))
                .toList();
    }

    public boolean isUserBlocked(Long userId) {
        User currentUser = getCurrentUser();
        return blockedUserRepository.existsByBlockerIdAndBlockedId(currentUser.getId(), userId);
    }

    @Transactional
    public void deleteAccount() {
        User user = getCurrentUser();
        Long userId = user.getId();
        String firebaseUid = user.getFirebaseUid();
        
        try {
            // Delete in correct order to avoid foreign key constraints
            
            // 1. Delete all messages involving this user (before conversations)
            messageRepository.deleteAll(messageRepository.findBySenderId(userId));
            messageRepository.deleteAll(messageRepository.findByReceiverId(userId));
            
            // 2. Delete all conversations involving this user
            conversationRepository.deleteAll(conversationRepository.findByUser(userId));
            
            // 3. Delete all notifications for this user
            notificationRepository.deleteAll(notificationRepository.findByUserId(userId));
            
            // 4. Delete all item requests by this user
            itemRequestRepository.deleteAll(itemRequestRepository.findByRequesterIdOrderByCreatedAtDesc(userId, Pageable.unpaged()));
            
            // 5. Delete all campaign interests
            campaignInterestRepository.deleteAll(campaignInterestRepository.findByUserId(userId));
            
            // 6. Delete all saved items
            savedItemRepository.deleteAll(savedItemRepository.findByUserIdOrderBySavedAtDesc(userId, Pageable.unpaged()));
            
            // 7. Delete all user's products
            productRepository.deleteAll(productRepository.findBySellerId(userId, Pageable.unpaged()));
            
            // 8. Delete all blocked user relationships (both as blocker and blocked)
            blockedUserRepository.deleteAll(blockedUserRepository.findByBlockerId(userId));
            blockedUserRepository.deleteAll(blockedUserRepository.findByBlockedId(userId));
            
            // 9. Delete the user from database
            userRepository.delete(user);
            
            // 10. Delete from Firebase Auth (last, don't fail if this errors)
            if (firebaseUid != null && !firebaseUid.isEmpty()) {
                try {
                    FirebaseAuth.getInstance().deleteUser(firebaseUid);
                } catch (Exception e) {
                    // Log but don't fail - user is already deleted from DB
                    System.err.println("Warning: Failed to delete Firebase user " + firebaseUid + ": " + e.getMessage());
                }
            }
        } catch (Exception e) {
            // Log the detailed error
            System.err.println("Error during account deletion for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete account: " + e.getMessage(), e);
        }
    }

    private User getCurrentUser() {
        String uid = SecurityUtils.getCurrentFirebaseUid();
        if (uid == null) {
            throw new IllegalArgumentException("User not authenticated");
        }
        return userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User profile not created. Please create your profile first."));
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .academicYear(user.getAcademicYear())
                .phoneNumber(user.getPhoneNumber())
                .isVerified(user.isVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private ProductResponse mapToProductResponse(Product product) {
        User seller = product.getSeller();
        UserResponse sellerResponse = UserResponse.builder()
                .id(seller.getId())
                .fullName(seller.getFullName())
                .profilePhotoUrl(seller.getProfilePhotoUrl())
                .academicYear(seller.getAcademicYear())
                .build();

        // Safely check if saved (may not have current user in all contexts)
        boolean isSaved = false;
        try {
            User currentUser = getCurrentUser();
            if (currentUser != null) {
                isSaved = savedItemRepository.existsByUserIdAndProductId(
                        currentUser.getId(), product.getId());
            }
        } catch (Exception e) {
            // Ignore - user not authenticated or not available in this context
        }

        return ProductResponse.builder()
                .id(product.getId())
                .seller(sellerResponse)
                .title(product.getTitle())
                .description(product.getDescription())
                .category(product.getCategory())
                .price(product.getPrice())
                .isFree(product.isFree())
                .isNegotiable(product.isNegotiable())
                .isAvailableForRent(product.isAvailableForRent())
                .status(product.getStatus())
                .images(product.getImages())
                .isSaved(isSaved)
                .createdAt(product.getCreatedAt())
                .build();
    }
}