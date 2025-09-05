/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.soodthin.dto.FollowEmployerDTO;
import com.soodthin.dto.request.CandidateProfileRequest;
import com.soodthin.dto.request.AI.CvSuggestionRequest;
import com.soodthin.dto.request.AI.CvSuggestionSubmitRequest;
import com.soodthin.dto.request.FollowEmployerRequest;
import com.soodthin.dto.request.SavedJobRequest;

import com.soodthin.dto.response.CandidateApplicationResponse;
import com.soodthin.dto.response.CandidateProfileResponse;
import com.soodthin.dto.response.SavedJobResponse;
import com.soodthin.entity.CvSuggestion;
import com.soodthin.entity.User;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.ApplicationService;
import com.soodthin.services.CandidateService;
import com.soodthin.services.CvSuggestionService;
import com.soodthin.services.FollowEmployerService;
import com.soodthin.services.NotificationUserService;
import com.soodthin.services.SavedJobService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
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
    @Autowired
    private FollowEmployerService followEmployerService;
    @Autowired
    private SavedJobService savedJobService;
    @Autowired
    private NotificationUserService notificationUserService;

    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/profile")
    public ResponseEntity<CandidateProfileResponse> getProfile(Authentication authentication) {
        User user = getCurrentUser(authentication);

        CandidateProfileResponse response = candidateService.getProfile(user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody CandidateProfileRequest request
    ) {
        User user = getCurrentUser(authentication);

        candidateService.updateProfile(user, request);
        return ResponseEntity.ok("Cập nhật hồ sơ thành công!");
    }

    @PostMapping("/profile/avatar")
    public ResponseEntity<?> uploadAvatar(
            Authentication authentication,
            @RequestParam("avatar") MultipartFile avatar
    ) {
        User user = getCurrentUser(authentication);

        String url = candidateService.updateAvatar(user, avatar);
        return ResponseEntity.ok("Cập nhật avatar thành công! URL: " + url);
    }

    @PostMapping(value = "/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CandidateApplicationResponse> applyToJob(
            @RequestParam("jobPostId") Integer jobPostId,
            @RequestParam("resumeFile") MultipartFile resumeFile,
            Authentication authentication) {

        User user = getCurrentUser(authentication);

        CandidateApplicationResponse response = applicationService.applyToJob(jobPostId, resumeFile, user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cv-suggestion")
    public ResponseEntity<CvSuggestion> createSuggestion(
            Authentication authentication,
            @RequestBody CvSuggestionRequest request) {

        User user = getCurrentUser(authentication);

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

    @GetMapping("/applied")
    public ResponseEntity<List<CandidateApplicationResponse>> getMyApplications(Authentication authentication) {
        User user = getCurrentUser(authentication);

        List<CandidateApplicationResponse> responses = applicationService.getAppliedJobs(user);

        return ResponseEntity.ok(responses);
    }

    @PostMapping("/follow-employer/follow")
    public FollowEmployerDTO followEmployer(@RequestBody FollowEmployerRequest request,
            Authentication authentication) {
        User user = getCurrentUser(authentication);
        Integer candidateId = user.getCandidate().getId();
        return followEmployerService.follow(candidateId, request.getEmployerId());
    }

    @DeleteMapping("/follow-employer/unfollow")
    public void unfollowEmployer(@RequestBody FollowEmployerRequest request,
            Authentication authentication) {
        User user = getCurrentUser(authentication);
        Integer candidateId = user.getCandidate().getId();
        followEmployerService.unfollow(candidateId, request.getEmployerId());
    }

    @PatchMapping("/follow-employer/notify")
    public void toggleNotifyEmployer(@RequestBody FollowEmployerRequest request,
            Authentication authentication) {
        User user = getCurrentUser(authentication);
        Integer candidateId = user.getCandidate().getId();
        followEmployerService.toggleNotify(candidateId, request.getEmployerId(), request.getNotifyJob());
    }

    @PostMapping("/saved-job/save")
    public ResponseEntity<String> saveJob(
            @RequestBody SavedJobRequest request,
            Authentication authentication) {

        User user = getCurrentUser(authentication);
        Integer candidateId = user.getCandidate().getId();

        savedJobService.saveJobPost(candidateId, request.getJobPostId());
        return ResponseEntity.ok("Đã lưu job!");
    }

    @DeleteMapping("/saved-job/unsave")
    public ResponseEntity<String> unsaveJob(
            @RequestBody SavedJobRequest request,
            Authentication authentication) {

        User user = getCurrentUser(authentication);
        Integer candidateId = user.getCandidate().getId();

        savedJobService.unsaveJobPost(candidateId, request.getJobPostId());
        return ResponseEntity.ok("Đã bỏ lưu job!");
    }

    @GetMapping("/saved-job")
    public ResponseEntity<List<SavedJobResponse>> getSavedJobs(Authentication authentication) {
        User user = getCurrentUser(authentication);
        Integer candidateId = user.getCandidate().getId();

        List<SavedJobResponse> savedJobs = savedJobService.getSavedJobs(candidateId);
        return ResponseEntity.ok(savedJobs);
    }

}
