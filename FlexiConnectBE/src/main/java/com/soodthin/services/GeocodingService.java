package com.soodthin.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.soodthin.dto.response.CoordinatesResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Optional;

@Service
public class GeocodingService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final String NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

    public Optional<CoordinatesResponse> getCoordinates(String location) {
        if (location == null || location.trim().isEmpty()) {
            return Optional.empty();
        }

        // Xây dựng URL với params
        String url = UriComponentsBuilder.fromHttpUrl(NOMINATIM_URL)
                .queryParam("q", location) // truyền thẳng string có dấu
                .queryParam("format", "json")
                .queryParam("countrycodes", "vn")
                .queryParam("limit", 1)
                .build(false) // <--- thêm false để KHÔNG encode lần 2
                .toUriString();

        try {
            // Set User-Agent (bắt buộc với Nominatim)
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "MySpringApp/1.0 (your_email@example.com)");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // Gọi API
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            System.out.println(">>> [DEBUG] Raw JSON Response từ Nominatim: " + response.getBody());

            // Parse JSON
            JsonNode root = objectMapper.readTree(response.getBody());
            if (root.isArray() && !root.isEmpty()) {
                JsonNode firstResult = root.get(0);
                double lat = firstResult.get("lat").asDouble();
                double lon = firstResult.get("lon").asDouble();
                return Optional.of(new CoordinatesResponse(lat, lon));
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi gọi API Geocoding: " + e.getMessage());
        }

        return Optional.empty();
    }
}
