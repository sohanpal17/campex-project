package com.campex.backend.controller;

import com.campex.backend.dto.request.ProfileSetupRequest;
import com.campex.backend.dto.request.UpdateProfileRequest;
import com.campex.backend.dto.response.ApiResponse;
import com.campex.backend.dto.response.ProductResponse;
import com.campex.backend.dto.response.UserResponse;
import com.campex.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile() {
        return ResponseEntity.ok(ApiResponse.success(userService.getMyProfile(), "Profile fetched"));
    }

    @PostMapping("/create-profile")
    public ResponseEntity<ApiResponse<UserResponse>> createProfile(@Valid @RequestBody ProfileSetupRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.createProfile(request), "Profile created"));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateProfile(request), "Profile updated successfully"));
    }

    @GetMapping("/me/listings")
    public ResponseEntity<List<ProductResponse>> getMyListings(@RequestParam(required = false) String status) {
        return ResponseEntity.ok(userService.getMyListings(status));
    }

    @GetMapping("/saved-items")
    public ResponseEntity<List<ProductResponse>> getSavedItems() {
        return ResponseEntity.ok(userService.getSavedItems());
    }

    @PostMapping("/saved-items")
    public ResponseEntity<ApiResponse<Void>> saveItem(@RequestBody Long productId) {
        try {
            userService.saveItem(productId);
            return ResponseEntity.ok(ApiResponse.success(null, "Item saved"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/saved-items/{productId}")
    public ResponseEntity<ApiResponse<Void>> unsaveItem(@PathVariable Long productId) {
        userService.unsaveItem(productId);
        return ResponseEntity.ok(ApiResponse.success(null, "Item unsaved"));
    }

    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> deleteAccount() {
        userService.deleteAccount();
        return ResponseEntity.ok(ApiResponse.success(null, "Account deleted successfully"));
    }

    @PostMapping("/block/{userId}")
    public ResponseEntity<ApiResponse<Void>> blockUser(@PathVariable Long userId) {
        userService.blockUser(userId);
        return ResponseEntity.ok(ApiResponse.success(null, "User blocked"));
    }

    @DeleteMapping("/block/{userId}")
    public ResponseEntity<ApiResponse<Void>> unblockUser(@PathVariable Long userId) {
        userService.unblockUser(userId);
        return ResponseEntity.ok(ApiResponse.success(null, "User unblocked"));
    }

    @GetMapping("/blocked")
    public ResponseEntity<List<UserResponse>> getBlockedUsers() {
        return ResponseEntity.ok(userService.getBlockedUsers());
    }

    @GetMapping("/blocked/check/{userId}")
    public ResponseEntity<ApiResponse<Boolean>> isUserBlocked(@PathVariable Long userId) {
        boolean isBlocked = userService.isUserBlocked(userId);
        return ResponseEntity.ok(ApiResponse.success(isBlocked, isBlocked ? "User is blocked" : "User is not blocked"));
    }
}