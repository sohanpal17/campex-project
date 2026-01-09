package com.campex.backend.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdateProductRequest {
    private String title;
    private String description;
    private String category;
    private BigDecimal price;
    private Boolean isFree;
    private Boolean isNegotiable;
    private Boolean isAvailableForRent;
    private String status;
}