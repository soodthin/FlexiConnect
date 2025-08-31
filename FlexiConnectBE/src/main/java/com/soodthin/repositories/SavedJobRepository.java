/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.SavedJob;
import com.soodthin.entity.SavedJobPK;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author ADMIN
 */
public interface SavedJobRepository extends JpaRepository<SavedJob, SavedJobPK> {

    List<SavedJob> findBySavedJobPK_CandidateId(Integer candidateId);
}
