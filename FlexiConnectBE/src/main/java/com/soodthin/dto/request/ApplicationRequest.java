/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.request;

/**
 *
 * @author ADMIN
 */
public class ApplicationRequest {

    private Integer jobPostId;
    private String coverLetter;
    private String resumeFile;

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
