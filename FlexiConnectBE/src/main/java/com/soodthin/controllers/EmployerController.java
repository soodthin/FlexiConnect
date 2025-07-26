/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.soodthin.dto.request.EmployerProfileRequest;
import com.soodthin.dto.response.EmployerProfileResponse;
import com.soodthin.entity.User;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.EmployerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
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
}
