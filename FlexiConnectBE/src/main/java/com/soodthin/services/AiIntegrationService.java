/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.soodthin.dto.response.AI.CvSuggestionResponse;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


/**
 *
 * @author ADMIN
 */
@Service
public class AiIntegrationService {

    private static final Logger log = LoggerFactory.getLogger(AiIntegrationService.class);

    @Value("${ai.n8n.webhook-url}")
    private String n8nWebhookUrl;


    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper(); // Khởi tạo một lần để tái sử dụng

    public CvSuggestionResponse getSuggestionFromAI(String input) {
        Map<String, String> request = new HashMap<>();
        request.put("original_input", input);

        try {
            log.info("👉 Calling CV Suggestion AI at: {}", n8nWebhookUrl);
            log.info("📤 Payload: {}", request);

            ResponseEntity<String> response = restTemplate.postForEntity(n8nWebhookUrl, request, String.class);

            log.info("📥 Raw Response: {}", response.getBody());

            return objectMapper.readValue(response.getBody(), CvSuggestionResponse.class);

        } catch (Exception e) {
            log.error("❌ Failed to call CV Suggestion AI: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to call AI: " + e.getMessage(), e);
        }
    }

}
