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
import com.soodthin.services.CandidateService;
import com.soodthin.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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
}
