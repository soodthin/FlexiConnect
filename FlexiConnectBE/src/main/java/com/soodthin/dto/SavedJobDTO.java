/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto;

import com.soodthin.entity.Employer;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.SavedJob;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author ADMIN
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SavedJobDTO {

    private Integer candidateId;
    private Integer jobPostId;
    private LocalDateTime savedAt;

    private String jobTitle;
    private String jobDescription;
    private String jobLocation;
    private String jobType;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String companyName;
    private LocalDateTime jobExpiredAt;
    private JobPost.JobStatus jobStatus;

    public SavedJobDTO(SavedJob sj) {
        JobPost job = sj.getJobPost();
        Employer employer = job.getEmployerId();

        this.candidateId = sj.getSavedJobPK().getCandidateId();
        this.jobPostId = job.getId();
        this.savedAt = sj.getSavedAt();
        this.jobTitle = job.getTitle();
        this.jobDescription = job.getDescription();
        this.jobLocation = job.getLocation();
        this.jobType = job.getJobType();
        this.salaryMin = job.getSalaryMin();
        this.salaryMax = job.getSalaryMax();
        this.companyName = employer != null ? employer.getCompanyName() : null;
        this.jobExpiredAt = job.getExpiredAt();
        this.jobStatus = job.getStatus();
    }

}
