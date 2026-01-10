package com.campex.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SendVerificationCodeRequest {
    @NotBlank
    @Email
    private String email;
    
    // Optional name field for signup flow
    private String name;
}




