
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.soodthin.dto.request.AI.N8nAnalysisRequest;
import com.soodthin.dto.request.AI.N8nQuestionRequest;
import com.soodthin.dto.response.AI.CvSuggestionResponse;
import com.soodthin.dto.response.AI.N8nAnalysisResponse;
import com.soodthin.dto.response.AI.N8nQuestionResponse;
import com.soodthin.services.N8nService;
import jakarta.transaction.Transactional;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

/**
 *
 * @author ADMIN
 */
@Service
@Transactional
public class N8nServiceImpl implements N8nService {

    private static final Logger log = LoggerFactory.getLogger(N8nServiceImpl.class);

    @Value("${ai.n8n.webhook-url}")
    private String cvSuggestionWebhookUrl;

    @Value("${ai.n8n.analysis-url}")
    private String analysisWebhookUrl;

    @Value("${ai.n8n.generate-url}")
    private String questionWebhookUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public CvSuggestionResponse getSuggestionFromAI(String input) {
        Map<String, String> request = new HashMap<>();
        request.put("original_input", input);

        try {
            log.info("👉 Calling CV Suggestion AI at: {}", cvSuggestionWebhookUrl);
            log.info("📤 Payload: {}", request);

            ResponseEntity<String> response = restTemplate.postForEntity(cvSuggestionWebhookUrl, request, String.class);

            log.info("📥 Raw Response: {}", response.getBody());

            return objectMapper.readValue(response.getBody(), CvSuggestionResponse.class);

        } catch (Exception e) {
            log.error("❌ Failed to call CV Suggestion AI: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to call AI: " + e.getMessage(), e);
        }
    }

    @Override

    public N8nQuestionResponse n8nForQuestionGeneration(N8nQuestionRequest request) throws Exception {
        try {

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<N8nQuestionRequest> entity = new HttpEntity<>(request, headers);
            ResponseEntity<N8nQuestionResponse> response = restTemplate.postForEntity(
                    questionWebhookUrl,
                    entity,
                    N8nQuestionResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            } else {
                throw new RuntimeException("Failed to generate question from n8n");
            }
        } catch (Exception e) {
            log.error("Error calling n8n question webhook: {}", e.getMessage());
            throw new RuntimeException("AI question generation service unavailable", e);
        }
    }

    @Override

    public N8nAnalysisResponse n8nForAnalysis(N8nAnalysisRequest request) throws Exception {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<N8nAnalysisRequest> entity = new HttpEntity<>(request, headers);
            ResponseEntity<N8nAnalysisResponse> response = restTemplate.postForEntity(
                    analysisWebhookUrl,
                    entity,
                    N8nAnalysisResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            } else {
                throw new RuntimeException("Failed to get analysis from n8n");
            }
        } catch (Exception e) {
            log.error("Error calling n8n webhook: {}", e.getMessage());
            throw new RuntimeException("AI analysis service unavailable", e);
        }
    }
}
