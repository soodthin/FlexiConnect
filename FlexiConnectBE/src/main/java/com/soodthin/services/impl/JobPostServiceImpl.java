package com.soodthin.services.impl;

import com.soodthin.dto.request.JobPostRequest;
import com.soodthin.dto.request.NotificationRequest;
import com.soodthin.dto.response.JobPostResponse;
import com.soodthin.dto.response.NotificationUserResponse;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.Employer;
import com.soodthin.entity.FollowEmployer;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.Notification;
import com.soodthin.entity.User;
import com.soodthin.repositories.EmployerRepository;
import com.soodthin.repositories.FollowEmployerRepository;
import com.soodthin.repositories.JobPostRepository;
import com.soodthin.services.JobPostService;
import com.soodthin.services.NotificationService;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Service
@Transactional
public class JobPostServiceImpl implements JobPostService {

    @Autowired
    private JobPostRepository jobPostRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private FollowEmployerRepository followEmployerRepository;
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Override
    public JobPost createJobPost(User user, JobPostRequest request) {
        Employer employer = employerRepository.findByUserId(user)
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        JobPost jobPost = modelMapper.map(request, JobPost.class);
        jobPost.setEmployerId(employer);
        jobPost.setCreatedAt(LocalDateTime.now());
        jobPost.setViewCount(0);

        if (request.getStatus() == null || request.getStatus().isBlank()) {
            jobPost.setStatus(JobPost.JobStatus.OPEN);
        } else {
            try {
                jobPost.setStatus(JobPost.JobStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid job status: " + request.getStatus());
            }
        }

        JobPost savedJobPost = jobPostRepository.save(jobPost);

        List<FollowEmployer> followers = followEmployerRepository
                .findByFollowEmployerPK_EmployerIdAndNotifyJobTrue(employer.getId());

        for (FollowEmployer follow : followers) {
            Candidate candidate = follow.getCandidate();
            User candidateUser = candidate.getUserId();

            // Tạo request notification
            NotificationRequest notifRequest = new NotificationRequest();
            notifRequest.setUserId(candidateUser.getId());
            notifRequest.setTitle("Nhà tuyển dụng vừa đăng tuyển dụng mới");
            notifRequest.setContent("Nhà tuyển dụng " + employer.getCompanyName()
                    + " vừa đăng tin tuyển dụng mới: " + savedJobPost.getTitle());
            notifRequest.setType(Notification.NotificationType.JOB_NEW);
            notifRequest.setLinkTo("/job-posts/" + savedJobPost.getId());

            NotificationUserResponse response = notificationService.createNotification(notifRequest);

            simpMessagingTemplate.convertAndSendToUser(
                    candidateUser.getId().toString(),
                    "/queue/notifications",
                    response
            );

        }

        return savedJobPost;
    }

    @Override
    public List<JobPostResponse> getJobPostsByEmployer(User user) {
        Employer employer = employerRepository.findByUserId(user)
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        return jobPostRepository.findByEmployer(employer).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public JobPost updateJobPost(User user, Integer id, JobPostRequest request) {
        Employer employer = employerRepository.findByUserId(user)
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job post not found"));

        if (!jobPost.getEmployerId().getId().equals(employer.getId())) {
            throw new RuntimeException("Access denied");
        }

        int currentViewCount = jobPost.getViewCount() == null ? 0 : jobPost.getViewCount();
        modelMapper.map(request, jobPost);
        jobPost.setViewCount(currentViewCount);

        // Xử lý enum JobStatus
        if (request.getStatus() == null || request.getStatus().isBlank()) {
            jobPost.setStatus(JobPost.JobStatus.OPEN);
        } else {
            try {
                jobPost.setStatus(JobPost.JobStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid job status: " + request.getStatus());
            }
        }

        return jobPostRepository.save(jobPost);
    }

    @Override
    public void deleteJobPost(User user, Integer id) {
        Employer employer = employerRepository.findByUserId(user)
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job post not found"));

        if (!jobPost.getEmployerId().getId().equals(employer.getId())) {
            throw new RuntimeException("Access denied");
        }

        jobPostRepository.delete(jobPost);
    }

    @Override
    public List<JobPostResponse> getAllPublicJobPosts() {
        return jobPostRepository.findByStatus(JobPost.JobStatus.OPEN).stream()
                .map(job -> {
                    JobPostResponse dto = mapToResponse(job);
                    dto.setDescription(truncate(job.getDescription(), 200));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public JobPostResponse viewJobPost(Integer jobPostId, Integer candidateId) {
        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new RuntimeException("Job post not found"));

        jobPost.setViewCount(jobPost.getViewCount() + 1);
        jobPostRepository.save(jobPost);

        JobPostResponse dto = mapToResponse(jobPost);

        // Initialize default values
        dto.setIsFollowed(false);
        dto.setNotifyJob(false);

        if (candidateId != null) {
            System.out.println("🔍 Checking follow status: candidateId=" + candidateId
                    + ", employerId=" + jobPost.getEmployerId().getId());

            Optional<FollowEmployer> followRecord = followEmployerRepository
                    .findByCandidateIdAndEmployerId(candidateId, jobPost.getEmployerId().getId());

            if (followRecord.isPresent()) {
                FollowEmployer fe = followRecord.get();
                dto.setIsFollowed(true);
                dto.setNotifyJob(fe.getNotifyJob());
                System.out.println("🔍 Found follow record: isFollowed=true, notifyJob=" + fe.getNotifyJob());
            } else {
                System.out.println("🔍 No follow record found - user not following this employer");
            }
        } else {
            System.out.println("🔍 No candidateId provided - anonymous user");
        }

        System.out.println("🔍 Final response: isFollowed=" + dto.getIsFollowed()
                + ", notifyJob=" + dto.getNotifyJob());

        return dto;
    }

    private JobPostResponse mapToResponse(JobPost job) {
        JobPostResponse dto = modelMapper.map(job, JobPostResponse.class);
        if (job.getEmployerId() != null) {
            Employer employer = job.getEmployerId();

            dto.setCompanyName(
                    employer.getCompanyName() != null ? employer.getCompanyName() : "Không rõ công ty"
            );

            dto.setWebsite(employer.getWebsite());
            dto.setCompanyAddress(employer.getCompanyAddress());

            if (employer.getUserId() != null) {
                dto.setAvatar(employer.getUserId().getAvatar());
            }
        } else {
            dto.setCompanyName("Không rõ công ty");
        }
        return dto;
    }

    private String truncate(String text, int maxLength) {
        if (text == null || text.length() <= maxLength) {
            return text;
        }
        return text.substring(0, maxLength) + "...";
    }
}
