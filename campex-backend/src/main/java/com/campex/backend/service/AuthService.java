package com.campex.backend.service;

import com.campex.backend.dto.request.SignupRequest;
import com.campex.backend.model.User;
import com.campex.backend.model.VerificationCode;
import com.campex.backend.repository.UserRepository;
import com.campex.backend.repository.VerificationCodeRepository;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;

    @Value("${app.college-domain}")
    private String collegeDomain;

    public void signup(SignupRequest request) throws Exception {
        if (!request.getEmail().endsWith(collegeDomain)) {
            throw new IllegalArgumentException("Email must belong to " + collegeDomain);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Create Firebase User
        UserRecord.CreateRequest createRequest = new UserRecord.CreateRequest()
                .setEmail(request.getEmail())
                .setPassword(request.getPassword())
                .setDisplayName(request.getFullName())
                .setEmailVerified(false)
                .setDisabled(false);

        UserRecord userRecord = FirebaseAuth.getInstance().createUser(createRequest);

        // Create Local User (unverified)
        User user = User.builder()
                .firebaseUid(userRecord.getUid())
                .email(request.getEmail())
                .fullName(request.getFullName())
                .isVerified(false)
                .build();

        userRepository.save(user);

        // Send verification code
        sendVerificationCode(user.getEmail());
    }

    public void sendVerificationCode(String email) {
        sendVerificationCode(email, null);
    }

    public void sendVerificationCode(String email, String fullName) {
        // If user is authenticated and user doesn't exist, create user record
        String firebaseUid = com.campex.backend.security.SecurityUtils.getCurrentFirebaseUid();
        if (firebaseUid != null && fullName != null && !fullName.isEmpty()) {
            // Check if user exists by Firebase UID
            User existingUser = userRepository.findByFirebaseUid(firebaseUid).orElse(null);
            
            if (existingUser == null) {
                // Check if user exists by email (might have been created via backend signup)
                existingUser = userRepository.findByEmail(email).orElse(null);
                
                if (existingUser != null) {
                    // User exists by email but with different/no Firebase UID - update it
                    existingUser.setFirebaseUid(firebaseUid);
                    if (existingUser.getFullName() == null || existingUser.getFullName().isEmpty()) {
                        existingUser.setFullName(fullName);
                    }
                    userRepository.save(existingUser);
                } else {
                    // User doesn't exist - create new user record
                    User user = User.builder()
                            .firebaseUid(firebaseUid)
                            .email(email)
                            .fullName(fullName)
                            .isVerified(false)
                            .build();
                    userRepository.save(user);
                }
            } else {
                // User exists by Firebase UID - update name if empty
                if (existingUser.getFullName() == null || existingUser.getFullName().isEmpty()) {
                    existingUser.setFullName(fullName);
                    userRepository.save(existingUser);
                }
            }
        }

        String code = String.format("%06d", new Random().nextInt(999999));
        
        VerificationCode verificationCode = VerificationCode.builder()
                .email(email)
                .code(code)
                .type("EMAIL_VERIFICATION")
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .build();

        verificationCodeRepository.save(verificationCode);
        emailService.sendSimpleMessage(email, "Verify your email", "Your verification code is: " + code);
    }

    @Transactional
    public boolean verifyCode(String email, String code) {
        VerificationCode vCode = verificationCodeRepository
                .findTopByEmailAndCodeAndIsUsedFalseOrderByCreatedAtDesc(email, code)
                .orElseThrow(() -> new IllegalArgumentException("Invalid code"));

        if (vCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Code expired");
        }

        vCode.setUsed(true);
        verificationCodeRepository.save(vCode);

        // Find or create user
        User user = userRepository.findByEmail(email).orElse(null);
        
        // Get Firebase UID from auth context if available
        String firebaseUid = com.campex.backend.security.SecurityUtils.getCurrentFirebaseUid();
        String currentEmail = com.campex.backend.security.SecurityUtils.getCurrentUserEmail();
        
        if (user == null) {
            // User doesn't exist - try to create using Firebase UID from auth context
            if (firebaseUid == null || currentEmail == null || !currentEmail.equals(email)) {
                throw new IllegalArgumentException("User not found. Please ensure you are logged in with the correct account.");
            }
            
            // Create user record if Firebase UID is available
            user = User.builder()
                    .firebaseUid(firebaseUid)
                    .email(email)
                    .fullName("") // Will be set during profile setup
                    .isVerified(false)
                    .build();
            user = userRepository.save(user);
        } else if (firebaseUid != null && (user.getFirebaseUid() == null || !user.getFirebaseUid().equals(firebaseUid))) {
            // User exists by email but Firebase UID is different or missing - update it
            user.setFirebaseUid(firebaseUid);
            userRepository.save(user);
        }
        
        // Mark user as verified
        user.setVerified(true);
        userRepository.save(user);

        return true;
    }

    // Send password reset code
    public void sendPasswordResetCode(String email) {
        // Check if user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No account found with this email address. Please check your email or sign up."));

        // Generate verification code
        String code = String.format("%06d", new Random().nextInt(999999));
        
        VerificationCode verificationCode = VerificationCode.builder()
                .email(email)
                .code(code)
                .type("PASSWORD_RESET")
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .build();

        verificationCodeRepository.save(verificationCode);
        emailService.sendSimpleMessage(email, "Reset your password", 
            "Your password reset code is: " + code + ". This code will expire in 10 minutes.");
    }

    // Verify password reset code
    @Transactional
    public boolean verifyResetCode(String email, String code) {
        VerificationCode vCode = verificationCodeRepository
                .findTopByEmailAndCodeAndIsUsedFalseOrderByCreatedAtDesc(email, code)
                .orElseThrow(() -> new IllegalArgumentException("Invalid code"));

        if (!"PASSWORD_RESET".equals(vCode.getType())) {
            throw new IllegalArgumentException("Invalid code type");
        }

        if (vCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Code expired");
        }

        vCode.setUsed(true);
        verificationCodeRepository.save(vCode);

        return true;
    }

    // Reset password using verified code
    @Transactional
    public void resetPassword(String email, String newPassword) throws Exception {
        // Verify user exists
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Update password in Firebase
        UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(user.getFirebaseUid())
                .setPassword(newPassword);
        
        FirebaseAuth.getInstance().updateUser(request);
    }
}