/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.Employer;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.JobPost.JobStatus;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author ADMIN
 */
public interface JobPostRepository extends JpaRepository<JobPost, Integer> {

    List<JobPost> findByStatus(JobStatus status);

    List<JobPost> findByEmployer(Employer employer);

    // Count methods
    Long countByStatus(JobPost.JobStatus status);

    // Statistics
    List<JobPost> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

}
