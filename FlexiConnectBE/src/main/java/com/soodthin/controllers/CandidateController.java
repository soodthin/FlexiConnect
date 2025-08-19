/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.soodthin.dto.request.CandidateProfileRequest;
import com.soodthin.dto.request.CvSuggestionRequest;
import com.soodthin.dto.request.CvSuggestionSubmitRequest;

import com.soodthin.dto.response.ApplicationResponseDTO;
import com.soodthin.dto.response.CandidateProfileResponse;

import com.soodthin.entity.CvSuggestion;
import com.soodthin.entity.User;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.ApplicationService;
import com.soodthin.services.CandidateService;
import com.soodthin.services.CvSuggestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author ADMIN
 */
@RestController
@RequestMapping("/api/users/candidate")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ApplicationService applicationService;
    @Autowired
    private CvSuggestionService cvSuggestionService;


    @GetMapping("/profile")
    public ResponseEntity<CandidateProfileResponse> getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        CandidateProfileResponse response = candidateService.getProfile(user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody CandidateProfileRequest request
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        candidateService.updateProfile(user, request);
        return ResponseEntity.ok("Cập nhật hồ sơ thành công!");
    }

    @PostMapping("/profile/avatar")
    public ResponseEntity<?> uploadAvatar(
            Authentication authentication,
            @RequestParam("avatar") MultipartFile avatar
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        String url = candidateService.updateAvatar(user, avatar);
        return ResponseEntity.ok("Cập nhật avatar thành công! URL: " + url);
    }

    @PostMapping(value = "/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApplicationResponseDTO> applyToJob(
            @RequestParam("jobPostId") Integer jobPostId,
            @RequestParam("resumeFile") MultipartFile resumeFile,
            Authentication auth) {

        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ApplicationResponseDTO response = applicationService.applyToJob(jobPostId, resumeFile, user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cv-suggestion")
    public ResponseEntity<CvSuggestion> createSuggestion(
            Authentication authentication,
            @RequestBody CvSuggestionRequest request) {

        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Integer candidateId = user.getCandidate().getId();

        CvSuggestion suggestion = cvSuggestionService.createSuggestion(candidateId, request);
        return ResponseEntity.ok(suggestion);
    }

    @PostMapping("/cv-suggestion/submit")
    public ResponseEntity<CvSuggestion> submitSuggestion(
            @RequestParam("suggestionId") Integer suggestionId,
            @RequestBody CvSuggestionSubmitRequest request) {

        CvSuggestion updated = cvSuggestionService.submitSuggestion(suggestionId, request);
        return ResponseEntity.ok(updated);
    }

}
