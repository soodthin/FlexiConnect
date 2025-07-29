package com.soodthin.services.impl;

import com.soodthin.dto.response.WorkExperienceResponse;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.User;
import com.soodthin.entity.WorkExperience;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.WorkExperienceRepository;
import com.soodthin.services.WorkExperienceService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class WorkExperienceServiceImpl implements WorkExperienceService {

    @Autowired private CandidateRepository candidateRepository;
    @Autowired private WorkExperienceRepository workExperienceRepository;
    @Autowired private ModelMapper modelMapper;

    @Override
    public List<WorkExperienceResponse> getByCandidate(User user) {
        Candidate candidate = getCandidateByUser(user);
        return workExperienceRepository.findByCandidateId(candidate)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public WorkExperience save(User user, WorkExperience workExp) {
        Candidate candidate = getCandidateByUser(user);
        workExp.setCandidateId(candidate);
        return workExperienceRepository.save(workExp);
    }

    @Override
    public WorkExperience update(User user, Integer id, WorkExperience newData) {
        Candidate candidate = getCandidateByUser(user);

        WorkExperience existing = workExperienceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Work experience not found"));

        if (!existing.getCandidateId().getId().equals(candidate.getId())) {
            throw new IllegalArgumentException("Access denied");
        }

        // Update fields
        existing.setCompany(newData.getCompany());
        existing.setPosition(newData.getPosition());
        existing.setStartDate(newData.getStartDate());
        existing.setEndDate(newData.getEndDate());
        existing.setDescription(newData.getDescription());
        existing.setDescriptionAiSuggestion(newData.getDescriptionAiSuggestion());

        return workExperienceRepository.save(existing);
    }

    @Override
    public void delete(User user, Integer id) {
        Candidate candidate = getCandidateByUser(user);

        WorkExperience existing = workExperienceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Work experience not found"));

        if (!existing.getCandidateId().getId().equals(candidate.getId())) {
            throw new IllegalArgumentException("Access denied");
        }

        workExperienceRepository.delete(existing);
    }

    private Candidate getCandidateByUser(User user) {
        return candidateRepository.findByUserId(user)
                .orElseThrow(() -> new IllegalArgumentException("Candidate not found"));
    }

    private WorkExperienceResponse mapToResponse(WorkExperience exp) {
        return modelMapper.map(exp, WorkExperienceResponse.class);
    }
}
