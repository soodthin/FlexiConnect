/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.soodthin.dto.request.AI.CreateSessionRequest;
import com.soodthin.dto.request.AI.N8nAnalysisRequest;
import com.soodthin.dto.request.AI.SubmitAnswerRequest;
import com.soodthin.dto.response.AI.N8nAnalysisResponse;
import com.soodthin.dto.response.AI.SessionResponse;
import com.soodthin.dto.response.AI.TurnResponse;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.InterviewSession;
import com.soodthin.entity.InterviewTurn;
import com.soodthin.entity.User;
import com.soodthin.repositories.InterviewSessionRepository;
import com.soodthin.repositories.InterviewTurnRepository;
import com.soodthin.services.CandidateService;
import com.soodthin.services.InterviewService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 *
 * @author ADMIN
 */
@Service
@Slf4j
@Transactional
public class InterviewServiceImpl implements InterviewService {

    private final InterviewSessionRepository sessionRepository;
    private final InterviewTurnRepository turnRepository;
    private final CandidateService candidateService;
    private final RestTemplate restTemplate;
    private final String n8nWebhookUrl;

    public InterviewServiceImpl(
            InterviewSessionRepository sessionRepository,
            InterviewTurnRepository turnRepository,
            CandidateService candidateService,
            RestTemplate restTemplate,
            @Value("${ai.n8n.interview-url}") String n8nWebhookUrl) {
        this.sessionRepository = sessionRepository;
        this.turnRepository = turnRepository;
        this.candidateService = candidateService;
        this.restTemplate = restTemplate;
        this.n8nWebhookUrl = n8nWebhookUrl;
    }

    @Override
    public SessionResponse createSession(User user, CreateSessionRequest request) {
        Candidate candidate = candidateService.getCandidateByUser(user);

        InterviewSession session = new InterviewSession();
        session.setCandidateId(candidate);
        session.setJobPostId(request.getJobPostId());
        session.setStatus(InterviewSession.SessionStatus.IN_PROGRESS);
        session.setStartedAt(LocalDateTime.now());

        InterviewSession savedSession = sessionRepository.save(session);

        return SessionResponse.fromEntity(savedSession);

    }

    @Override
    public TurnResponse submitAnswer(User user, SubmitAnswerRequest request) throws Exception {
        Candidate candidate = candidateService.getCandidateByUser(user);
        // Validate session exists and is in progress
        InterviewSession session = sessionRepository.findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getCandidateId().getId().equals(candidate.getId())) {
            throw new RuntimeException("You are not allowed to submit for this session");
        }

        if (session.getStatus() != InterviewSession.SessionStatus.IN_PROGRESS) {
            throw new RuntimeException("Session is not in progress");
        }

        // Get next turn order
        InterviewTurn lastTurn = turnRepository.findTopBySessionId_IdOrderByTurnOrderDesc(request.getSessionId());
        int nextTurnOrder = (lastTurn != null) ? lastTurn.getTurnOrder() + 1 : 1;

        // Call n8n for AI analysis
        N8nAnalysisRequest analysisRequest = new N8nAnalysisRequest(
                request.getQuestion(),
                request.getAnswer(),
                "Job interview context" // You can enhance this with actual job description
        );

        N8nAnalysisResponse analysisResponse = callN8nForAnalysis(analysisRequest);

        // Create and save interview turn
        InterviewTurn turn = new InterviewTurn();
        turn.setSessionId(session);
        turn.setQuestion(request.getQuestion());
        turn.setAnswer(request.getAnswer());
        turn.setTurnOrder(nextTurnOrder);
        turn.setAiScore(analysisResponse.getAiScore());
        turn.setAiFeedback(buildFeedbackText(analysisResponse));
        turn.setCreatedAt(LocalDateTime.now());

        InterviewTurn savedTurn = turnRepository.save(turn);
        log.info("Saved interview turn for session {}, turn order: {}", request.getSessionId(), nextTurnOrder);

        return new TurnResponse(
                savedTurn.getId(),
                savedTurn.getQuestion(),
                savedTurn.getAnswer(),
                savedTurn.getAiFeedback(),
                savedTurn.getAiScore(),
                savedTurn.getTurnOrder(),
                savedTurn.getCreatedAt()
        );
    }

    @Override
    public SessionResponse completeSession(User user, Integer sessionId) {
        Candidate candidate = candidateService.getCandidateByUser(user);

        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getCandidateId().getId().equals(candidate.getId())) {
            throw new RuntimeException("You are not allowed to complete this session");
        }
        session.setStatus(InterviewSession.SessionStatus.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());

        InterviewSession savedSession = sessionRepository.save(session);
        log.info("Completed interview session: {}", sessionId);

        return SessionResponse.fromEntity(savedSession);
    }

    @Override
    public List<TurnResponse> getSessionTurns(User user, Integer sessionId) {
        Candidate candidate = candidateService.getCandidateByUser(user);

        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getCandidateId().getId().equals(candidate.getId())) {
            throw new RuntimeException("You are not allowed to view this session turns");
        }
        List<InterviewTurn> turns = turnRepository.findBySessionId_IdOrderByTurnOrderAsc(sessionId);

        return turns.stream()
                .map(turn -> new TurnResponse(
                turn.getId(),
                turn.getQuestion(),
                turn.getAnswer(),
                turn.getAiFeedback(),
                turn.getAiScore(),
                turn.getTurnOrder(),
                turn.getCreatedAt()
        ))
                .collect(Collectors.toList());
    }

    @Override
    public SessionResponse getSession(User user, Integer sessionId) {
        Candidate candidate = candidateService.getCandidateByUser(user);

        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getCandidateId().getId().equals(candidate.getId())) {
            throw new RuntimeException("You are not allowed to view this session");
        }

        return SessionResponse.fromEntity(session);
    }

    private N8nAnalysisResponse callN8nForAnalysis(N8nAnalysisRequest request) throws Exception {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<N8nAnalysisRequest> entity = new HttpEntity<>(request, headers);
            ResponseEntity<N8nAnalysisResponse> response = restTemplate.postForEntity(
                    n8nWebhookUrl,
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

    private String buildFeedbackText(N8nAnalysisResponse response) {
        StringBuilder feedback = new StringBuilder();
        feedback.append("Feedback: ").append(response.getFeedback()).append("\n\n");
        feedback.append("Strengths: ").append(response.getStrengths()).append("\n\n");
        feedback.append("Weaknesses: ").append(response.getWeaknesses()).append("\n\n");
        feedback.append("Suggested Answer: ").append(response.getSuggestedAnswer());
        return feedback.toString();
    }

}
