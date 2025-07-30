/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response;

import com.soodthin.entity.Candidate;
import java.time.LocalDateTime;

/**
 *
 * @author ADMIN
 */
public class ApplicationResponseDTO {
     private Integer id;
    private Integer jobPostId;
    private String jobPostTitle;
    private Integer candidateId;
    private String candidateName;
    private String coverLetter;
    private String resumeFile;
    private String status;
    private LocalDateTime appliedAt;

    /**
     * @return the id
     */
    public Integer getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * @return the jobPostId
     */
    public Integer getJobPostId() {
        return jobPostId;
    }

    /**
     * @param jobPostId the jobPostId to set
     */
    public void setJobPostId(Integer jobPostId) {
        this.jobPostId = jobPostId;
    }

    /**
     * @return the jobPostTitle
     */
    public String getJobPostTitle() {
        return jobPostTitle;
    }

    /**
     * @param jobPostTitle the jobPostTitle to set
     */
    public void setJobPostTitle(String jobPostTitle) {
        this.jobPostTitle = jobPostTitle;
    }

    /**
     * @return the candidateId
     */
    public Integer getCandidateId() {
        return candidateId;
    }

    /**
     * @param candidateId the candidateId to set
     */
    public void setCandidateId(Integer candidateId) {
        this.candidateId = candidateId;
    }

    /**
     * @return the candidateName
     */
    public String getCandidateName() {
        return candidateName;
    }

    /**
     * @param candidateName the candidateName to set
     */
    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    /**
     * @return the coverLetter
     */
    public String getCoverLetter() {
        return coverLetter;
    }

    /**
     * @param coverLetter the coverLetter to set
     */
    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    /**
     * @return the status
     */
    public String getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * @return the appliedAt
     */
    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    /**
     * @param appliedAt the appliedAt to set
     */
    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    /**
     * @return the resumeFile
     */
    public String getResumeFile() {
        return resumeFile;
    }

    /**
     * @param resumeFile the resumeFile to set
     */
    public void setResumeFile(String resumeFile) {
        this.resumeFile = resumeFile;
    }

}
