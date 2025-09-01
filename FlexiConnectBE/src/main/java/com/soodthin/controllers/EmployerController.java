/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.soodthin.dto.request.ApplicationReviewRequest;
import com.soodthin.dto.request.EmployerEmailRequest;
import com.soodthin.dto.request.EmployerProfileRequest;
import com.soodthin.dto.request.JobPostRequest;
import com.soodthin.dto.response.EmployerApplicationResponse;
import com.soodthin.dto.response.EmployerEmailLogResponse;
import com.soodthin.dto.response.EmployerProfileResponse;
import com.soodthin.dto.response.JobPostResponse;
import com.soodthin.dto.response.NotificationUserResponse;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.Notification;
import com.soodthin.entity.User;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.ApplicationService;
import com.soodthin.services.EmployerEmailLogService;
import com.soodthin.services.EmployerService;
import com.soodthin.services.JobPostService;
import com.soodthin.services.NotificationService;
import com.soodthin.services.NotificationUserService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author ADMIN
 */
@RestController
@RequestMapping("/api/users/employer")
public class EmployerController {

    @Autowired
    private EmployerService employerService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JobPostService jobPostService;

    @Autowired
    private ApplicationService applicationService;
    @Autowired
    private EmployerEmailLogService employerEmailLogService;
    @Autowired
    private NotificationUserService notificationUserService;

    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/profile")
    public ResponseEntity<EmployerProfileResponse> getProfile(Authentication authentication) {
        User user = getCurrentUser(authentication);
        EmployerProfileResponse response = employerService.getProfile(user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody EmployerProfileRequest request
    ) {
        User user = getCurrentUser(authentication);
        employerService.updateProfile(user, request);
        return ResponseEntity.ok("Cập nhật hồ sơ thành công!");
    }

    @PostMapping("/profile/avatar")
    public ResponseEntity<?> uploadAvatar(
            Authentication authentication,
            @RequestParam("avatar") MultipartFile avatar
    ) {
        User user = getCurrentUser(authentication);
        String url = employerService.updateAvatar(user, avatar);
        return ResponseEntity.ok("Cập nhật avatar thành công! URL: " + url);
    }

    @PostMapping("/job-post")
    public ResponseEntity<JobPost> createJobPost(
            Authentication authentication,
            @RequestBody JobPostRequest request
    ) {
        User user = getCurrentUser(authentication);
        JobPost jobPost = jobPostService.createJobPost(user, request);
        return ResponseEntity.ok(jobPost);
    }

    @GetMapping("/job-posts")
    public ResponseEntity<List<JobPostResponse>> getJobPostsByEmployer(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<JobPostResponse> jobPosts = jobPostService.getJobPostsByEmployer(user);
        return ResponseEntity.ok(jobPosts);
    }

    @PutMapping("/job-post/{id}")
    public ResponseEntity<JobPost> updateJobPost(
            Authentication authentication,
            @PathVariable Integer id,
            @RequestBody JobPostRequest request
    ) {
        User user = getCurrentUser(authentication);
        JobPost updated = jobPostService.updateJobPost(user, id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/job-post/{id}")
    public ResponseEntity<?> deleteJobPost(
            Authentication authentication,
            @PathVariable Integer id
    ) {
        User user = getCurrentUser(authentication);
        jobPostService.deleteJobPost(user, id);
        return ResponseEntity.ok("Xóa bài tuyển dụng thành công!");
    }

    @GetMapping("/applications")
    public ResponseEntity<List<EmployerApplicationResponse>> getAllApplicationsByEmployer(
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        List<EmployerApplicationResponse> responses = applicationService.getAllApplicationsByEmployer(user);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/applications/{applicationId}/review")
    public ResponseEntity<EmployerApplicationResponse> reviewApplication(
            @PathVariable Integer applicationId,
            @RequestBody ApplicationReviewRequest request,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        EmployerApplicationResponse response = applicationService.reviewApplication(applicationId, request, user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/email/send")
    public ResponseEntity<EmployerEmailLogResponse> sendEmail(
            Authentication authentication,
            @RequestBody EmployerEmailRequest request
    ) {
        User user = getCurrentUser(authentication);
        EmployerEmailLogResponse response = employerEmailLogService.sendEmailToCandidate(user, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("email/logs/{applicationId}")
    public ResponseEntity<List<EmployerEmailLogResponse>> getEmailLogsByApplication(
            @PathVariable Integer applicationId,
            Authentication authentication
    ) {
        User user = getCurrentUser(authentication);
        List<EmployerEmailLogResponse> responses
                = employerEmailLogService.getEmailLogsByApplication(user, applicationId);
        return ResponseEntity.ok(responses);
    }

  
}
