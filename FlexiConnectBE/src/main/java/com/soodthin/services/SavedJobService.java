/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.response.SavedJobResponse;
import java.util.List;

/**
 *
 * @author ADMIN
 */
public interface SavedJobService {

    void saveJobPost(Integer candidateId, Integer jobPostId);

    void unsaveJobPost(Integer candidateId, Integer jobPostId);

  List<SavedJobResponse> getSavedJobs(Integer candidateId);
}
