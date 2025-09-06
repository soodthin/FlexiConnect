package com.soodthin.services.impl;

import com.soodthin.dto.SavedJobDTO;
import com.soodthin.entity.SavedJob;
import com.soodthin.entity.SavedJobPK;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.JobPost;
import com.soodthin.repositories.SavedJobRepository;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.JobPostRepository;
import com.soodthin.services.SavedJobService;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class SavedJobServiceImpl implements SavedJobService {

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobPostRepository jobPostRepository;

    @Override
    public SavedJob saveJobPost(Integer candidateId, Integer jobPostId) {
        // Kiểm tra candidate và job post có tồn tại không
        Optional<Candidate> candidateOpt = candidateRepository.findById(candidateId);
        Optional<JobPost> jobPostOpt = jobPostRepository.findById(jobPostId);

        if (!candidateOpt.isPresent()) {
            throw new RuntimeException("Candidate không tồn tại với ID: " + candidateId);
        }

        if (!jobPostOpt.isPresent()) {
            throw new RuntimeException("Job Post không tồn tại với ID: " + jobPostId);
        }

        // Kiểm tra đã save chưa
        SavedJobPK savedJobPK = new SavedJobPK(candidateId, jobPostId);
        Optional<SavedJob> existingSavedJob = savedJobRepository.findById(savedJobPK);

        if (existingSavedJob.isPresent()) {
            throw new RuntimeException("Job post đã được save trước đó!");
        }

        // Tạo saved job mới
        SavedJob savedJob = new SavedJob();
        savedJob.setSavedJobPK(savedJobPK);
        savedJob.setCandidate(candidateOpt.get());
        savedJob.setJobPost(jobPostOpt.get());
        savedJob.setSavedAt(LocalDateTime.now());

        return savedJobRepository.save(savedJob);
    }

    @Override
    public void unsaveJobPost(Integer candidateId, Integer jobPostId) {
        SavedJobPK savedJobPK = new SavedJobPK(candidateId, jobPostId);
        Optional<SavedJob> savedJobOpt = savedJobRepository.findById(savedJobPK);

        if (!savedJobOpt.isPresent()) {
            throw new RuntimeException("Job post chưa được save!");
        }

        savedJobRepository.delete(savedJobOpt.get());
    }

    @Override
    public boolean isJobSaved(Integer candidateId, Integer jobPostId) {
        SavedJobPK savedJobPK = new SavedJobPK(candidateId, jobPostId);
        return savedJobRepository.existsById(savedJobPK);
    }

    @Override
    public List<SavedJobDTO> getSavedJobsByCandidate(Integer candidateId) {
        List<SavedJob> savedJobs = savedJobRepository
                .findBySavedJobPK_CandidateIdOrderBySavedAtDesc(candidateId);

        return savedJobs.stream()
                .map(SavedJobDTO::new) 
                .collect(Collectors.toList());
    }

    @Override
    public long countSavedJobsByCandidate(Integer candidateId) {
        return savedJobRepository.countBySavedJobPK_CandidateId(candidateId);
    }

    @Override
    public boolean toggleSaveJobPost(Integer candidateId, Integer jobPostId) {
        if (isJobSaved(candidateId, jobPostId)) {
            unsaveJobPost(candidateId, jobPostId);
            return false; // unsaved
        } else {
            saveJobPost(candidateId, jobPostId);
            return true; // saved
        }
    }
}
