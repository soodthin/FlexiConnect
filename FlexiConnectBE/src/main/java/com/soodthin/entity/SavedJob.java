/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

/**
 *
 * @author ADMIN
 */
@Entity
@Table(name = "saved_job")
@NamedQueries({
    @NamedQuery(name = "SavedJob.findAll", query = "SELECT s FROM SavedJob s"),
    @NamedQuery(name = "SavedJob.findByCandidateId", query = "SELECT s FROM SavedJob s WHERE s.savedJobPK.candidateId = :candidateId"),
    @NamedQuery(name = "SavedJob.findByJobPostId", query = "SELECT s FROM SavedJob s WHERE s.savedJobPK.jobPostId = :jobPostId"),
    @NamedQuery(name = "SavedJob.findBySavedAt", query = "SELECT s FROM SavedJob s WHERE s.savedAt = :savedAt")})
public class SavedJob implements Serializable {

    private static final long serialVersionUID = 1L;
    @EmbeddedId
    protected SavedJobPK savedJobPK;
    @Column(name = "saved_at")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime savedAt;
    @JoinColumn(name = "candidate_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ManyToOne(optional = false)
    @JsonIgnore
    private Candidate candidate;
    @JoinColumn(name = "job_post_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ManyToOne(optional = false)
    @JsonIgnore
    private JobPost jobPost;

    public SavedJob() {
    }

    public SavedJob(SavedJobPK savedJobPK) {
        this.savedJobPK = savedJobPK;
    }

    public SavedJob(int candidateId, int jobPostId) {
        this.savedJobPK = new SavedJobPK(candidateId, jobPostId);
    }

    public SavedJobPK getSavedJobPK() {
        return savedJobPK;
    }

    public void setSavedJobPK(SavedJobPK savedJobPK) {
        this.savedJobPK = savedJobPK;
    }

    public LocalDateTime getSavedAt() {
        return savedAt;
    }

    public void setSavedAt(LocalDateTime savedAt) {
        this.savedAt = savedAt;
    }

    public Candidate getCandidate() {
        return candidate;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }

    public JobPost getJobPost() {
        return jobPost;
    }

    public void setJobPost(JobPost jobPost) {
        this.jobPost = jobPost;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (savedJobPK != null ? savedJobPK.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof SavedJob)) {
            return false;
        }
        SavedJob other = (SavedJob) object;
        if ((this.savedJobPK == null && other.savedJobPK != null) || (this.savedJobPK != null && !this.savedJobPK.equals(other.savedJobPK))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.pojo.SavedJob[ savedJobPK=" + savedJobPK + " ]";
    }
    
}
