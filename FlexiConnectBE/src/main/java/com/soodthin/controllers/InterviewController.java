/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.soodthin.dto.request.AI.*;
import com.soodthin.dto.response.AI.*;
import com.soodthin.entity.User;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.InterviewService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;

/**
 *
 * @author ADMIN
 */
@RestController
@RequestMapping("/api/interview")
@Slf4j
public class InterviewController {

    @Autowired
    private InterviewService interviewService;
    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/sessions")
    public ResponseEntity<SessionResponse> createSession(
            Authentication auth,
            @Valid @RequestBody CreateSessionRequest request) {
        try {
            User user = getCurrentUser(auth);
            SessionResponse response = interviewService.createSession(user, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error creating session: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/sessions/{sessionId}/answers")
    public ResponseEntity<SubmitAnswerResponse> submitAnswer(
            Authentication auth,
            @PathVariable Integer sessionId,
            @Valid @RequestBody SubmitAnswerRequest request) {
        try {
            User user = getCurrentUser(auth);
            SubmitAnswerResponse response = interviewService.submitAnswerNextQuest(user, sessionId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error submitting answer: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            log.error("Error submitting answer: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/sessions/{sessionId}/answers/simple")
    public ResponseEntity<TurnResponse> submitAnswerSimple(
            Authentication authentication,
            @PathVariable Integer sessionId,
            @Valid @RequestBody SubmitAnswerRequest request) {
        try {
            User user = getCurrentUser(authentication);

            // convert sang định dạng cũ
            SubmitAnswerRequest oldRequest = new SubmitAnswerRequest();
            oldRequest.setSessionId(sessionId);
            oldRequest.setQuestion(request.getQuestion());
            oldRequest.setAnswer(request.getAnswer());

            TurnResponse response = interviewService.submitAnswer(user, oldRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error submitting simple answer: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            log.error("Error submitting simple answer: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/sessions/{sessionId}/complete")
    public ResponseEntity<SessionResponse> completeSession(
            @PathVariable Integer sessionId,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);

            SessionResponse response = interviewService.completeSession(user, sessionId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error completing session: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error completing session: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/sessions/{sessionId}")
    public ResponseEntity<SessionResponse> getSession(
            @PathVariable Integer sessionId,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);

            SessionResponse response = interviewService.getSession(user, sessionId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Session not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error getting session: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/sessions/{sessionId}/turns")
    public ResponseEntity<List<TurnResponse>> getSessionTurns(
            @PathVariable Integer sessionId,
            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);

            List<TurnResponse> response = interviewService.getSessionTurns(user, sessionId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting session turns: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Interview service is running");
    }

    @PostMapping("/questions/generate")
    public ResponseEntity<GenerateQuestionResponse> generateQuestion(
            Authentication authentication,
            @Valid @RequestBody GenerateQuestionRequest request) {
        try {
            User user = getCurrentUser(authentication);
            GenerateQuestionResponse response = interviewService.generateQuestion(user, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error generating question: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/sessions/{sessionId}/questions")
    public ResponseEntity<GenerateQuestionResponse> generateQuestionForSession(
            Authentication authentication,
            @PathVariable Integer sessionId,
            @RequestParam(defaultValue = "MIDDLE") String difficulty,
            @RequestParam(defaultValue = "TECHNICAL") String category) {
        try {
            User user = getCurrentUser(authentication);
            GenerateQuestionResponse response = interviewService.generateContextualQuestion(
                    user, sessionId, difficulty, category);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Session not found or access denied: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error generating contextual question: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/sessions/{sessionId}/next-question")
    public ResponseEntity<GenerateQuestionResponse> getNextQuestion(
            Authentication authentication,
            @PathVariable Integer sessionId) {
        try {
            User user = getCurrentUser(authentication);
            GenerateQuestionResponse response = interviewService.getNextQuestionForSession(user, sessionId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Session not found or access denied: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error getting next question: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }

    // API lấy câu hỏi tiếp theo mà không cần submit answer
    @GetMapping("/sessions/{sessionId}/current-question")
    public ResponseEntity<GenerateQuestionResponse> getCurrentQuestion(
            Authentication authentication,
            @PathVariable Integer sessionId) {
        try {
            User user = getCurrentUser(authentication);
            GenerateQuestionResponse response = interviewService.getNextQuestionForSession(user, sessionId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting current question: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
