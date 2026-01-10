package com.campex.backend.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        
        // Serialize LocalDateTime with explicit timezone information
        // Always treat LocalDateTime as IST (Asia/Kolkata) timezone and convert to UTC for transmission
        // This ensures consistent API responses regardless of server deployment location
        // The server's default timezone is set to IST in CampexApplication.init()
        javaTimeModule.addSerializer(LocalDateTime.class, new JsonSerializer<LocalDateTime>() {
            private static final ZoneId IST_TIMEZONE = ZoneId.of("Asia/Kolkata");
            private static final ZoneId UTC_TIMEZONE = ZoneId.of("UTC");
            
            @Override
            public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider serializers) 
                    throws IOException {
                if (value == null) {
                    gen.writeNull();
                } else {
                    // Treat LocalDateTime as IST (consistent with server default timezone) and convert to UTC
                    ZonedDateTime istDateTime = value.atZone(IST_TIMEZONE);
                    ZonedDateTime utcDateTime = istDateTime.withZoneSameInstant(UTC_TIMEZONE);
                    // Format as ISO-8601 string with UTC timezone (e.g., "2024-01-01T10:00:00Z")
                    gen.writeString(utcDateTime.toInstant().toString());
                }
            }
        });
        
        return builder
            .modules(javaTimeModule)
            .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .build();
    }
}

