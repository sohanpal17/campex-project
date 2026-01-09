package com.campex.backend.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImageModerationService {

    @Value("${google.application.credentials}")
    private Resource credentialsResource;

    public static class ValidationResult {
        private final boolean safe;
        private final String reason;

        public ValidationResult(boolean safe, String reason) {
            this.safe = safe;
            this.reason = reason;
        }

        public boolean isSafe() {
            return safe;
        }

        public String getReason() {
            return reason;
        }
    }

    public ValidationResult validateImage(MultipartFile file) {
        try {
            // Load credentials from Spring config
            GoogleCredentials credentials;
            try (InputStream credentialsStream = credentialsResource.getInputStream()) {
                credentials = GoogleCredentials.fromStream(credentialsStream);
            }

            // Create Vision client with explicit credentials
            ImageAnnotatorSettings settings = ImageAnnotatorSettings.newBuilder()
                    .setCredentialsProvider(() -> credentials)
                    .build();
            
            try (ImageAnnotatorClient vision = ImageAnnotatorClient.create(settings)) {
                ByteString imgBytes = ByteString.copyFrom(file.getBytes());

                Image img = Image.newBuilder().setContent(imgBytes).build();
                Feature feat = Feature.newBuilder().setType(Feature.Type.SAFE_SEARCH_DETECTION).build();
                AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                        .addFeatures(feat)
                        .setImage(img)
                        .build();

                List<AnnotateImageRequest> requests = new ArrayList<>();
                requests.add(request);

                BatchAnnotateImagesResponse response = vision.batchAnnotateImages(requests);
                List<AnnotateImageResponse> responses = response.getResponsesList();

                for (AnnotateImageResponse res : responses) {
                    if (res.hasError()) {
                        System.err.printf("Vision API Error: %s\n", res.getError().getMessage());
                        return new ValidationResult(false, "Unable to verify image safety. Please try another image.");
                    }

                    SafeSearchAnnotation annotation = res.getSafeSearchAnnotation();
                    
                    // DEBUG: Print actual scores
                    System.out.println("=== AI Image Scores ===");
                    System.out.println("Adult: " + annotation.getAdult());
                    System.out.println("Violence: " + annotation.getViolence());
                    System.out.println("Racy: " + annotation.getRacy());
                    System.out.println("=====================");
                    
                    // Check adult content
                    if (isLikely(annotation.getAdult())) {
                        return new ValidationResult(false, "Image contains inappropriate adult content and cannot be uploaded.");
                    }
                    
                    // Check violence (stricter threshold - blocks UNLIKELY too)
                    if (isViolent(annotation.getViolence())) {
                        return new ValidationResult(false, "Image contains violent or graphic content and cannot be uploaded.");
                    }
                    
                    // Check racy content
                    if (isLikely(annotation.getRacy())) {
                        return new ValidationResult(false, "Image contains suggestive content and cannot be uploaded.");
                    }
                }
                return new ValidationResult(true, null);
            }
        } catch (IOException e) {
            System.err.println("IOException in Vision API:");
            e.printStackTrace();
            return new ValidationResult(false, "Unable to verify image safety. Please try another image.");
        } catch (Exception e) {
            System.err.println("Unexpected error in Vision API:");
            e.printStackTrace();
            return new ValidationResult(false, "Unable to verify image safety. Please try another image.");
        }
    }

    // Legacy method for backward compatibility
    public boolean isSafe(MultipartFile file) {
        return validateImage(file).isSafe();
    }

    private boolean isLikely(Likelihood likelihood) {
        return likelihood == Likelihood.POSSIBLE || 
               likelihood == Likelihood.LIKELY || 
               likelihood == Likelihood.VERY_LIKELY;
    }

    // Stricter check for violence - also blocks UNLIKELY
    private boolean isViolent(Likelihood likelihood) {
        return likelihood == Likelihood.UNLIKELY ||
               likelihood == Likelihood.POSSIBLE || 
               likelihood == Likelihood.LIKELY || 
               likelihood == Likelihood.VERY_LIKELY;
    }
}