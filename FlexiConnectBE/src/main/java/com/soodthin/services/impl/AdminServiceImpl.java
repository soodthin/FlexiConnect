/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.soodthin.dto.EmployerDTO;
import com.soodthin.dto.JobPostStatsDTO;
import com.soodthin.dto.UserRegistrationStatsDTO;
import com.soodthin.dto.response.AdminDashboardResponse;
import com.soodthin.dto.response.EmployerVerificationResponse;
import com.soodthin.dto.response.UserManagementResponse;
import com.soodthin.dto.request.UserStatusUpdateRequest;
import com.soodthin.dto.request.EmployerVerificationRequest;
import com.soodthin.dto.request.NotificationRequest;
import com.soodthin.dto.response.JobPostAdminResponse;
import com.soodthin.entity.Employer;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.JobPost.JobStatus;
import com.soodthin.entity.Notification;
import com.soodthin.entity.Role;
import com.soodthin.entity.User;
import com.soodthin.entity.User.UserStatus;
import com.soodthin.repositories.ApplicationRepository;
import com.soodthin.repositories.EmployerRepository;
import com.soodthin.repositories.JobPostRepository;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.AdminService;
import com.soodthin.services.NotificationService;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.Comparator;
import java.util.HashMap;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;

/**
 *
 * @author ADMIN
 */
@Slf4j
@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private JobPostRepository jobPostRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private NotificationService notificationService;

    @Override
    public List<EmployerDTO> getAllEmployers() {
        return employerRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public EmployerDTO verifyEmployer(Integer id) {
        Employer employer = employerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        employer.setIsVerified(true);
        employer.setReasonReject(null);
        employerRepository.save(employer);

        NotificationRequest notifRequest = new NotificationRequest();
        notifRequest.setUserId(employer.getUserId().getId());
        notifRequest.setTitle("Tài khoản nhà tuyển dụng đã được xác minh");
        notifRequest.setContent("Chúc mừng! Tài khoản của bạn đã được admin xác minh thành công.");
        notifRequest.setType(Notification.NotificationType.SYSTEM_MESSAGE);
        notifRequest.setLinkTo("/employer-profile"); 

        notificationService.createNotification(notifRequest); 

        return toDTO(employer);
    }

    @Override
    public EmployerDTO rejectEmployer(Integer id, String reason) {
        Employer employer = employerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        employer.setIsVerified(false);
        employer.setReasonReject(reason);
        employerRepository.save(employer);

        NotificationRequest notifRequest = new NotificationRequest();
        notifRequest.setUserId(employer.getUserId().getId());
        notifRequest.setTitle("Tài khoản nhà tuyển dụng bị từ chối");
        notifRequest.setContent("Rất tiếc! Tài khoản của bạn bị từ chối xác minh. Lý do: " + reason);
        notifRequest.setType(Notification.NotificationType.SYSTEM_MESSAGE);
        notifRequest.setLinkTo("/employer-profile");

        notificationService.createNotification(notifRequest);

        return toDTO(employer);
    }

    private EmployerDTO toDTO(Employer employer) {
        return EmployerDTO.builder()
                .id(employer.getId())
                .companyName(employer.getCompanyName())
                .taxCode(employer.getTaxCode())
                .website(employer.getWebsite())
                .companyAddress(employer.getCompanyAddress())
                .companyIntro(employer.getCompanyIntro())
                .isVerified(employer.getIsVerified())
                .reasonReject(employer.getReasonReject())
                .build();
    }

    @Override
    public AdminDashboardResponse getDashboardStats(int year) {
        log.info(String.format("Fetching admin dashboard statistics for year {}", year));

        try {
            Long totalUsers = userRepository.count();
            Long totalCandidates = userRepository.countByRoleSet_RoleName("CANDIDATE");
            Long totalEmployers = userRepository.countByRoleSet_RoleName("EMPLOYER");
            Long totalJobPosts = jobPostRepository.count();
            Long totalApplications = applicationRepository.count();
            Long activeJobs = jobPostRepository.countByStatus(JobPost.JobStatus.OPEN);
            Long pendingVerifications = employerRepository.countByIsVerified(false);
            Long bannedUsers = userRepository.countByStatus(UserStatus.BANNED);
            Long deletedUsers=userRepository.countByStatus(UserStatus.DELETED);

            LocalDateTime startOfYear = LocalDate.of(year, 1, 1).atStartOfDay();
            LocalDateTime endOfYear = LocalDate.of(year, 12, 31).atTime(23, 59, 59);

            List<User> usersThisYear = userRepository.findByCreatedAtBetween(startOfYear, endOfYear);
            List<UserRegistrationStatsDTO> userRegistrationStats = calculateUserRegistrationStats(usersThisYear);

            List<JobPost> jobPostsThisYear = jobPostRepository.findByCreatedAtBetween(startOfYear, endOfYear);
            List<JobPostStatsDTO> jobPostStats = calculateJobPostStats(jobPostsThisYear);

            return AdminDashboardResponse.builder()
                    .totalUsers(totalUsers)
                    .totalCandidates(totalCandidates)
                    .totalEmployers(totalEmployers)
                    .totalJobPosts(totalJobPosts)
                    .totalApplications(totalApplications)
                    .activeJobs(activeJobs)
                    .pendingEmployerVerifications(pendingVerifications)
                    .bannedUsers(bannedUsers)
                    .deletedUsers(deletedUsers)
                    .userRegistrationStats(userRegistrationStats)
                    .jobPostStats(jobPostStats)
                    .build();

        } catch (Exception e) {
            log.error("Error fetching dashboard stats", e);
            throw new RuntimeException("Failed to fetch dashboard statistics");
        }
    }

    @Override
    public Page<UserManagementResponse> getUsers(String role, String search, int page, int size) {
        log.info(String.format("Fetching users - role: %s, search: %s, page: %d, size: %d", role, search, page, size));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users;

        boolean hasRole = role != null && !role.isBlank();
        boolean hasSearch = search != null && !search.isBlank();

        if (hasRole && hasSearch) {
            Page<User> usersByName = userRepository
                    .findByRoleSet_RoleNameAndFullNameContainingIgnoreCaseOrderByCreatedAtDesc(
                            role.toUpperCase(), search, pageable);
            Page<User> usersByEmail = userRepository
                    .findByRoleSet_RoleNameAndEmailContainingIgnoreCaseOrderByCreatedAtDesc(
                            role.toUpperCase(), search, pageable);

            users = usersByName.hasContent() ? usersByName : usersByEmail;

        } else if (hasRole) {
            users = userRepository.findByRoleSet_RoleNameOrderByCreatedAtDesc(role.toUpperCase(), pageable);

        } else if (hasSearch) {
            users = userRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByCreatedAtDesc(
                    search, search, pageable);

        } else {
            users = userRepository.findAll(pageable);
        }

        return users.map(this::convertToUserManagementResponse);
    }

    @Override
    public Page<EmployerVerificationResponse> getPendingEmployerVerifications(int page, int size) {
        log.info(String.format("Fetching pending employer verifications - page: {}, size: {}", page, size));

        Pageable pageable = PageRequest.of(page, size);
        Page<Employer> employers = employerRepository.findByIsVerified(false, pageable);

        return employers.map(employer -> modelMapper.map(employer, EmployerVerificationResponse.class));
    }

    @Override
    public Page<EmployerVerificationResponse> getEmployers(Boolean verified, String search, int page, int size) {
        log.info(String.format("Fetching employers - verified: {}, search: {}, page: {}, size: {}", verified, search, page, size));

        Pageable pageable = PageRequest.of(page, size, Sort.by("userId.createdAt").descending());
        Page<Employer> employers;

        if (verified != null && search != null && !search.isEmpty()) {
            // Both verified and search filters
            Page<Employer> employersByCompany = employerRepository
                    .findByIsVerifiedAndCompanyNameContainingIgnoreCase(verified, search, pageable);
            Page<Employer> employersByUser = employerRepository
                    .findByIsVerifiedAndUserId_FullNameContainingIgnoreCase(verified, search, pageable);

            employers = employersByCompany.hasContent() ? employersByCompany : employersByUser;

        } else if (verified != null) {
            // Only verified filter
            employers = employerRepository.findByIsVerified(verified, pageable);

        } else if (search != null && !search.isEmpty()) {
            // Only search filter
            Page<Employer> employersByCompany = employerRepository
                    .findByCompanyNameContainingIgnoreCase(search, pageable);
            Page<Employer> employersByUser = employerRepository
                    .findByUserId_FullNameContainingIgnoreCase(search, pageable);

            employers = employersByCompany.hasContent() ? employersByCompany : employersByUser;

        } else {
            // No filters
            employers = employerRepository.findAll(pageable);
        }

        return employers.map(employer -> modelMapper.map(employer, EmployerVerificationResponse.class));
    }

    @Override
    public UserManagementResponse updateUserStatus(Integer userId, UserStatusUpdateRequest request) {
        log.info(String.format("Updating user status - userId: %d, status: %s", userId, request.getStatus()));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserStatus oldStatus = user.getStatus(); 

        UserStatus newStatus;
        try {
            newStatus = UserStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new RuntimeException("Invalid user status: " + request.getStatus());
        }

        user.setStatus(newStatus);
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        log.info(String.format(
                "User status updated - userId: %d, oldStatus: %s, newStatus: %s, reason: %s",
                userId, oldStatus.name(), newStatus.name(), request.getReason()));

        return convertToUserManagementResponse(savedUser);
    }

    @Override
    public EmployerVerificationResponse updateEmployerVerification(Integer employerId, EmployerVerificationRequest request) {
        log.info(String.format("Updating employer verification - employerId: {}, verified: {}", employerId, request.getIsVerified()));

        Employer employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        Boolean oldStatus = employer.getIsVerified();
        employer.setIsVerified(request.getIsVerified());

        Employer savedEmployer = employerRepository.save(employer);

        log.info(String.format("Employer verification updated - employerId: {}, oldStatus: {}, newStatus: {}, reason: {}",
                employerId, oldStatus, request.getIsVerified(), request.getReason()));

        return modelMapper.map(savedEmployer, EmployerVerificationResponse.class);
    }

    @Override
public void deleteUser(Integer userId) {
    log.info("Deleting user - userId: {}", userId);

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // chỉ cập nhật trạng thái thay vì xóa hẳn
    user.setStatus(UserStatus.DELETED); 
    userRepository.save(user);

    log.info("User marked as DELETED - userId: {}", userId);
}


    @Override
    public Page<JobPostAdminResponse> getJobPosts(String status, String search, int page, int size) {
        log.info(String.format("Fetching job posts - status: %s, search: %s, page: %d, size: %d",
                status, search, page, size));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<JobPost> jobPosts;

        boolean hasStatus = status != null && !status.isBlank();
        boolean hasSearch = search != null && !search.isBlank();

        if (hasStatus && hasSearch) {
            // search theo title hoặc company name khi có status
            Page<JobPost> postsByTitle = jobPostRepository
                    .findByStatusAndTitleContainingIgnoreCaseOrderByCreatedAtDesc(
                            JobPost.JobStatus.valueOf(status.toUpperCase()), search, pageable);

            Page<JobPost> postsByCompany = jobPostRepository
                    .findByStatusAndEmployerCompanyNameContainingIgnoreCaseOrderByCreatedAtDesc(
                            JobPost.JobStatus.valueOf(status.toUpperCase()), search, pageable);

            jobPosts = postsByTitle.hasContent() ? postsByTitle : postsByCompany;

        } else if (hasStatus) {
            jobPosts = jobPostRepository.findByStatusOrderByCreatedAtDesc(
                    JobPost.JobStatus.valueOf(status.toUpperCase()), pageable);

        } else if (hasSearch) {
            // search theo title hoặc company name khi không có status
            Page<JobPost> postsByTitle = jobPostRepository
                    .findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(search, pageable);
            Page<JobPost> postsByCompany = jobPostRepository
                    .findByEmployerCompanyNameContainingIgnoreCaseOrderByCreatedAtDesc(search, pageable);

            jobPosts = postsByTitle.hasContent() ? postsByTitle : postsByCompany;

        } else {
            jobPosts = jobPostRepository.findAll(pageable);
        }

        return jobPosts.map(job -> new JobPostAdminResponse(
                job.getId(),
                job.getTitle(),
                job.getDescription(),
                job.getLocation(),
                job.getStatus(),
                job.getEmployerId() != null ? job.getEmployerId().getCompanyName() : "Unknown",
                job.getCreatedAt()
        ));
    }

    @Override
    public JobPostAdminResponse updateJobPostStatus(Integer id, JobStatus newStatus) {
        JobPost jobPost = jobPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job post not found"));

        jobPost.setStatus(newStatus);
        jobPostRepository.save(jobPost);

        return new JobPostAdminResponse(
                jobPost.getId(),
                jobPost.getTitle(),
                jobPost.getDescription(),
                jobPost.getLocation(),
                jobPost.getStatus(),
                jobPost.getEmployerId() != null ? jobPost.getEmployerId().getCompanyName() : "Unknown",
                jobPost.getCreatedAt()
        );
    }

    private UserManagementResponse convertToUserManagementResponse(User user) {
        UserManagementResponse response = modelMapper.map(user, UserManagementResponse.class);

        // Map roles
        Set<String> roleNames = user.getRoleSet().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toSet());
        response.setRoles(roleNames);

        // Map employer specific fields
        if (user.getEmployer() != null) {
            response.setCompanyName(user.getEmployer().getCompanyName());
            response.setIsVerified(user.getEmployer().getIsVerified());
        }

        return response;
    }

    private List<UserRegistrationStatsDTO> calculateUserRegistrationStats(List<User> users) {
        Map<LocalDate, UserRegistrationStatsDTO> statsMap = new HashMap<>();

        for (User user : users) {
            LocalDate date = user.getCreatedAt().toLocalDate();

            boolean isCandidate = user.getRoleSet().stream()
                    .anyMatch(role -> role.getRoleName().equals("CANDIDATE"));
            boolean isEmployer = user.getRoleSet().stream()
                    .anyMatch(role -> role.getRoleName().equals("EMPLOYER"));

            statsMap.putIfAbsent(date, UserRegistrationStatsDTO.builder()
                    .date(date.toString())
                    .candidate(0)
                    .employer(0)
                    .build());

            UserRegistrationStatsDTO stat = statsMap.get(date);
            if (isCandidate) {
                stat.setCandidate(stat.getCandidate() + 1);
            }
            if (isEmployer) {
                stat.setEmployer(stat.getEmployer() + 1);
            }
        }

        // Sắp xếp theo ngày tăng dần
        return statsMap.values().stream()
                .sorted(Comparator.comparing(UserRegistrationStatsDTO::getDate))
                .collect(Collectors.toList());
    }

    private List<JobPostStatsDTO> calculateJobPostStats(List<JobPost> jobPosts) {
        Map<LocalDate, Long> statsMap = jobPosts.stream()
                .collect(Collectors.groupingBy(
                        job -> job.getCreatedAt().toLocalDate(),
                        Collectors.counting()));

        return statsMap.entrySet().stream()
                .map(entry -> JobPostStatsDTO.builder()
                .date(entry.getKey().toString())
                .count(entry.getValue())
                .build())
                .sorted(Comparator.comparing(JobPostStatsDTO::getDate))
                .collect(Collectors.toList());
    }
}
