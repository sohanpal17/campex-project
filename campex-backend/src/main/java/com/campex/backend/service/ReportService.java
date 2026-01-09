package com.campex.backend.service;

import com.campex.backend.dto.request.CreateReportRequest;
import com.campex.backend.model.Report;
import com.campex.backend.model.User;
import com.campex.backend.repository.ReportRepository;
import com.campex.backend.repository.UserRepository;
import com.campex.backend.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final com.campex.backend.repository.ProductRepository productRepository;
    private final EmailService emailService;

    public void createReport(CreateReportRequest request) {
        try {
            System.err.println("DEBUG: Starting createReport");
            String uid = SecurityUtils.getCurrentFirebaseUid();
            System.err.println("DEBUG: UID: " + uid);
            
            if (uid == null) {
                throw new IllegalArgumentException("User not authenticated");
            }
            User reporter = userRepository.findByFirebaseUid(uid)
                    .orElseThrow(() -> new IllegalArgumentException("User profile not created. Please create your profile first."));
            System.err.println("DEBUG: Reporter found: " + reporter.getId());

            User reportedUser = null;
            if (request.getReportedUserId() != null) {
                reportedUser = userRepository.findById(request.getReportedUserId())
                        .orElse(null);
                System.err.println("DEBUG: Reported User found: " + (reportedUser != null ? reportedUser.getId() : "null"));
            }

            com.campex.backend.model.Product reportedProduct = null;
            if (request.getReportedProductId() != null) {
                reportedProduct = productRepository.findById(request.getReportedProductId())
                        .orElse(null);
                System.err.println("DEBUG: Reported Product found: " + (reportedProduct != null ? reportedProduct.getId() : "null"));
            }

            Report report = Report.builder()
                    .reporter(reporter)
                    .reportedUser(reportedUser)
                    .reportedProduct(reportedProduct)
                    .reportType(request.getReportType())
                    .description(request.getDescription())
                    .status("PENDING")
                    .createdAt(LocalDateTime.now())
                    .build();

            System.err.println("DEBUG: Saving report...");
            reportRepository.save(report);
            System.err.println("DEBUG: Report saved successfully with ID: " + report.getId());

            // Send Email to Admin (Safe Fail inside the main try)
            try {
                System.err.println("DEBUG: Attempting to send email...");
                sendReportEmail(report);
                System.err.println("DEBUG: Email sent successfully");
            } catch (Exception e) {
                System.err.println("DEBUG: Failed to send report email: " + e.getMessage());
                e.printStackTrace();
            }

        } catch (Exception e) {
            System.err.println("CRITICAL ERROR in createReport: " + e.getMessage());
            e.printStackTrace();
            throw e; // Check GlobalExceptionHandler
        }
    }

    private void sendReportEmail(Report report) {
        String to = "sohan.work.ai179@gmail.com";
        String subject = "New Report Submitted: " + report.getReportType();
        StringBuilder body = new StringBuilder();
        body.append("A new report has been submitted.\n\n");
        body.append("Reporter: ").append(report.getReporter().getFullName()).append(" (ID: ").append(report.getReporter().getId()).append(")\n");
        body.append("Type: ").append(report.getReportType()).append("\n");
        body.append("Description: ").append(report.getDescription()).append("\n\n");

        if (report.getReportedProduct() != null) {
            body.append("Reported Item: ").append(report.getReportedProduct().getTitle())
                .append(" (ID: ").append(report.getReportedProduct().getId()).append(")\n");
        }

        if (report.getReportedUser() != null) {
            body.append("Reported User: ").append(report.getReportedUser().getFullName())
                .append(" (ID: ").append(report.getReportedUser().getId()).append(")\n");
        }

        body.append("\nPlease check the admin dashboard for more details.");

        emailService.sendSimpleMessage(to, subject, body.toString());
    }
}