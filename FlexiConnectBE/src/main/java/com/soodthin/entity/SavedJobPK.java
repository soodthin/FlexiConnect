/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.entity;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;

/**
 *
 * @author ADMIN
 */
@Embeddable
public class SavedJobPK implements Serializable {

    @Basic(optional = false)
    @NotNull
    @Column(name = "candidate_id")
    private int candidateId;
    @Basic(optional = false)
    @NotNull
    @Column(name = "job_post_id")
    private int jobPostId;

    public SavedJobPK() {
    }

    public SavedJobPK(int candidateId, int jobPostId) {
        this.candidateId = candidateId;
        this.jobPostId = jobPostId;
    }

    public int getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(int candidateId) {
        this.candidateId = candidateId;
    }

    public int getJobPostId() {
        return jobPostId;
    }

    public void setJobPostId(int jobPostId) {
        this.jobPostId = jobPostId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (int) candidateId;
        hash += (int) jobPostId;
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof SavedJobPK)) {
            return false;
        }
        SavedJobPK other = (SavedJobPK) object;
        if (this.candidateId != other.candidateId) {
            return false;
        }
        if (this.jobPostId != other.jobPostId) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.pojo.SavedJobPK[ candidateId=" + candidateId + ", jobPostId=" + jobPostId + " ]";
    }
    
}
