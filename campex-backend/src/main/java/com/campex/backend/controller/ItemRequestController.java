package com.campex.backend.controller;

import com.campex.backend.dto.request.CreateItemRequestRequest;
import com.campex.backend.dto.response.ApiResponse;
import com.campex.backend.dto.response.ItemRequestResponse;
import com.campex.backend.service.ItemRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/item-requests")
@RequiredArgsConstructor
public class ItemRequestController {

    private final ItemRequestService itemRequestService;

    @PostMapping
    public ResponseEntity<ApiResponse<ItemRequestResponse>> createRequest(
            @Valid @RequestBody CreateItemRequestRequest request) {
        ItemRequestResponse response = itemRequestService.createRequest(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Request created successfully"));
    }

    @GetMapping
    public ResponseEntity<Page<ItemRequestResponse>> getAllRequests(Pageable pageable) {
        return ResponseEntity.ok(itemRequestService.getAllRequests(pageable));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<ItemRequestResponse>> getMyRequests(Pageable pageable) {
        return ResponseEntity.ok(itemRequestService.getMyRequests(pageable));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ItemRequestResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        ItemRequestResponse response = itemRequestService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(response, "Status updated successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRequest(@PathVariable Long id) {
        itemRequestService.deleteRequest(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Request deleted successfully"));
    }
}
