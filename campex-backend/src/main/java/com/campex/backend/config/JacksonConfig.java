package com.campex.backend.config;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Configuration
public class JacksonConfig {

    /**
     * Custom serializer for LocalDateTime.
     * Important: LocalDateTime has no timezone information.
     * Since the database stores dates without timezone and the server runs in UTC (like Render),
     * we need to interpret stored LocalDateTime values correctly.
     * 
     * Strategy: Treat LocalDateTime from database as UTC (since cloud servers run in UTC),
     * and serialize as ISO-8601 with explicit UTC timezone ('Z' suffix).
     * The frontend will then parse this as UTC and display in user's local timezone (IST for India).
     * 
     * Example: LocalDateTime "2024-01-10T07:11:25" -> "2024-01-10T07:11:25Z" (treated as UTC)
     */
    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
        return builder -> {
            JavaTimeModule javaTimeModule = new JavaTimeModule();
            
            // Serialize LocalDateTime as UTC with 'Z' suffix
            javaTimeModule.addSerializer(LocalDateTime.class, new JsonSerializer<LocalDateTime>() {
                private static final ZoneId UTC = ZoneId.of("UTC");
                
                @Override
                public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider serializers) 
                        throws IOException {
                    if (value == null) {
                        gen.writeNull();
                    } else {
                        // Treat LocalDateTime as UTC (database stores without timezone, cloud servers typically in UTC)
                        // Convert to ZonedDateTime at UTC, then to Instant, then format as ISO-8601 string with 'Z'
                        ZonedDateTime utcDateTime = value.atZone(UTC);
                        String isoString = utcDateTime.toInstant().toString(); // Formats as "2024-01-10T07:11:25.152Z"
                        gen.writeString(isoString);
                    }
                }
            });
            
            builder.modules(javaTimeModule);
            builder.featuresToDisable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        };
    }
}

