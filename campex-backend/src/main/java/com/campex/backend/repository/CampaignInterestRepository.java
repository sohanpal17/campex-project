package com.campex.backend.repository;

import com.campex.backend.model.CampaignInterest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignInterestRepository extends JpaRepository<CampaignInterest, Long> {
    boolean existsByUserIdAndCampaignId(Long userId, Long campaignId);
    void deleteByUserIdAndCampaignId(Long userId, Long campaignId);
    List<CampaignInterest> findByUserId(Long userId);
}
