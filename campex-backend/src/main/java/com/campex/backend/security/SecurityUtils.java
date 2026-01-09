package com.campex.backend.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Utility class to extract security information from Spring Security context
 */
public class SecurityUtils {

    /**
     * Get the Firebase UID of the currently authenticated user
     * @return Firebase UID or null if not authenticated
     */
    public static String getCurrentFirebaseUid() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();
            if (principal instanceof User) {
                return ((User) principal).getUsername();
            }
        }
        return null;
    }

    /**
     * Get the email of the currently authenticated user from request attributes
     * @return Email or null if not available
     */
    public static String getCurrentUserEmail() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                Object emailAttr = request.getAttribute("email");
                if (emailAttr != null) {
                    return emailAttr.toString();
                }
            }
        } catch (Exception e) {
            // Request context not available
        }
        return null;
    }

    /**
     * Check if user is authenticated
     */
    public static boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.isAuthenticated();
    }
}
