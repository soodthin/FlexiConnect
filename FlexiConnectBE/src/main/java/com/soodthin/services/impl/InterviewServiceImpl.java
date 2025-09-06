/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.soodthin.dto.SessionStatistics;
import com.soodthin.dto.request.AI.*;
import com.soodthin.dto.response.AI.*;
import com.soodthin.entity.Application;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.InterviewSession;
import com.soodthin.entity.InterviewTurn;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.User;
import com.soodthin.repositories.ApplicationRepository;
import com.soodthin.repositories.InterviewSessionRepository;
import com.soodthin.repositories.InterviewTurnRepository;
import com.soodthin.repositories.JobPostRepository;
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
    private final ApplicationRepository applicationRepository;
    private final String n8nWebhookUrl;
    private final String n8nQuestionWebhookUrl;

    public InterviewServiceImpl(
            InterviewSessionRepository sessionRepository,
            InterviewTurnRepository turnRepository,
            CandidateService candidateService,
            RestTemplate restTemplate,
            ApplicationRepository applicationRepository,
            @Value("${ai.n8n.analysis-url}") String n8nWebhookUrl,
            @Value("${ai.n8n.generate-url}") String n8nQuestionWebhookUrl) {
        this.sessionRepository = sessionRepository;
        this.turnRepository = turnRepository;
        this.candidateService = candidateService;
        this.restTemplate = restTemplate;
        this.applicationRepository = applicationRepository;
        this.n8nWebhookUrl = n8nWebhookUrl;
        this.n8nQuestionWebhookUrl = n8nQuestionWebhookUrl;
    }

    @Override
    public SessionResponse createSession(User user, CreateSessionRequest request) {
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Candidate candidate = candidateService.getCandidateByUser(user);
        if (!application.getCandidateId().getId().equals(candidate.getId())) {
            throw new RuntimeException("Bạn không có quyền tạo session cho application này!");
        }

        // Tạo session mới
        InterviewSession session = new InterviewSession();
        session.setCandidateId(candidate);
        session.setJobPostId(application.getJobPostId());
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
    public SubmitAnswerResponse submitAnswerNextQuest(User user, Integer sessionId, SubmitAnswerRequest request) throws Exception {
        Candidate candidate = candidateService.getCandidateByUser(user);

        // Validate session exists and belongs to candidate
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getCandidateId().getId().equals(candidate.getId())) {
            throw new RuntimeException("You are not allowed to submit for this session");
        }

        if (session.getStatus() != InterviewSession.SessionStatus.IN_PROGRESS) {
            throw new RuntimeException("Session is not in progress");
        }

        // Determine question to use
        String questionToUse;
        if (request.getQuestion() == null || request.getQuestion().trim().isEmpty()) {
            GenerateQuestionResponse generatedQuestion = generateContextualQuestion(
                    user,
                    sessionId,
                    request.getDifficulty() != null ? request.getDifficulty() : "MIDDLE",
                    request.getCategory() != null ? request.getCategory() : "TECHNICAL"
            );
            questionToUse = generatedQuestion.getQuestion();
            log.info("Auto-generated question for session {}: {}", sessionId, questionToUse);
        } else {
            questionToUse = request.getQuestion();
            log.info("Using provided question for session {}", sessionId);
        }

        // Get next turn order
        InterviewTurn lastTurn = turnRepository.findTopBySessionId_IdOrderByTurnOrderDesc(sessionId);
        int nextTurnOrder = (lastTurn != null) ? lastTurn.getTurnOrder() + 1 : 1;

        // Call AI analysis via n8n
        N8nAnalysisRequest analysisRequest = new N8nAnalysisRequest(
                questionToUse,
                request.getAnswer(),
                getJobContextForSession(sessionId)
        );

        N8nAnalysisResponse analysisResponse = callN8nForAnalysis(analysisRequest);

        // Save turn
        InterviewTurn turn = new InterviewTurn();
        turn.setSessionId(session);
        turn.setQuestion(questionToUse);
        turn.setAnswer(request.getAnswer());
        turn.setTurnOrder(nextTurnOrder);
        turn.setAiScore(analysisResponse.getAiScore());
        turn.setAiFeedback(buildFeedbackText(analysisResponse));
        turn.setCreatedAt(LocalDateTime.now());

        InterviewTurn savedTurn = turnRepository.save(turn);
        log.info("Saved interview turn for session {}, turn order: {}", sessionId, nextTurnOrder);

        // Prepare current turn response
        TurnResponse currentTurnResponse = new TurnResponse(
                savedTurn.getId(),
                savedTurn.getQuestion(),
                savedTurn.getAnswer(),
                savedTurn.getAiFeedback(),
                savedTurn.getAiScore(),
                savedTurn.getTurnOrder(),
                savedTurn.getCreatedAt()
        );

        // Generate next question automatically
        GenerateQuestionResponse nextQuestion = null;
        try {
            nextQuestion = getNextQuestionForSession(user, sessionId);
        } catch (Exception e) {
            log.warn("Could not generate next question: {}", e.getMessage());
        }

        // Calculate session statistics
        SessionStatistics sessionStats = calculateSessionStatistics(sessionId);

        return new SubmitAnswerResponse(currentTurnResponse, nextQuestion, sessionStats);
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

    @Override
    public GenerateQuestionResponse generateQuestion(User user, GenerateQuestionRequest request) throws Exception {

        Integer questionNumber = 1;

        // Nếu sessionId được cung cấp, validate session và tính turnOrder
        InterviewSession session = null;
        if (request.getSessionId() != null) {
            Candidate candidate = candidateService.getCandidateByUser(user);

            session = sessionRepository.findById(request.getSessionId())
                    .orElseThrow(() -> new RuntimeException("Session not found"));

            if (!session.getCandidateId().getId().equals(candidate.getId())) {
                throw new RuntimeException("You are not allowed to generate question for this session");
            }

            // Lấy turnOrder tiếp theo
            InterviewTurn lastTurn = turnRepository.findTopBySessionId_IdOrderByTurnOrderDesc(request.getSessionId());
            questionNumber = (lastTurn != null) ? lastTurn.getTurnOrder() + 1 : 1;
        }

        // Chuẩn bị request gửi n8n
        N8nQuestionRequest questionRequest = new N8nQuestionRequest();
        questionRequest.setJobTitle(request.getJobTitle());
        questionRequest.setJobDescription(request.getJobDescription());
        questionRequest.setDifficulty(request.getDifficulty());
        questionRequest.setCategory(request.getCategory());
        questionRequest.setQuestionNumber(questionNumber);
        System.out.println("Job Title: " + questionRequest.getJobTitle());
        System.out.println("Job Description: " + questionRequest.getJobDescription());

        // Gọi n8n để tạo câu hỏi
        N8nQuestionResponse questionResponse = callN8nForQuestionGeneration(questionRequest);

        // Trả về response
        return new GenerateQuestionResponse(
                questionResponse.getQuestion(),
                questionResponse.getCategory(),
                questionResponse.getDifficulty(),
                questionResponse.getExpectedSkills(),
                questionResponse.getContext()
        );
    }

    @Override
    public GenerateQuestionResponse generateContextualQuestion(
            User user,
            Integer sessionId,
            String difficulty,
            String category) throws Exception {

        Candidate candidate = candidateService.getCandidateByUser(user);

        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getCandidateId().getId().equals(candidate.getId())) {
            throw new RuntimeException("You are not allowed to generate question for this session");
        }

        JobPost jobPost = session.getJobPostId();

        String description = jobPost.getDescription();
        String jobDescription = description;
        for (String line : description.split("\n")) {
            if (line.trim().startsWith("Fields:")) {
                jobDescription = line.replace("Fields:", "").trim();
                break;
            }
        }

        GenerateQuestionRequest request = new GenerateQuestionRequest(
                jobPost.getTitle(), 
                jobDescription, 
                difficulty,
                category,
                sessionId
        );

        return generateQuestion(user, request);
    }

    @Override
    public GenerateQuestionResponse getNextQuestionForSession(User user, Integer sessionId) throws Exception {
        // Lấy tất cả các turn của session theo thứ tự
        List<InterviewTurn> turns = turnRepository.findBySessionId_IdOrderByTurnOrderAsc(sessionId);

        String difficulty;
        String category;

        // Logic điều chỉnh mức độ câu hỏi dựa trên số turn và điểm trung bình AI
        if (turns.size() <= 1) {
            difficulty = "JUNIOR";
            category = "BEHAVIORAL"; // Bắt đầu dễ
        } else if (turns.size() <= 3) {
            // Tính điểm trung bình AI của các turn đã có
            Double avgScore = turns.stream()
                    .filter(t -> t.getAiScore() != null)
                    .mapToDouble(InterviewTurn::getAiScore)
                    .average()
                    .orElse(50.0);

            if (avgScore >= 80) {
                difficulty = "SENIOR";
            } else if (avgScore >= 60) {
                difficulty = "MIDDLE";
            } else {
                difficulty = "JUNIOR";
            }
            category = "TECHNICAL";
        } else {
            difficulty = "SENIOR";
            category = "SITUATIONAL"; // Câu hỏi nâng cao
        }

        return generateContextualQuestion(user, sessionId, difficulty, category);
    }

    private SessionStatistics calculateSessionStatistics(Integer sessionId) {
        List<InterviewTurn> turns = turnRepository.findBySessionId_IdOrderByTurnOrderAsc(sessionId);

        Integer totalTurns = turns.size();
        Double averageScore = turnRepository.findAverageAiScoreBySessionId_Id(sessionId);

        String overallFeedback;
        if (averageScore == null) {
            overallFeedback = "No scores available yet";
        } else if (averageScore >= 80) {
            overallFeedback = "Excellent performance overall";
        } else if (averageScore >= 60) {
            overallFeedback = "Good performance with room for improvement";
        } else {
            overallFeedback = "Needs significant improvement";
        }

        return new SessionStatistics(totalTurns, averageScore, overallFeedback);
    }

    private String getJobContextForSession(Integer sessionId) {
        // Lấy session
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // Lấy job post liên quan, ví dụ session chứa thông tin jobId
        JobPost jobPost = session.getJobPostId();
        if (jobPost == null) {
            throw new RuntimeException("Job post not found for session " + sessionId);
        }
        // Trả về mô tả công việc để AI sử dụng
        return jobPost.getDescription();
    }

    private N8nQuestionResponse callN8nForQuestionGeneration(N8nQuestionRequest request) throws Exception {
        try {

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<N8nQuestionRequest> entity = new HttpEntity<>(request, headers);
            ResponseEntity<N8nQuestionResponse> response = restTemplate.postForEntity(
                    n8nQuestionWebhookUrl,
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

}
