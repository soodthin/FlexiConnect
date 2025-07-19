/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.soodthin.entity.Candidate;
import com.soodthin.entity.EducationHistory;
import com.soodthin.entity.User;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.EducationHistoryRepository;
import com.soodthin.services.EducationHistoryService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ADMIN
 */
@Service
public class EducationHistoryServiceImpl implements EducationHistoryService{
    @Autowired
    private EducationHistoryRepository educationHistoryRepository;
    @Autowired
    private CandidateRepository candidateRepository;

    public List<EducationHistory> getByCandidate(User user) {
        Candidate candidate = candidateRepository.findByUserId(user)
            .orElseThrow(() -> new RuntimeException("Candidate not found"));
        return educationHistoryRepository.findByCandidate(candidate);
    }

    public EducationHistory save(User user, EducationHistory edu) {
        Candidate candidate = candidateRepository.findByUserId(user)
            .orElseThrow(() -> new RuntimeException("Candidate not found"));
        edu.setCandidateId(candidate);
        return educationHistoryRepository.save(edu);
    }

    public void delete(Integer id) {
        educationHistoryRepository.deleteById(id);
    }
}
