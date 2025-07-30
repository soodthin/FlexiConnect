/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.Application;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author ADMIN
 */
public interface ApplicationRepository extends JpaRepository<Application, Integer> {

    boolean existsByCandidateAndJobPost(Candidate candidate, JobPost jobPost);

}
