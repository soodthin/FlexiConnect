package com.soodthin.services;

import com.cloudinary.Cloudinary;
import com.soodthin.dto.request.ApplicationReviewRequest;
import com.soodthin.dto.response.CandidateApplicationResponse;
import com.soodthin.dto.response.EmployerApplicationResponse;
import com.soodthin.entity.Application;
import com.soodthin.entity.Application.ApplicationStatus;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.Employer;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.User;
import com.soodthin.repositories.ApplicationRepository;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.EmployerRepository;
import com.soodthin.repositories.JobPostRepository;
import com.soodthin.services.impl.ApplicationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private CandidateRepository candidateRepository;

    @Mock
    private JobPostRepository jobPostRepository;

    @Mock
    private Cloudinary cloudinary;

    @Mock
    private EmployerRepository employerRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ApplicationServiceImpl applicationService;

    private User candidateUser;
    private User employerUser;
    private Candidate candidate;
    private Employer employer;
    private JobPost jobPost;
    private Application application;

    @BeforeEach
    void setUp() {
        candidateUser = new User();
        candidateUser.setId(1);
        candidateUser.setEmail("candidate@gmail.com");
        candidateUser.setFullName("Candidate One");

        candidate = new Candidate();
        candidate.setId(10);
        candidate.setUserId(candidateUser);

        employerUser = new User();
        employerUser.setId(2);
        employerUser.setEmail("employer@gmail.com");
        employerUser.setFullName("Employer HR");

        employer = new Employer();
        employer.setId(20);
        employer.setCompanyName("Tech Corp");
        employer.setUserId(employerUser);

        jobPost = new JobPost();
        jobPost.setId(100);
        jobPost.setTitle("Senior Java Developer");
        jobPost.setEmployerId(employer);

        application = new Application();
        application.setId(500);
        application.setCandidateId(candidate);
        application.setJobPostId(jobPost);
        application.setStatus(ApplicationStatus.PENDING);
        application.setAppliedAt(LocalDateTime.now());
        application.setResumeFile("http://res.cloudinary.com/cv.pdf");
    }

    @Test
    void applyToJob_CandidateNotFound_ThrowsBadRequest() {
        MockMultipartFile file = new MockMultipartFile("cv", "cv.pdf", "application/pdf", "dummy".getBytes());
        when(candidateRepository.findByUserId(candidateUser)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> applicationService.applyToJob(100, file, "letter", candidateUser));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void applyToJob_JobPostNotFound_ThrowsNotFound() {
        MockMultipartFile file = new MockMultipartFile("cv", "cv.pdf", "application/pdf", "dummy".getBytes());
        when(candidateRepository.findByUserId(candidateUser)).thenReturn(Optional.of(candidate));
        when(jobPostRepository.findById(100)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> applicationService.applyToJob(100, file, "letter", candidateUser));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void applyToJob_AlreadyApplied_ThrowsConflict() {
        MockMultipartFile file = new MockMultipartFile("cv", "cv.pdf", "application/pdf", "dummy".getBytes());
        when(candidateRepository.findByUserId(candidateUser)).thenReturn(Optional.of(candidate));
        when(jobPostRepository.findById(100)).thenReturn(Optional.of(jobPost));
        when(applicationRepository.existsByCandidateAndJobPost(candidate, jobPost)).thenReturn(true);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> applicationService.applyToJob(100, file, "letter", candidateUser));

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
    }

    @Test
    void reviewApplication_EmployerNotFound_ThrowsNotFound() {
        ApplicationReviewRequest request = new ApplicationReviewRequest();
        request.setStatus(ApplicationStatus.ACCEPTED);

        when(employerRepository.findByUserId(employerUser)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> applicationService.reviewApplication(500, request, employerUser));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void reviewApplication_ApplicationNotFound_ThrowsNotFound() {
        ApplicationReviewRequest request = new ApplicationReviewRequest();
        request.setStatus(ApplicationStatus.ACCEPTED);

        when(employerRepository.findByUserId(employerUser)).thenReturn(Optional.of(employer));
        when(applicationRepository.findById(500)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> applicationService.reviewApplication(500, request, employerUser));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void reviewApplication_UnauthorizedEmployer_ThrowsForbidden() {
        Employer differentEmployer = new Employer();
        differentEmployer.setId(999);
        differentEmployer.setUserId(employerUser);

        ApplicationReviewRequest request = new ApplicationReviewRequest();
        request.setStatus(ApplicationStatus.ACCEPTED);

        when(employerRepository.findByUserId(employerUser)).thenReturn(Optional.of(differentEmployer));
        when(applicationRepository.findById(500)).thenReturn(Optional.of(application));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> applicationService.reviewApplication(500, request, employerUser));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    @Test
    void reviewApplication_AcceptApplication_Success() {
        ApplicationReviewRequest request = new ApplicationReviewRequest();
        request.setStatus(ApplicationStatus.ACCEPTED);

        when(employerRepository.findByUserId(employerUser)).thenReturn(Optional.of(employer));
        when(applicationRepository.findById(500)).thenReturn(Optional.of(application));

        EmployerApplicationResponse response = applicationService.reviewApplication(500, request, employerUser);

        assertNotNull(response);
        assertEquals(ApplicationStatus.ACCEPTED, application.getStatus());
        assertNull(application.getRejectionReason());
        verify(applicationRepository).saveAndFlush(application);
    }

    @Test
    void reviewApplication_RejectApplication_Success() {
        ApplicationReviewRequest request = new ApplicationReviewRequest();
        request.setStatus(ApplicationStatus.REJECTED);
        request.setReason("Not enough experience");

        when(employerRepository.findByUserId(employerUser)).thenReturn(Optional.of(employer));
        when(applicationRepository.findById(500)).thenReturn(Optional.of(application));

        EmployerApplicationResponse response = applicationService.reviewApplication(500, request, employerUser);

        assertNotNull(response);
        assertEquals(ApplicationStatus.REJECTED, application.getStatus());
        assertEquals("Not enough experience", application.getRejectionReason());
        verify(applicationRepository).saveAndFlush(application);
    }

    @Test
    void withdrawApplication_CandidateNotFound_ThrowsBadRequest() {
        when(candidateRepository.findByUserId(candidateUser)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> applicationService.withdrawApplication(500, candidateUser));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void withdrawApplication_ApplicationNotFound_ThrowsNotFound() {
        when(candidateRepository.findByUserId(candidateUser)).thenReturn(Optional.of(candidate));
        when(applicationRepository.findById(500)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> applicationService.withdrawApplication(500, candidateUser));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void withdrawApplication_DifferentCandidate_ThrowsForbidden() {
        Candidate anotherCandidate = new Candidate();
        anotherCandidate.setId(888);

        when(candidateRepository.findByUserId(candidateUser)).thenReturn(Optional.of(anotherCandidate));
        when(applicationRepository.findById(500)).thenReturn(Optional.of(application));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> applicationService.withdrawApplication(500, candidateUser));

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    @Test
    void withdrawApplication_AlreadyRejected_ThrowsBadRequest() {
        application.setStatus(ApplicationStatus.REJECTED);

        when(candidateRepository.findByUserId(candidateUser)).thenReturn(Optional.of(candidate));
        when(applicationRepository.findById(500)).thenReturn(Optional.of(application));

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> applicationService.withdrawApplication(500, candidateUser));

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void withdrawApplication_Success() {
        when(candidateRepository.findByUserId(candidateUser)).thenReturn(Optional.of(candidate));
        when(applicationRepository.findById(500)).thenReturn(Optional.of(application));

        CandidateApplicationResponse response = applicationService.withdrawApplication(500, candidateUser);

        assertNotNull(response);
        assertEquals(ApplicationStatus.WITHDRAWN, application.getStatus());
        verify(applicationRepository).save(application);
    }
}
