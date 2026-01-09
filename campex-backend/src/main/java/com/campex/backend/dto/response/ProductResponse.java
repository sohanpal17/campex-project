package com.campex.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private UserResponse seller;
    private String title;
    private String description;
    private String category;
    private BigDecimal price;
    
    @JsonProperty("isFree")
    private boolean isFree;
    
    @JsonProperty("isNegotiable")
    private boolean isNegotiable;
    
    @JsonProperty("isAvailableForRent")
    private boolean isAvailableForRent;
    
    private String status;
    private List<String> images;
    
    @JsonProperty("isSaved")
    private boolean isSaved; // If current user saved it
    
    private LocalDateTime createdAt;
}