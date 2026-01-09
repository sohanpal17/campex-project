package com.campex.backend.controller;

import com.campex.backend.dto.response.ApiResponse;
import com.campex.backend.model.Campaign;
import com.campex.backend.service.CampaignService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @GetMapping("/active")
    public ResponseEntity<List<Campaign>> getActiveCampaigns() {
        return ResponseEntity.ok(campaignService.getActiveCampaigns());
    }

    @GetMapping("/{id}/interested")
    public ResponseEntity<ApiResponse<Boolean>> checkInterest(@PathVariable Long id) {
        boolean isInterested = campaignService.isUserInterested(id);
        return ResponseEntity.ok(ApiResponse.success(isInterested, "Interest status retrieved"));
    }

    @PostMapping("/{id}/interest")
    public ResponseEntity<ApiResponse<String>> markInterest(@PathVariable Long id) {
        campaignService.markInterest(id);
        return ResponseEntity.ok(ApiResponse.success("Success", "Interest marked successfully"));
    }

    @DeleteMapping("/{id}/interest")
    public ResponseEntity<ApiResponse<String>> unmarkInterest(@PathVariable Long id) {
        campaignService.unmarkInterest(id);
        return ResponseEntity.ok(ApiResponse.success("Success", "Interest removed successfully"));
    }
}