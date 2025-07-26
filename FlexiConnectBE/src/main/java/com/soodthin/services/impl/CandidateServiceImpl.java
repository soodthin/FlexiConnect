/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.soodthin.dto.request.CandidateProfileRequest;
import com.soodthin.dto.response.CandidateProfileResponse;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.User;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.CandidateService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 *
 * @author ADMIN
 */
@Service
@Transactional
public class CandidateServiceImpl implements CandidateService{
     
    @Autowired
    private CandidateRepository candidateRepository;

        @Override
    public CandidateProfileResponse getProfile(User user) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ ứng viên!"));

        CandidateProfileResponse response = new CandidateProfileResponse();
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhone());
        response.setAddress(user.getAddress());
        response.setAvatarUrl(user.getAvatar());

        response.setTitle(candidate.getTitle());
        response.setBio(candidate.getBio());
        response.setBioAiSuggestion(candidate.getBioAiSuggestion());
        response.setResumeFile(candidate.getResumeFile());

        return response;
    }

    @Override
    public void updateProfile(User user, CandidateProfileRequest request) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ ứng viên!"));

        candidate.setTitle(request.getTitle());
        candidate.setBio(request.getBio());
        candidate.setResumeFile(request.getResumeFile());

        candidateRepository.save(candidate);
    }

}
    