/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.request.SkillRequest;
import com.soodthin.dto.response.SkillResponse;
import com.soodthin.entity.CandidateSkill;
import com.soodthin.entity.User;
import java.util.List;

/**
 *
 * @author ADMIN
 */
public interface CandidateSkillService {
void addSkill(User user, SkillRequest request);
   void updateSkill(Integer skillId, SkillRequest req, User user);
  void deleteSkill(Integer skillId, User user);
    List<SkillResponse> getSkills(User user);
}
