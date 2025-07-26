package com.soodthin.services.impl;

import com.soodthin.dto.response.WorkExperienceResponse;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.User;
import com.soodthin.entity.WorkExperience;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.WorkExperienceRepository;
import com.soodthin.services.WorkExperienceService;
import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Transactional
@Service
public class WorkExperienceServiceImpl implements WorkExperienceService {

    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    private WorkExperienceRepository workExperienceRepository;

    @Override
    public List<WorkExperienceResponse> getByCandidate(User user) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));
        return workExperienceRepository.findByCandidateId(candidate)
                .stream()
                .map(e -> new WorkExperienceResponse(
                e.getId(),
                e.getCompany(),
                e.getPosition(),
                e.getDescription(),
                e.getStartDate(),
                e.getEndDate()
        ))
                .toList();
    }

    @Override
    public WorkExperience save(User user, WorkExperience workExp) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));
        workExp.setCandidateId(candidate);
        return workExperienceRepository.save(workExp);
    }

    @Override
    public WorkExperience update(User user, Integer id, WorkExperience workExp) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));

        WorkExperience existing = workExperienceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Work experience not found"));

        if (!existing.getCandidateId().getId().equals(candidate.getId())) {
            throw new IllegalArgumentException("Access denied");
        }

        existing.setCompany(workExp.getCompany());
        existing.setPosition(workExp.getPosition());
        existing.setStartDate(workExp.getStartDate());
        existing.setEndDate(workExp.getEndDate());
        existing.setDescription(workExp.getDescription());
        existing.setDescriptionAiSuggestion(workExp.getDescriptionAiSuggestion());

        return workExperienceRepository.save(existing);
    }

    @Override
    public void delete(User user, Integer id) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));

        WorkExperience existing = workExperienceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Work experience not found"));

        if (!existing.getCandidateId().getId().equals(candidate.getId())) {
            throw new IllegalArgumentException("Access denied");
        }

        workExperienceRepository.deleteById(id);
    }
}
