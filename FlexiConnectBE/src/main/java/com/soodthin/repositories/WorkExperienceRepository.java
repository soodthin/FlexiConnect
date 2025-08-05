/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.Candidate;
import com.soodthin.entity.WorkExperience;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author ADMIN
 */
public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Integer> {
    List<WorkExperience> findByCandidateId(Candidate candidate);
    Optional<WorkExperience> findById(Integer id);
        void deleteByCandidate(Candidate candidate);

}