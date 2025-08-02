package com.soodthin.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleResponseStatusException(ResponseStatusException ex) {
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("error", ex.getStatusCode().toString());
        responseBody.put("code", ex.getStatusCode().value());
        responseBody.put("message", ex.getReason());
        return ResponseEntity.status(ex.getStatusCode()).body(responseBody);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("error", "INTERNAL_SERVER_ERROR");
        responseBody.put("code", 500);
        responseBody.put("message", "Lỗi không xác định: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseBody);
    }
}
