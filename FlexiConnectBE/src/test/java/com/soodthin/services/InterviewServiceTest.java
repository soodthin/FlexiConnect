package com.soodthin.services;

import com.soodthin.dto.request.AI.CreateSessionRequest;
import com.soodthin.dto.response.AI.SessionResponse;
import com.soodthin.dto.response.AI.TurnResponse;
import com.soodthin.entity.Application;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.InterviewSession;
import com.soodthin.entity.InterviewSession.SessionStatus;
import com.soodthin.entity.InterviewTurn;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.User;
import com.soodthin.repositories.ApplicationRepository;
import com.soodthin.repositories.InterviewSessionRepository;
import com.soodthin.repositories.InterviewTurnRepository;
import com.soodthin.services.impl.InterviewServiceImpl;
import com.soodthin.services.impl.N8nServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class InterviewServiceTest {

    @Mock
    private InterviewSessionRepository sessionRepository;

    @Mock
    private InterviewTurnRepository turnRepository;

    @Mock
    private CandidateService candidateService;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private N8nServiceImpl n8nService;

    @InjectMocks
    private InterviewServiceImpl interviewService;

    private User candidateUser;
    private Candidate candidate;
    private Application application;
    private InterviewSession session;

    @BeforeEach
    void setUp() {
        candidateUser = new User();
        candidateUser.setId(1);
        candidateUser.setEmail("cand@gmail.com");

        candidate = new Candidate();
        candidate.setId(10);
        candidate.setUserId(candidateUser);

        JobPost jobPost = new JobPost();
        jobPost.setId(100);
        jobPost.setTitle("Fullstack Engineer");

        application = new Application();
        application.setId(200);
        application.setCandidateId(candidate);
        application.setJobPostId(jobPost);

        session = new InterviewSession();
        session.setId(50);
        session.setCandidateId(candidate);
        session.setJobPostId(jobPost);
        session.setStatus(SessionStatus.IN_PROGRESS);
        session.setStartedAt(LocalDateTime.now());
    }

    @Test
    void createSession_ApplicationNotFound_ThrowsRuntimeException() {
        CreateSessionRequest request = new CreateSessionRequest();
        request.setApplicationId(200);

        when(applicationRepository.findById(200)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> interviewService.createSession(candidateUser, request));
        verify(sessionRepository, never()).save(any(InterviewSession.class));
    }

    @Test
    void createSession_UnauthorizedCandidate_ThrowsRuntimeException() {
        Candidate anotherCandidate = new Candidate();
        anotherCandidate.setId(999);

        CreateSessionRequest request = new CreateSessionRequest();
        request.setApplicationId(200);

        when(applicationRepository.findById(200)).thenReturn(Optional.of(application));
        when(candidateService.getCandidateByUser(candidateUser)).thenReturn(anotherCandidate);

        assertThrows(RuntimeException.class, () -> interviewService.createSession(candidateUser, request));
        verify(sessionRepository, never()).save(any(InterviewSession.class));
    }

    @Test
    void createSession_Success() {
        CreateSessionRequest request = new CreateSessionRequest();
        request.setApplicationId(200);

        when(applicationRepository.findById(200)).thenReturn(Optional.of(application));
        when(candidateService.getCandidateByUser(candidateUser)).thenReturn(candidate);
        when(sessionRepository.save(any(InterviewSession.class))).thenAnswer(i -> {
            InterviewSession s = i.getArgument(0);
            s.setId(50);
            return s;
        });

        SessionResponse response = interviewService.createSession(candidateUser, request);

        assertNotNull(response);
        assertEquals(50, response.getId());
        assertEquals(SessionStatus.IN_PROGRESS, response.getStatus());
        verify(sessionRepository).save(any(InterviewSession.class));
    }

    @Test
    void completeSession_SessionNotFound_ThrowsRuntimeException() {
        when(candidateService.getCandidateByUser(candidateUser)).thenReturn(candidate);
        when(sessionRepository.findById(50)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> interviewService.completeSession(candidateUser, 50));
    }

    @Test
    void completeSession_UnauthorizedCandidate_ThrowsRuntimeException() {
        Candidate anotherCandidate = new Candidate();
        anotherCandidate.setId(999);

        when(candidateService.getCandidateByUser(candidateUser)).thenReturn(anotherCandidate);
        when(sessionRepository.findById(50)).thenReturn(Optional.of(session));

        assertThrows(RuntimeException.class, () -> interviewService.completeSession(candidateUser, 50));
        verify(sessionRepository, never()).save(any(InterviewSession.class));
    }

    @Test
    void completeSession_Success() {
        when(candidateService.getCandidateByUser(candidateUser)).thenReturn(candidate);
        when(sessionRepository.findById(50)).thenReturn(Optional.of(session));
        when(sessionRepository.save(any(InterviewSession.class))).thenAnswer(i -> i.getArgument(0));

        SessionResponse response = interviewService.completeSession(candidateUser, 50);

        assertNotNull(response);
        assertEquals(SessionStatus.COMPLETED, response.getStatus());
        assertNotNull(session.getCompletedAt());
        verify(sessionRepository).save(session);
    }

    @Test
    void getSessionTurns_UnauthorizedCandidate_ThrowsRuntimeException() {
        Candidate anotherCandidate = new Candidate();
        anotherCandidate.setId(999);

        when(candidateService.getCandidateByUser(candidateUser)).thenReturn(anotherCandidate);
        when(sessionRepository.findById(50)).thenReturn(Optional.of(session));

        assertThrows(RuntimeException.class, () -> interviewService.getSessionTurns(candidateUser, 50));
    }

    @Test
    void getSessionTurns_Success() {
        InterviewTurn turn1 = new InterviewTurn();
        turn1.setId(1);
        turn1.setTurnOrder(1);
        turn1.setQuestion("What is dependency injection?");
        turn1.setAnswer("It is a design pattern...");
        turn1.setAiScore(85.0);
        turn1.setAiFeedback("Good explanation");
        turn1.setCreatedAt(LocalDateTime.now());

        when(candidateService.getCandidateByUser(candidateUser)).thenReturn(candidate);
        when(sessionRepository.findById(50)).thenReturn(Optional.of(session));
        when(turnRepository.findBySessionId_IdOrderByTurnOrderAsc(50)).thenReturn(List.of(turn1));

        List<TurnResponse> turns = interviewService.getSessionTurns(candidateUser, 50);

        assertNotNull(turns);
        assertEquals(1, turns.size());
        assertEquals("What is dependency injection?", turns.get(0).getQuestion());
        assertEquals(85.0, turns.get(0).getAiScore());
    }
}
