/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.Candidate;
import com.soodthin.entity.CvSuggestion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author ADMIN
 */
public interface CvSuggestionRepository extends JpaRepository<CvSuggestion, Integer> {

    List<CvSuggestion> findByCandidateIdAndSection(Candidate candidate, CvSuggestion.SectionType section);
}
