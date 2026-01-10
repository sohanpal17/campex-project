package com.campex.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender emailSender;
    
    @Value("${spring.mail.password:}")
    private String mailPassword;
    
    @Value("${spring.mail.username:}")
    private String mailUsername;
    
    @Value("${spring.mail.host:}")
    private String mailHost;

    @PostConstruct
    public void validateEmailConfiguration() {
        if (mailPassword == null || mailPassword.isEmpty()) {
            log.warn("MAIL_PASSWORD environment variable is not set! Email functionality will not work.");
        } else {
            log.info("Email configuration validated.");
            log.info("Host: '{}'", mailHost);
            log.info("Username: '{}'", mailUsername);
            log.info("Password Length: {}", mailPassword.length());
        }
    }

    @Async
    public void sendSimpleMessage(String to, String subject, String text) {
        // Validate email configuration before attempting to send
        if (mailPassword == null || mailPassword.isEmpty()) {
            log.error("Cannot send email: MAIL_PASSWORD is not configured. Email to {} with subject '{}' was not sent.", to, subject);
            return; // Fail gracefully instead of throwing exception
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailUsername != null && !mailUsername.isEmpty() ? mailUsername : "noreply@campex.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            log.info("Attempting to send email to: {}, subject: {}", to, subject);
            emailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (MailException e) {
            log.error("Failed to send email to {}: {}. Subject: '{}'", to, e.getMessage(), subject, e);
            // Don't throw exception for async email sending - just log the error
            // This prevents email failures from breaking the main flow
        } catch (Exception e) {
            log.error("Unexpected error while sending email to {}: {}. Subject: '{}'", to, e.getMessage(), subject, e);
        }
    }
    
    // Synchronous version for critical emails (like reports) where we need to ensure they're sent
    public void sendSimpleMessageSync(String to, String subject, String text) {
        // Validate email configuration before attempting to send
        if (mailPassword == null || mailPassword.isEmpty()) {
            log.error("Cannot send email: MAIL_PASSWORD is not configured. Email to {} with subject '{}' was not sent.", to, subject);
            // For report emails, we don't want to fail the report creation if email is misconfigured
            // The report is already saved in the database, so email failure is non-critical
            log.warn("Report email not sent due to missing email configuration. Report is saved in database.");
            return; // Don't throw - allow report creation to succeed even if email fails
        }
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailUsername != null && !mailUsername.isEmpty() ? mailUsername : "noreply@campex.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            log.info("Attempting to send email synchronously to: {}, subject: {}", to, subject);
            emailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (MailException e) {
            String errorMsg = e.getMessage();
            boolean isConnectionError = errorMsg != null && (
                errorMsg.contains("Connection timed out") || 
                errorMsg.contains("Couldn't connect to host") ||
                errorMsg.contains("Connection refused")
            );
            
            if (isConnectionError) {
                log.error("SMTP connection failed. This may be due to your hosting provider blocking outbound SMTP connections. " +
                    "Consider using a transactional email service (SendGrid, Mailgun, AWS SES) or ensure SMTP ports are not blocked. " +
                    "Email to {} with subject '{}' was not sent. Error: {}", to, subject, errorMsg);
                log.warn("Report email not sent due to SMTP connection failure. Report is saved in database.");
                // Don't throw - allow report creation to succeed even if email fails
                return;
            }
            
            log.error("Failed to send email to {}: {}. Subject: '{}'", to, errorMsg, subject, e);
            log.warn("Report email not sent due to email error. Report is saved in database.");
            // Don't throw - email failure should not break report creation
        } catch (Exception e) {
            log.error("Unexpected error while sending email to {}: {}. Subject: '{}'", to, e.getMessage(), subject, e);
            log.warn("Report email not sent due to unexpected error. Report is saved in database.");
            // Don't throw - email failure should not break report creation
        }
    }
}