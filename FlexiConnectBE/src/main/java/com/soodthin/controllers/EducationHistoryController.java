/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.soodthin.entity.EducationHistory;
import com.soodthin.entity.User;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.EducationHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ADMIN
 */
@RestController
@RequestMapping("/api/users/candidate")
public class EducationHistoryController {

    @Autowired
    private EducationHistoryService educationHistoryService;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/education")
    public ResponseEntity<?> list(Authentication auth) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(educationHistoryService.getByCandidate(user));
    }

    @PostMapping("/education")
    public ResponseEntity<?> add(Authentication auth, @RequestBody EducationHistory edu) {
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(educationHistoryService.save(user, edu));
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        educationHistoryService.delete(id);
        return ResponseEntity.ok().build();
    }

}
