/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

/**
 *
 * @author ADMIN
 */
import com.soodthin.dto.response.JobPostResponse;
import com.soodthin.entity.User;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.JobPostService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/job-posts")
public class JobPostController {

    @Autowired
    private JobPostService jobPostService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<JobPostResponse> getAllPublicJobPosts() {
        return jobPostService.getAllPublicJobPosts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobPostResponse> getJobPost(@PathVariable Integer id, Authentication authentication) {
        Integer candidateId = null;

        if (authentication != null && authentication.isAuthenticated()) {
            String userEmail = authentication.getName();


            User currentUser = userRepository.findByEmail(userEmail).orElse(null);

            if (currentUser != null && currentUser.getCandidate() != null) {
                candidateId = currentUser.getCandidate().getId();
                System.out.println("✅ Successfully found candidateId: " + candidateId + " for user: " + userEmail);
            } else {
                System.out.println("ℹ️ User " + userEmail + " is authenticated but not a candidate or not found in DB.");
            }
        } else {
            System.out.println(" Request is from an anonymous user.");
        }

        // Gọi service với candidateId (có thể là null nếu là khách hoặc không phải candidate)
        JobPostResponse response = jobPostService.viewJobPost(id, candidateId);
        return ResponseEntity.ok(response);
    }
}
