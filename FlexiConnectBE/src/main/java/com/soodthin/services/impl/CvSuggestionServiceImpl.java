/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.soodthin.dto.request.CvSuggestionRequest;
import com.soodthin.dto.request.CvSuggestionSubmitRequest;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.CandidateSkill;
import com.soodthin.entity.CvSuggestion;
import static com.soodthin.entity.CvSuggestion.SectionType.EXPERIENCE;
import static com.soodthin.entity.CvSuggestion.SectionType.INTRODUCTION;
import static com.soodthin.entity.CvSuggestion.SectionType.SKILLS;
import com.soodthin.entity.Skill;
import com.soodthin.entity.WorkExperience;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.CandidateSkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.soodthin.repositories.CvSuggestionRepository;
import com.soodthin.repositories.SkillRepository;
import com.soodthin.repositories.WorkExperienceRepository;
import com.soodthin.services.AiIntegrationService;
import com.soodthin.services.CvSuggestionService;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author ADMIN
 */
@Service
public class CvSuggestionServiceImpl implements CvSuggestionService {

    @Autowired
    private CandidateRepository candidateRepo;
    @Autowired
    private CvSuggestionRepository suggestionRepo;
    @Autowired
    private AiIntegrationService aiService;
    @Autowired
    private WorkExperienceRepository workExpRepo;
    @Autowired
    private CandidateSkillRepository candSkillRepo;
    @Autowired
    private SkillRepository skillRepo;

    @Override
    public CvSuggestion createSuggestion(Integer candidateId, CvSuggestionRequest request) {
        Candidate candidate = candidateRepo.findById(candidateId)
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found"));

        String suggestion = aiService.getSuggestionFromAI(
                request.getOriginalInput(),
                request.getSection().name()
        );

        CvSuggestion suggestionEntity = new CvSuggestion();
        suggestionEntity.setCandidateId(candidate);
        suggestionEntity.setOriginalInput(request.getOriginalInput());
        suggestionEntity.setAiSuggestion(suggestion);
        suggestionEntity.setSection(request.getSection());
        suggestionEntity.setStatus(CvSuggestion.SuggestionStatus.SUGGESTED);
        suggestionEntity.setCreatedAt(LocalDateTime.now());
        suggestionEntity.setUpdatedAt(LocalDateTime.now());

        return suggestionRepo.save(suggestionEntity);
    }

    @Override
    public CvSuggestion submitSuggestion(Integer suggestionId, CvSuggestionSubmitRequest request) {
        CvSuggestion suggestion = suggestionRepo.findById(suggestionId)
                .orElseThrow(() -> new EntityNotFoundException("Suggestion not found"));

        suggestion.setEditedVersion(request.getEditedVersion());
        suggestion.setStatus(CvSuggestion.SuggestionStatus.SUBMITTED);
        suggestion.setUpdatedAt(LocalDateTime.now());
        suggestionRepo.save(suggestion);

        Candidate candidate = suggestion.getCandidateId();

        switch (suggestion.getSection()) {
            case INTRODUCTION:
                candidate.setBio(request.getEditedVersion());
                candidateRepo.save(candidate);
                break;

            case SKILLS:
                List<CandidateSkill> skills = parseSkills(candidate, request.getEditedVersion());
                candSkillRepo.deleteByCandidate(candidate); 
                candSkillRepo.saveAll(skills);
                break;

            case EXPERIENCE:
                List<WorkExperience> experiences = parseExperience(candidate, request.getEditedVersion());
                workExpRepo.deleteByCandidate(candidate); 
                workExpRepo.saveAll(experiences);
                break;

        }

        return suggestion;
    }

    private List<CandidateSkill> parseSkills(Candidate candidate, String editedVersion) {
        List<CandidateSkill> result = new ArrayList<>();
        String[] skillPairs = editedVersion.split(",");

        for (String pair : skillPairs) {
            String[] parts = pair.trim().split("\\s*\\(([^)]+)\\)\\s*");
            if (parts.length >= 1) {
                String skillName = parts[0].trim();
                String level = (parts.length > 1) ? parts[1].trim() : "Basic";

                Skill skill = skillRepo.findBySkillNameIgnoreCase(skillName)
                        .orElseGet(() -> {
                            Skill newSkill = new Skill();
                            newSkill.setSkillName(skillName);
                            return skillRepo.save(newSkill);
                        });

                CandidateSkill cs = new CandidateSkill();
                cs.setCandidateId(candidate);
                cs.setSkillId(skill);
                cs.setLevel(level);
                result.add(cs);
            }
        }
        return result;
    }

    private List<WorkExperience> parseExperience(Candidate candidate, String editedVersion) {
        List<WorkExperience> result = new ArrayList<>();

        if (editedVersion == null || editedVersion.isBlank()) {
            return result;
        }

        String[] entries = editedVersion.split("\\n"); // Mỗi dòng là một kinh nghiệm

        for (String entry : entries) {
            String[] parts = entry.split(":", 2);
            if (parts.length < 2) {
                continue;
            }

            String header = parts[0].trim();         // Ví dụ: "Software Engineer at ABC Corp (2020-2022)"
            String description = parts[1].trim();    // Ví dụ: "Developed backend APIs."

            String[] headerParts = header.split(" at ");
            if (headerParts.length != 2) {
                continue;
            }

            String position = headerParts[0].trim(); // Software Engineer
            String companyWithTime = headerParts[1].trim(); // ABC Corp (2020-2022)

            String company = companyWithTime.replaceAll("\\(.*?\\)", "").trim(); // Bỏ đoạn (2020-2022)

            String timeRange = companyWithTime.replaceAll(".*\\(", "").replaceAll("\\)", "").trim(); // 2020-2022
            String[] years = timeRange.split("-");

            LocalDate startDate;
            LocalDate endDate = null;

            try {
                int startYear = Integer.parseInt(years[0].trim());
                startDate = LocalDate.of(startYear, 1, 1);

                if (years.length > 1 && !years[1].trim().isEmpty()) {
                    int endYear = Integer.parseInt(years[1].trim());
                    endDate = LocalDate.of(endYear, 1, 1);
                }
            } catch (NumberFormatException e) {
                continue;
            }

            WorkExperience we = new WorkExperience();
            we.setCandidate(candidate);
            we.setCompany(company);
            we.setPosition(position);
            we.setStartDate(startDate);
            we.setEndDate(endDate);
            we.setDescription(description);

            result.add(we);
        }

        return result;
    }

}
