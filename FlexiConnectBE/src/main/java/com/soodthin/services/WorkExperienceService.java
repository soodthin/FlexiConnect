/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.response.WorkExperienceResponse;
import com.soodthin.entity.User;
import com.soodthin.entity.WorkExperience;
import java.util.List;

/**
 *
 * @author ADMIN
 */
public interface WorkExperienceService {

   List<WorkExperienceResponse> getByCandidate(User user);

    WorkExperience save(User user, WorkExperience workExp);

    WorkExperience update(User user, Integer id, WorkExperience workExp);

    void delete(User user, Integer id);
}
