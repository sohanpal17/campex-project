package com.campex.backend.controller;

import com.campex.backend.dto.response.ApiResponse;
import com.campex.backend.service.ImageModerationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageModerationService moderationService;

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Void>> validateImage(@RequestParam("image") MultipartFile image) {
        if (image == null || image.isEmpty()) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("No image provided"));
        }

        // Validate image with AI - returns detailed error if unsafe
        ImageModerationService.ValidationResult result = moderationService.validateImage(image);

        if (!result.isSafe()) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error(result.getReason()));
        }

        return ResponseEntity.ok(ApiResponse.success(null, "Image is safe to upload"));
    }
}