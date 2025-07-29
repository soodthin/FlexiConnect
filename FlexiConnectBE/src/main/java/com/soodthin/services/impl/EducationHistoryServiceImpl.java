package com.soodthin.services.impl;

import com.soodthin.dto.response.EducationHistoryResponse;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.EducationHistory;
import com.soodthin.entity.User;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.EducationHistoryRepository;
import com.soodthin.services.EducationHistoryService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class EducationHistoryServiceImpl implements EducationHistoryService {

    @Autowired
    private EducationHistoryRepository educationHistoryRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Override
    public List<EducationHistoryResponse> getByCandidate(User user) {
        Candidate candidate = getCandidateOrThrow(user);
        return educationHistoryRepository.findByCandidate(candidate)
                .stream()
                .map(e -> new EducationHistoryResponse(
                        e.getId(), e.getSchool(), e.getMajor(),
                        e.getDegree(), e.getStartDate(), e.getEndDate()))
                .toList();
    }

    @Override
    public EducationHistory save(User user, EducationHistory edu) {
        Candidate candidate = getCandidateOrThrow(user);
        edu.setCandidate(candidate);
        return educationHistoryRepository.save(edu);
    }

    @Override
    public EducationHistory update(User user, Integer id, EducationHistory edu) {
        Candidate candidate = getCandidateOrThrow(user);

        EducationHistory existing = educationHistoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy học vấn"));

        if (!existing.getCandidate().getId().equals(candidate.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền sửa học vấn này");
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
        if (!educationHistoryRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy học vấn để xóa");
        }
        educationHistoryRepository.deleteById(id);
    }

    private Candidate getCandidateOrThrow(User user) {
        return candidateRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy ứng viên"));
    }
}
