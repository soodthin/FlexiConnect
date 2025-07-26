/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.soodthin.dto.JobPostDTO;
import com.soodthin.entity.JobPost;
import com.soodthin.repositories.JobPostRepository;
import com.soodthin.services.JobPostService;
/**
 *
 * @author ADMIN
 */import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class JobPostServiceImpl implements JobPostService {

    @Autowired
    private JobPostRepository jobPostRepository;

    @Override
    public List<JobPostDTO> getAllPublicJobPosts() {
        List<JobPost> jobPosts = (List<JobPost>) jobPostRepository.findByStatus("OPEN");

        return jobPosts.stream().map(job -> {
            JobPostDTO dto = new JobPostDTO();
            dto.setId(job.getId());
            dto.setTitle(job.getTitle());
            dto.setDescription(truncate(job.getDescription(), 200));
            dto.setLocation(job.getLocation());
            dto.setSalaryMin(job.getSalaryMin());
            dto.setSalaryMax(job.getSalaryMax());
            dto.setJobType(job.getJobType());
            dto.setExpiredAt(job.getExpiredAt());
            dto.setViewCount(job.getViewCount());
            dto.setCreatedAt(job.getCreatedAt());

            if (job.getEmployerId()!= null) {
                dto.setCompanyName(job.getEmployerId().getCompanyName());
            } else {
                dto.setCompanyName("Không rõ công ty");
            }

            return dto;
        }).collect(Collectors.toList());
    }

    private String truncate(String text, int maxLength) {
        if (text == null || text.length() <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    }
}


