/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.soodthin.dto.request.ApplicationReviewRequest;
import com.soodthin.dto.request.EmployerProfileRequest;
import com.soodthin.dto.request.JobPostRequest;
import com.soodthin.dto.response.ApplicationResponseDTO;
import com.soodthin.dto.response.EmployerProfileResponse;
import com.soodthin.dto.response.JobPostResponse;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.User;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.ApplicationService;
import com.soodthin.services.EmployerService;
import com.soodthin.services.JobPostService;
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

    @GetMapping("/profile")
    public ResponseEntity<EmployerProfileResponse> getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        EmployerProfileResponse response = employerService.getProfile(user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody EmployerProfileRequest request
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        employerService.updateProfile(user, request);
        return ResponseEntity.ok("Cập nhật hồ sơ thành công!");
    }

    @PostMapping("/profile/avatar")
    public ResponseEntity<?> uploadAvatar(
            Authentication authentication,
            @RequestParam("avatar") MultipartFile avatar
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        String url = employerService.updateAvatar(user, avatar);
        return ResponseEntity.ok("Cập nhật avatar thành công! URL: " + url);
    }

    @PostMapping("/job-post")
    public ResponseEntity<JobPost> createJobPost(
            Authentication authentication,
            @RequestBody JobPostRequest request
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        JobPost jobPost = jobPostService.createJobPost(user, request);
        return ResponseEntity.ok(jobPost);
    }

    @GetMapping("/job-posts")
    public ResponseEntity<List<JobPostResponse>> getJobPostsByEmployer(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        List<JobPostResponse> jobPosts = jobPostService.getJobPostsByEmployer(user);
        return ResponseEntity.ok(jobPosts);
    }

    @PutMapping("/job-post/{id}")
    public ResponseEntity<JobPost> updateJobPost(
            Authentication authentication,
            @PathVariable Integer id,
            @RequestBody JobPostRequest request
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        JobPost updated = jobPostService.updateJobPost(user, id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/job-post/{id}")
    public ResponseEntity<?> deleteJobPost(
            Authentication authentication,
            @PathVariable Integer id
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        jobPostService.deleteJobPost(user, id);
        return ResponseEntity.ok("Xóa bài tuyển dụng thành công!");
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponseDTO>> getAllApplicationsByEmployer(
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ApplicationResponseDTO> responses = applicationService.getAllApplicationsByEmployer(user);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/applications/{applicationId}/review")
    public ResponseEntity<ApplicationResponseDTO> reviewApplication(
            @PathVariable Integer applicationId,
            @RequestBody ApplicationReviewRequest request,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ApplicationResponseDTO response = applicationService.reviewApplication(applicationId, request, currentUser);
        return ResponseEntity.ok(response);
    }

}
