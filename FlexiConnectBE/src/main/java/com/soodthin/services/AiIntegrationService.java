/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 *
 * @author ADMIN
 */
@Service
public class AiIntegrationService {

    @Value("${ai.n8n.webhook-url}")
    private String n8nWebhookUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getSuggestionFromAI(String input, String section) {
        Map<String, String> request = new HashMap<>();
        request.put("input", input);
        request.put("section", section);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(n8nWebhookUrl, request, Map.class);
            return (String) response.getBody().get("suggestion");
        } catch (Exception e) {
            throw new RuntimeException("Failed to call AI: " + e.getMessage());
        }
    }
}

