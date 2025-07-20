/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.soodthin.dto.request.CandidateProfileRequest;
import com.soodthin.dto.response.CandidateProfileResponse;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.User;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ADMIN
 */
@RestController
@RequestMapping("/api/users/candidate")
public class CandidateController {

    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ ứng viên!"));

        CandidateProfileResponse resp = new CandidateProfileResponse();
        resp.setFullName(user.getFullName());
        resp.setEmail(user.getEmail());
        resp.setPhoneNumber(user.getPhone());
        resp.setAddress(user.getAddress());
        resp.setAvatarUrl(user.getAvatar());

        resp.setTitle(candidate.getTitle());
        resp.setBio(candidate.getBio());
        resp.setBioAiSuggestion(candidate.getBioAiSuggestion());
        resp.setResumeFile(candidate.getResumeFile());

        return ResponseEntity.ok(resp);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody CandidateProfileRequest req) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ ứng viên!"));

        candidate.setTitle(req.getTitle());
        candidate.setBio(req.getBio());
        candidate.setResumeFile(req.getResumeFile());

        candidateRepository.save(candidate);
        return ResponseEntity.ok().build();
    }

}
