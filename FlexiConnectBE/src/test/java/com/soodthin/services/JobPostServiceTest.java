package com.soodthin.services;

import com.soodthin.dto.request.JobPostRequest;
import com.soodthin.dto.response.JobPostResponse;
import com.soodthin.entity.Employer;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.JobPost.JobStatus;
import com.soodthin.entity.User;
import com.soodthin.repositories.EmployerRepository;
import com.soodthin.repositories.FollowEmployerRepository;
import com.soodthin.repositories.JobPostRepository;
import com.soodthin.services.impl.JobPostServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JobPostServiceTest {

    @Mock
    private JobPostRepository jobPostRepository;

    @Mock
    private EmployerRepository employerRepository;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private FollowEmployerRepository followEmployerRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private SimpMessagingTemplate simpMessagingTemplate;

    @Mock
    private GeocodingService geocodingService;

    @InjectMocks
    private JobPostServiceImpl jobPostService;

    private User employerUser;
    private Employer employer;
    private JobPost jobPost;

    @BeforeEach
    void setUp() {
        employerUser = new User();
        employerUser.setId(10);
        employerUser.setEmail("hr@company.com");

        employer = new Employer();
        employer.setId(20);
        employer.setCompanyName("Company A");
        employer.setUserId(employerUser);

        jobPost = new JobPost();
        jobPost.setId(100);
        jobPost.setTitle("Frontend Engineer");
        jobPost.setStatus(JobStatus.OPEN);
        jobPost.setViewCount(5);
        jobPost.setEmployerId(employer);
    }

    @Test
    void createJobPost_EmployerNotFound_ThrowsRuntimeException() {
        JobPostRequest request = new JobPostRequest();
        when(employerRepository.findByUserId(employerUser)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> jobPostService.createJobPost(employerUser, request));
        verify(jobPostRepository, never()).save(any(JobPost.class));
    }

    @Test
    void createJobPost_InvalidStatus_ThrowsRuntimeException() {
        JobPostRequest request = new JobPostRequest();
        request.setStatus("INVALID_STATUS");

        JobPost mapped = new JobPost();
        when(employerRepository.findByUserId(employerUser)).thenReturn(Optional.of(employer));
        when(modelMapper.map(request, JobPost.class)).thenReturn(mapped);

        assertThrows(RuntimeException.class, () -> jobPostService.createJobPost(employerUser, request));
        verify(jobPostRepository, never()).save(any(JobPost.class));
    }

    @Test
    void createJobPost_Success() {
        JobPostRequest request = new JobPostRequest();
        request.setTitle("Backend Engineer");
        request.setStatus("OPEN");

        JobPost mapped = new JobPost();
        mapped.setTitle("Backend Engineer");

        when(employerRepository.findByUserId(employerUser)).thenReturn(Optional.of(employer));
        when(modelMapper.map(request, JobPost.class)).thenReturn(mapped);
        when(jobPostRepository.save(any(JobPost.class))).thenAnswer(i -> i.getArgument(0));
        when(followEmployerRepository.findByFollowEmployerPK_EmployerIdAndNotifyJobTrue(20))
                .thenReturn(Collections.emptyList());

        JobPost created = jobPostService.createJobPost(employerUser, request);

        assertNotNull(created);
        assertEquals(JobStatus.OPEN, created.getStatus());
        assertEquals(0, created.getViewCount());
        assertEquals(employer, created.getEmployerId());
        verify(jobPostRepository).save(any(JobPost.class));
    }

    @Test
    void updateJobPost_JobNotFound_ThrowsRuntimeException() {
        JobPostRequest request = new JobPostRequest();
        when(employerRepository.findByUserId(employerUser)).thenReturn(Optional.of(employer));
        when(jobPostRepository.findById(100)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> jobPostService.updateJobPost(employerUser, 100, request));
    }

    @Test
    void updateJobPost_AccessDenied_ThrowsRuntimeException() {
        Employer anotherEmployer = new Employer();
        anotherEmployer.setId(999);

        JobPost otherJob = new JobPost();
        otherJob.setId(100);
        otherJob.setEmployerId(anotherEmployer);

        JobPostRequest request = new JobPostRequest();
        when(employerRepository.findByUserId(employerUser)).thenReturn(Optional.of(employer));
        when(jobPostRepository.findById(100)).thenReturn(Optional.of(otherJob));

        assertThrows(RuntimeException.class, () -> jobPostService.updateJobPost(employerUser, 100, request));
    }

    @Test
    void updateJobPost_Success() {
        JobPostRequest request = new JobPostRequest();
        request.setStatus("CLOSED");

        when(employerRepository.findByUserId(employerUser)).thenReturn(Optional.of(employer));
        when(jobPostRepository.findById(100)).thenReturn(Optional.of(jobPost));
        when(jobPostRepository.save(any(JobPost.class))).thenAnswer(i -> i.getArgument(0));

        JobPost updated = jobPostService.updateJobPost(employerUser, 100, request);

        assertNotNull(updated);
        assertEquals(JobStatus.CLOSED, updated.getStatus());
        assertEquals(5, updated.getViewCount());
        verify(jobPostRepository).save(jobPost);
    }

    @Test
    void deleteJobPost_AccessDenied_ThrowsRuntimeException() {
        Employer differentEmployer = new Employer();
        differentEmployer.setId(999);

        JobPost notOwned = new JobPost();
        notOwned.setId(100);
        notOwned.setEmployerId(differentEmployer);

        when(employerRepository.findByUserId(employerUser)).thenReturn(Optional.of(employer));
        when(jobPostRepository.findById(100)).thenReturn(Optional.of(notOwned));

        assertThrows(RuntimeException.class, () -> jobPostService.deleteJobPost(employerUser, 100));
        verify(jobPostRepository, never()).delete(any(JobPost.class));
    }

    @Test
    void deleteJobPost_Success() {
        when(employerRepository.findByUserId(employerUser)).thenReturn(Optional.of(employer));
        when(jobPostRepository.findById(100)).thenReturn(Optional.of(jobPost));

        jobPostService.deleteJobPost(employerUser, 100);

        verify(jobPostRepository).delete(jobPost);
    }

    @Test
    void viewJobPost_IncrementsViewCount() {
        when(jobPostRepository.findById(100)).thenReturn(Optional.of(jobPost));
        when(modelMapper.map(jobPost, JobPostResponse.class)).thenReturn(new JobPostResponse());

        JobPostResponse response = jobPostService.viewJobPost(100, null);

        assertNotNull(response);
        assertEquals(6, jobPost.getViewCount());
        verify(jobPostRepository).save(jobPost);
    }
}
