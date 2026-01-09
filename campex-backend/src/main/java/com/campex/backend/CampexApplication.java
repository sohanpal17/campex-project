package com.campex.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CampexApplication {
    public static void main(String[] args) {
        SpringApplication.run(CampexApplication.class, args);
    }
}