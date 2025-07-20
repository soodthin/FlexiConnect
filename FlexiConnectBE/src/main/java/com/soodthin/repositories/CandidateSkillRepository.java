/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.Candidate;
import com.soodthin.entity.CandidateSkill;
import com.soodthin.entity.Skill;
import com.soodthin.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author ADMIN
 */
public interface CandidateSkillRepository extends JpaRepository<CandidateSkill, Integer> {
    List<CandidateSkill> findByCandidate(Candidate candidate);
Optional<CandidateSkill> findById(Long id);
long countBySkillId(Skill skillId);

}
