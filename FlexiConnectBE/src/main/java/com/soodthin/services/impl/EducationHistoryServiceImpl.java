/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.soodthin.dto.response.EducationHistoryResponse;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.EducationHistory;
import com.soodthin.entity.User;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.EducationHistoryRepository;
import com.soodthin.services.EducationHistoryService;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ADMIN
 */
@Service
@Transactional
public class EducationHistoryServiceImpl implements EducationHistoryService {

    @Autowired
    private EducationHistoryRepository educationHistoryRepository;
    @Autowired
    private CandidateRepository candidateRepository;

    @Override
    public List<EducationHistoryResponse> getByCandidate(User user) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        return educationHistoryRepository.findByCandidate(candidate)
                .stream()
                .map(edu -> new EducationHistoryResponse(
                edu.getId(), edu.getSchool(), edu.getMajor(), edu.getDegree(),
                edu.getStartDate(), edu.getEndDate()
        ))
                .toList();
    }

    @Override
    public EducationHistory save(User user, EducationHistory edu) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        edu.setCandidate(candidate);
        return educationHistoryRepository.save(edu);
    }

    @Override
    public EducationHistory update(User user, Integer id, EducationHistory edu) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        EducationHistory existing = educationHistoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Education history not found"));

        if (!existing.getCandidate().getId().equals(candidate.getId())) {
            throw new RuntimeException("Access denied");
        }

        existing.setSchool(edu.getSchool());
        existing.setMajor(edu.getMajor());
        existing.setDegree(edu.getDegree());
        existing.setStartDate(edu.getStartDate());
        existing.setEndDate(edu.getEndDate());

        return educationHistoryRepository.save(existing);
    }

    @Override
    public void delete(Integer id) {
        educationHistoryRepository.deleteById(id);
    }
}
