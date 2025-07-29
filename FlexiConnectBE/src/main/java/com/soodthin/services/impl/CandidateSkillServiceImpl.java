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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CandidateSkillServiceImpl implements CandidateSkillService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private CandidateSkillRepository candidateSkillRepository;

    private Candidate getCandidate(User user) {
        return candidateRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy thông tin ứng viên!"));
    }

    @Override
    public void addSkill(User user, SkillRequest request) {
        Candidate candidate = getCandidate(user);

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
    public void updateSkill(Integer skillId, SkillRequest request, User user) {
        Candidate candidate = getCandidate(user);

        CandidateSkill cs = candidateSkillRepository.findById(skillId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy kỹ năng!"));

        if (!cs.getCandidateId().getId().equals(candidate.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền chỉnh sửa kỹ năng này!");
        }

        Skill skill = cs.getSkillId();
        skill.setSkillName(request.getSkillName());
        skillRepository.save(skill);

        cs.setLevel(request.getLevel());
        candidateSkillRepository.save(cs);
    }

    @Override
    public void deleteSkill(Integer skillId, User user) {
        Candidate candidate = getCandidate(user);

        CandidateSkill cs = candidateSkillRepository.findById(skillId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy kỹ năng!"));

        if (!cs.getCandidateId().getId().equals(candidate.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền xoá kỹ năng này!");
        }

        Skill skill = cs.getSkillId();
        candidateSkillRepository.delete(cs);

        if (candidateSkillRepository.countBySkillId(skill) == 0) {
            skillRepository.delete(skill);
        }
    }

    @Override
    public List<SkillResponse> getSkills(User user) {
        Candidate candidate = getCandidate(user);

        return candidateSkillRepository.findByCandidate(candidate).stream()
                .map(cs -> new SkillResponse(
                cs.getId(),
                cs.getSkillId().getId(),
                cs.getSkillId().getSkillName(),
                cs.getLevel()))
                .collect(Collectors.toList());
    }
}
