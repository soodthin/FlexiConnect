/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.SavedJobDTO;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.SavedJob;
import java.util.List;

/**
 *
 * @author ADMIN
 */
public interface SavedJobService {

    SavedJob saveJobPost(Integer candidateId, Integer jobPostId);

    void unsaveJobPost(Integer candidateId, Integer jobPostId);

    boolean isJobSaved(Integer candidateId, Integer jobPostId);

    List<SavedJobDTO> getSavedJobsByCandidate(Integer candidateId);

    long countSavedJobsByCandidate(Integer candidateId);

    boolean toggleSaveJobPost(Integer candidateId, Integer jobPostId);
}
