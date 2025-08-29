/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.entity;

import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

/**
 *
 * @author ADMIN
 */
@Entity
@Table(name = "application")
@NamedQueries({
    @NamedQuery(name = "Application.findAll", query = "SELECT a FROM Application a"),
    @NamedQuery(name = "Application.findById", query = "SELECT a FROM Application a WHERE a.id = :id"),
    @NamedQuery(name = "Application.findByAppliedAt", query = "SELECT a FROM Application a WHERE a.appliedAt = :appliedAt"),
    @NamedQuery(name = "Application.findByStatus", query = "SELECT a FROM Application a WHERE a.status = :status")})
public class Application implements Serializable {

    @Lob
    @Size(max = 65535)
    @Column(name = "cover_letter")
    private String coverLetter;
    @Size(max = 255)
    @Column(name = "resume_file")
    private String resumeFile;
    @Column(name = "applied_at")
    private LocalDateTime appliedAt;
    @Column(name = "status", length = 10)
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;
    @Lob
    @Size(max = 65535)
    @Column(name = "rejection_reason")
    private String rejectionReason;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "applicationId")
    private Set<EmployerEmailLog> employerEmailLogSet;

    public enum ApplicationStatus {
        PENDING, VIEWED, ACCEPTED, REJECTED,
    }
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "download_url")
    private String downloadUrl;
    @OneToMany(mappedBy = "applicationId")
    private Set<Rating> ratingSet;
    @JoinColumn(name = "candidate_id", referencedColumnName = "id")
    @ManyToOne
    private Candidate candidate;
    @JoinColumn(name = "job_post_id", referencedColumnName = "id")
    @ManyToOne
    private JobPost jobPost;

    public Application() {
    }

    public Application(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public Set<Rating> getRatingSet() {
        return ratingSet;
    }

    public void setRatingSet(Set<Rating> ratingSet) {
        this.ratingSet = ratingSet;
    }

    public Candidate getCandidateId() {
        return candidate;
    }

    public void setCandidateId(Candidate candidateId) {
        this.candidate = candidateId;
    }

    public JobPost getJobPostId() {
        return jobPost;
    }

    public void setJobPostId(JobPost jobPostId) {
        this.jobPost = jobPostId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Application)) {
            return false;
        }
        Application other = (Application) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.pojo.Application[ id=" + id + " ]";
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

    /**
     * @return the downloadUrl
     */
    public String getDownloadUrl() {
        return downloadUrl;
    }

    /**
     * @param downloadUrl the downloadUrl to set
     */
    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public Set<EmployerEmailLog> getEmployerEmailLogSet() {
        return employerEmailLogSet;
    }

    public void setEmployerEmailLogSet(Set<EmployerEmailLog> employerEmailLogSet) {
        this.employerEmailLogSet = employerEmailLogSet;
    }

}
