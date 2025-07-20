package com.soodthin.services.impl;

import com.soodthin.dto.request.SkillRequest;
import com.soodthin.dto.response.SkillResponse;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.CandidateSkill;
import com.soodthin.entity.Skill;
import com.soodthin.entity.User;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.CandidateSkillRepository;
import com.soodthin.repositories.SkillRepository;
import com.soodthin.services.CandidateSkillService;
import jakarta.transaction.Transactional;
import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class CandidateSkillServiceImpl implements CandidateSkillService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private CandidateSkillRepository candidateSkillRepository;

    @Override
    public void addSkill(User user, SkillRequest request) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin ứng viên cho user ID: " + user.getId()));

        Skill skill = skillRepository.findBySkillNameIgnoreCase(request.getSkillName())
                .orElseGet(() -> {
                    Skill newSkill = new Skill();
                    newSkill.setSkillName(request.getSkillName());
                    return skillRepository.save(newSkill);
                });

        CandidateSkill candidateSkill = new CandidateSkill();
        candidateSkill.setCandidateId(candidate);
        candidateSkill.setSkillId(skill);
        candidateSkill.setLevel(request.getLevel());
        candidateSkillRepository.save(candidateSkill);
    }

    @Override
    public void updateSkill(Integer skillId, SkillRequest req, User user) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        CandidateSkill cs = candidateSkillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (!cs.getCandidateId().equals(candidate)) {
            throw new RuntimeException("Unauthorized");
        }

        Skill skill = cs.getSkillId();
        skill.setSkillName(req.getSkillName()); // ⬅️ Cập nhật bảng `skill`
        skillRepository.save(skill);           // ⬅️ Lưu cập nhật

        cs.setLevel(req.getLevel());
        candidateSkillRepository.save(cs);
    }

    @Override
    public void deleteSkill(Integer skillId, User user) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        CandidateSkill cs = candidateSkillRepository.findById(skillId)
                .orElseThrow(() -> new RuntimeException("Skill not found"));

        if (!cs.getCandidateId().equals(candidate)) {
            throw new RuntimeException("Unauthorized");
        }

        Skill skill = cs.getSkillId();
        candidateSkillRepository.delete(cs); // Xoá liên kết

        // Nếu không ai khác dùng thì xóa luôn skill
        if (candidateSkillRepository.countBySkillId(skill) == 0) {
            skillRepository.delete(skill);
        }
    }

    @Override
    public List<SkillResponse> getSkills(User user) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        List<CandidateSkill> candidateSkills = candidateSkillRepository.findByCandidate(candidate);

        return candidateSkills.stream()
                .map(cs -> new SkillResponse(
                cs.getId(),
                cs.getSkillId().getId(),
                cs.getSkillId().getSkillName(),
                cs.getLevel()
        ))
                .collect(Collectors.toList());
    }
}
