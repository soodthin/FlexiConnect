package com.soodthin.controllers;

import com.soodthin.dto.request.SkillRequest;
import com.soodthin.dto.response.SkillResponse;
import com.soodthin.entity.User;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.CandidateSkillService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/candidate/skills")
public class SkillController {

    @Autowired
    private CandidateSkillService candidateSkillService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // email được set khi tạo JWT
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<String> addSkill(@RequestBody SkillRequest request) {
        User user = getCurrentUser();
        candidateSkillService.addSkill(user, request);
        return ResponseEntity.ok("Skill added successfully");
    }
    
@PutMapping("/{id}")
    public ResponseEntity<String> updateSkill(
            @PathVariable("id") Integer id,
            @RequestBody SkillRequest request) {
        User user = getCurrentUser();
        candidateSkillService.updateSkill(id, request, user);
        return ResponseEntity.ok("Skill updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSkill(@PathVariable("id") Integer id) {
        User user = getCurrentUser();
        candidateSkillService.deleteSkill(id, user);
        return ResponseEntity.ok("Skill deleted successfully");
    }
   

    @GetMapping
    public ResponseEntity<List<SkillResponse>> getSkills() {
        User user = getCurrentUser();
        List<SkillResponse> skills = candidateSkillService.getSkills(user);
        return ResponseEntity.ok(skills);
    }
}
