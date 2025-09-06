/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.soodthin.dto.SavedJobDTO;
import com.soodthin.dto.request.SavedJobRequest;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.SavedJob;
import com.soodthin.entity.User;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.SavedJobService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 *
 * @author ADMIN
 */
@RestController
@RequestMapping("/api/users/candidate/saved-jobs")
public class SavedJobController {

    @Autowired
    private SavedJobService savedJobService;

    @Autowired
    private UserRepository userRepository;

    private Integer getCandidateId(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getCandidate().getId();
    }

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleSaveJobPost(@RequestBody SavedJobRequest request, Authentication authentication) {
        try {
            Integer candidateId = getCandidateId(authentication);
            boolean isSaved = savedJobService.toggleSaveJobPost(candidateId, request.getJobPostId());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "isSaved", isSaved,
                    "message", isSaved ? "Job đã được lưu!" : "Đã bỏ lưu job!"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @DeleteMapping("/unsave")
    public ResponseEntity<?> unsaveJobPost(@RequestBody SavedJobRequest request, Authentication authentication) {
        try {
            Integer candidateId = getCandidateId(authentication);
            savedJobService.unsaveJobPost(candidateId, request.getJobPostId());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã bỏ lưu job thành công!"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/check")
    public ResponseEntity<?> checkJobSaved(@RequestBody SavedJobRequest request, Authentication authentication) {
        try {
            Integer candidateId = getCandidateId(authentication);
            boolean isSaved = savedJobService.isJobSaved(candidateId, request.getJobPostId());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "isSaved", isSaved
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getSavedJobs(Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Integer candidateId = getCandidateId(authentication);
            List<SavedJobDTO> savedJobs = savedJobService.getSavedJobsByCandidate(candidateId);

            int fromIndex = page * size;
            int toIndex = Math.min(fromIndex + size, savedJobs.size());
            List<SavedJobDTO> paginatedJobs = savedJobs.subList(fromIndex, toIndex);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", paginatedJobs,
                    "totalElements", savedJobs.size(),
                    "totalPages", (int) Math.ceil((double) savedJobs.size() / size),
                    "currentPage", page
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/jobs")
    public ResponseEntity<?> getSavedJobPosts(Authentication authentication) {
        try {
            Integer candidateId = getCandidateId(authentication);
            List<SavedJobDTO> savedJobDTOs = savedJobService.getSavedJobsByCandidate(candidateId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", savedJobDTOs,
                    "total", savedJobDTOs.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> countSavedJobs(Authentication authentication) {
        try {
            Integer candidateId = getCandidateId(authentication);
            long count = savedJobService.countSavedJobsByCandidate(candidateId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "count", count
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

}
