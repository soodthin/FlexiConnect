/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.soodthin.dto.response.JobPostResponse;
import com.soodthin.dto.response.SavedJobResponse;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.SavedJob;
import com.soodthin.entity.SavedJobPK;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.JobPostRepository;
import com.soodthin.repositories.SavedJobRepository;
import com.soodthin.services.SavedJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

/**
 *
 * @author ADMIN
 */
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
@Service
public class SavedJobServiceImpl implements SavedJobService {

    @Autowired
    private SavedJobRepository savedJobRepository;
    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    private JobPostRepository jobPostRepository;

    
    @Override
    public void saveJobPost(Integer candidateId, Integer jobPostId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new RuntimeException("JobPost not found"));

        SavedJobPK pk = new SavedJobPK(candidateId, jobPostId);

        if (savedJobRepository.existsById(pk)) {
            throw new RuntimeException("Job already saved");
        }

        SavedJob savedJob = new SavedJob();
        savedJob.setSavedJobPK(pk);
        savedJob.setCandidate(candidate);
        savedJob.setJobPost(jobPost);
        savedJob.setSavedAt(new Date());

        savedJobRepository.save(savedJob);
    }

    @Override
    public void unsaveJobPost(Integer candidateId, Integer jobPostId) {
        SavedJobPK pk = new SavedJobPK(candidateId, jobPostId);

        if (!savedJobRepository.existsById(pk)) {
            throw new RuntimeException("Saved job not found");
        }

        savedJobRepository.deleteById(pk);
    }

    @Override
    public List<SavedJobResponse> getSavedJobs(Integer candidateId) {
        List<SavedJob> savedJobs = savedJobRepository.findBySavedJobPK_CandidateId(candidateId);

        return savedJobs.stream().map(savedJob -> {
            JobPost job = savedJob.getJobPost();
            return SavedJobResponse.builder()
                    .jobPostId(job.getId())
                    .title(job.getTitle())
                    .companyName(job.getEmployerId().getCompanyName())
                    .avatar(job.getEmployerId().getUserId().getAvatar())
                    .location(job.getLocation())
                    .salaryMin(job.getSalaryMin() != null ? job.getSalaryMin().intValue() : null)
                    .salaryMax(job.getSalaryMax() != null ? job.getSalaryMax().intValue() : null)
                    .jobType(job.getJobType() != null ? job.getJobType() : null)
                    .isSaved(true)
                    .build();
        }).toList();

    }

}
