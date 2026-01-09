package com.campex.backend.service;

import com.campex.backend.model.Campaign;
import com.campex.backend.model.CampaignInterest;
import com.campex.backend.model.User;
import com.campex.backend.repository.CampaignInterestRepository;
import com.campex.backend.repository.CampaignRepository;
import com.campex.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignService {

    private final CampaignRepository campaignRepository;
    private final CampaignInterestRepository campaignInterestRepository;
    private final UserRepository userRepository;

    public List<Campaign> getActiveCampaigns() {
        return campaignRepository.findByIsActiveTrue();
    }

    public boolean isUserInterested(Long campaignId) {
        String uid = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        return campaignInterestRepository.existsByUserIdAndCampaignId(user.getId(), campaignId);
    }

    @Transactional
    public void markInterest(Long campaignId) {
        String uid = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new IllegalArgumentException("Campaign not found"));

        // Check if already interested
        if (!campaignInterestRepository.existsByUserIdAndCampaignId(user.getId(), campaignId)) {
            CampaignInterest interest = CampaignInterest.builder()
                    .user(user)
                    .campaign(campaign)
                    .build();
            campaignInterestRepository.save(interest);
        }
    }

    @Transactional
    public void unmarkInterest(Long campaignId) {
        String uid = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByFirebaseUid(uid)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        campaignInterestRepository.deleteByUserIdAndCampaignId(user.getId(), campaignId);
    }
}