package com.campex.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateProductRequest {
    @NotBlank
    @Size(min = 10, max = 100)
    private String title;

    @NotBlank
    @Size(min = 20, max = 500)
    private String description;

    @NotBlank
    private String category;

    private BigDecimal price;

    private boolean isFree;

    private boolean isNegotiable;

    private boolean isAvailableForRent;

    @NotNull
    @Size(min = 1, max = 5)
    private List<String> images;
}