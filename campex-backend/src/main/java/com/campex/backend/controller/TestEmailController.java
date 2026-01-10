package com.campex.backend.controller;

import com.campex.backend.dto.response.ApiResponse;
import com.campex.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public/test-email")
@RequiredArgsConstructor
public class TestEmailController {

    private final EmailService emailService;

    @Value("${spring.mail.username}")
    private String mailUsername;

    @Value("${spring.mail.password}")
    private String mailPassword;

    @Value("${spring.mail.host}")
    private String mailHost;

    @Value("${spring.mail.port}")
    private String mailPort;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> testEmail() {
        Map<String, Object> diagnostics = new HashMap<>();
        
        // Mask password
        String maskedPass = (mailPassword != null && !mailPassword.isEmpty()) 
            ? "PRESENT (Length: " + mailPassword.length() + ")" 
            : "MISSING";

        diagnostics.put("Host", mailHost);
        diagnostics.put("Port", mailPort);
        diagnostics.put("Username", "'" + mailUsername + "'"); // Quotes to find whitespace
        diagnostics.put("PasswordStatus", maskedPass);

        try {
            emailService.sendSimpleMessageSync(mailUsername, "Test Email", "This is a test email from Campex Backend.");
            diagnostics.put("Result", "SUCCESS! Email sent to " + mailUsername);
            return ResponseEntity.ok(ApiResponse.success(diagnostics, "Email test successful"));
        } catch (Exception e) {
            diagnostics.put("Result", "FAILED");
            diagnostics.put("Error", e.getMessage());
            diagnostics.put("ExceptionClass", e.getClass().getName());
            return ResponseEntity.ok(ApiResponse.success(diagnostics, "Email test failed"));
        }
    }
}
