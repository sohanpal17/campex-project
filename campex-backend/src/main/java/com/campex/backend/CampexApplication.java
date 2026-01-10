package com.campex.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CampexApplication {

    public static void main(String[] args) {
        // Set default timezone to UTC before Spring Boot initializes
        // This ensures consistent behavior - dates in DB will be stored in UTC
        // JacksonConfig will serialize them correctly as UTC for API responses
        java.util.TimeZone.setDefault(java.util.TimeZone.getTimeZone("UTC"));
        SpringApplication.run(CampexApplication.class, args);
    }
}