/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.soodthin.entity.User;
import com.soodthin.entity.WorkExperience;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.WorkExperienceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author ADMIN
 */
@RestController
@RequestMapping("/api/candidate")
public class WorkExperienceController {

    @Autowired
    private WorkExperienceService workExperienceService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/workexperience")
    public ResponseEntity<?> list(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(workExperienceService.getByCandidate(user));
    }

    @PostMapping("/workexperience")
    public ResponseEntity<?> add(Authentication auth, @RequestBody WorkExperience workExp) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(workExperienceService.save(user, workExp));
    }

    @PutMapping("/workexperience/{id}")
    public ResponseEntity<?> update(Authentication auth, @PathVariable Integer id, @RequestBody WorkExperience workExp) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(workExperienceService.update(user, id, workExp));
    }

    @DeleteMapping("/workexperience/{id}")
    public ResponseEntity<?> delete(Authentication auth, @PathVariable Integer id) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        workExperienceService.delete(user, id);
        return ResponseEntity.ok().build();
    }
}
