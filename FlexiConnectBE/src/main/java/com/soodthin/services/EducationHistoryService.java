/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.entity.EducationHistory;
import com.soodthin.entity.User;
import java.util.List;

/**
 *
 * @author ADMIN
 */
public interface EducationHistoryService {
    List<EducationHistory> getByCandidate(User user);
    EducationHistory save(User user, EducationHistory edu);
    void delete(Integer id);
}
