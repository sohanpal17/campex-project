package com.campex.backend.controller;

import com.campex.backend.dto.request.SendVerificationCodeRequest;
import com.campex.backend.dto.request.SignupRequest;
import com.campex.backend.dto.request.VerifyCodeRequest;
import com.campex.backend.dto.request.VerifyTokenRequest;
import com.campex.backend.dto.request.ResetPasswordRequest;
import com.campex.backend.dto.response.ApiResponse;
import com.campex.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<String>> signup(@Valid @RequestBody SignupRequest request) {
        try {
            authService.signup(request);
            return ResponseEntity.ok(ApiResponse.success(null, "Signup successful. Check email for verification code."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<ApiResponse<Boolean>> verifyCode(@Valid @RequestBody VerifyCodeRequest request) {
        try {
            boolean verified = authService.verifyCode(request.getEmail(), request.getCode());
            return ResponseEntity.ok(ApiResponse.success(verified, "Email verified successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/send-verification-code")
    public ResponseEntity<ApiResponse<String>> sendVerificationCode(@Valid @RequestBody SendVerificationCodeRequest request) {
        try {
            authService.sendVerificationCode(request.getEmail(), request.getName());
            return ResponseEntity.ok(ApiResponse.success(null, "Verification code sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to send verification code: " + e.getMessage()));
        }
    }

    @PostMapping("/resend-code")
    public ResponseEntity<ApiResponse<String>> resendCode(@RequestParam String email) {
        try {
            authService.sendVerificationCode(email);
            return ResponseEntity.ok(ApiResponse.success(null, "Verification code resent"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to resend verification code: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-token")
    public ResponseEntity<ApiResponse<Object>> verifyToken(@Valid @RequestBody VerifyTokenRequest request) {
        try {
            // Token is already verified by FirebaseAuthFilter, just return success
            // The filter extracts user info and sets it in security context
            return ResponseEntity.ok(ApiResponse.success(null, "Token verified successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to verify token: " + e.getMessage()));
        }
    }

    @PostMapping("/send-password-reset-code")
    public ResponseEntity<ApiResponse<String>> sendPasswordResetCode(@Valid @RequestBody SendVerificationCodeRequest request) {
        try {
            authService.sendPasswordResetCode(request.getEmail());
            return ResponseEntity.ok(ApiResponse.success(null, "Password reset code sent to your email"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to send reset code: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<ApiResponse<Boolean>> verifyResetCode(@Valid @RequestBody VerifyCodeRequest request) {
        try {
            boolean verified = authService.verifyResetCode(request.getEmail(), request.getCode());
            return ResponseEntity.ok(ApiResponse.success(verified, "Reset code verified successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request.getEmail(), request.getNewPassword());
            return ResponseEntity.ok(ApiResponse.success(null, "Password reset successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to reset password: " + e.getMessage()));
        }
    }
}