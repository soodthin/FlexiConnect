/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.entity;

import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

/**
 *
 * @author ADMIN
 */
@Entity
@Table(name = "job_post")
@NamedQueries({
    @NamedQuery(name = "JobPost.findAll", query = "SELECT j FROM JobPost j"),
    @NamedQuery(name = "JobPost.findById", query = "SELECT j FROM JobPost j WHERE j.id = :id"),
    @NamedQuery(name = "JobPost.findByTitle", query = "SELECT j FROM JobPost j WHERE j.title = :title"),
    @NamedQuery(name = "JobPost.findByLocation", query = "SELECT j FROM JobPost j WHERE j.location = :location"),
    @NamedQuery(name = "JobPost.findBySalaryMin", query = "SELECT j FROM JobPost j WHERE j.salaryMin = :salaryMin"),
    @NamedQuery(name = "JobPost.findBySalaryMax", query = "SELECT j FROM JobPost j WHERE j.salaryMax = :salaryMax"),
    @NamedQuery(name = "JobPost.findByJobType", query = "SELECT j FROM JobPost j WHERE j.jobType = :jobType"),
    @NamedQuery(name = "JobPost.findByCreatedAt", query = "SELECT j FROM JobPost j WHERE j.createdAt = :createdAt"),
    @NamedQuery(name = "JobPost.findByExpiredAt", query = "SELECT j FROM JobPost j WHERE j.expiredAt = :expiredAt"),
    @NamedQuery(name = "JobPost.findByStatus", query = "SELECT j FROM JobPost j WHERE j.status = :status"),
    @NamedQuery(name = "JobPost.findByViewCount", query = "SELECT j FROM JobPost j WHERE j.viewCount = :viewCount")})
public class JobPost implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 150)
    @Column(name = "title")
    private String title;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "description")
    private String description;
    @Size(max = 150)
    @Column(name = "location")
    private String location;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "salary_min")
    private BigDecimal salaryMin;
    @Column(name = "salary_max")
    private BigDecimal salaryMax;
    @Size(max = 100)
    @Column(name = "job_type")
    private String jobType;
    @Column(name = "created_at")
    private LocalDateTime  createdAt;
    @Column(name = "expired_at")
    private LocalDateTime  expiredAt;
    @Size(max = 6)
    @Column(name = "status")
    private String status;
    @Column(name = "view_count")
    private Integer viewCount;
    @Lob
    @Size(max = 65535)
    @Column(name = "job_vector")
    private String jobVector;
    @JoinTable(name = "job_post_skill", joinColumns = {
        @JoinColumn(name = "job_post_id", referencedColumnName = "id")}, inverseJoinColumns = {
        @JoinColumn(name = "skill_id", referencedColumnName = "id")})
    @ManyToMany
    private Set<Skill> skillSet;
    @OneToMany(mappedBy = "jobPostId")
    private Set<InterviewSession> interviewSessionSet;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "jobPost")
    private Set<SavedJob> savedJobSet;
    @OneToMany(mappedBy = "jobPostId")
    private Set<Application> applicationSet;
    @JoinColumn(name = "employer_id", referencedColumnName = "id")
    @ManyToOne
    private Employer employerId;

    public JobPost() {
    }

    public JobPost(Integer id) {
        this.id = id;
    }

    public JobPost(Integer id, String title, String description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public BigDecimal getSalaryMin() {
        return salaryMin;
    }

    public void setSalaryMin(BigDecimal salaryMin) {
        this.salaryMin = salaryMin;
    }

    public BigDecimal getSalaryMax() {
        return salaryMax;
    }

    public void setSalaryMax(BigDecimal salaryMax) {
        this.salaryMax = salaryMax;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public LocalDateTime  getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime  createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime  getExpiredAt() {
        return expiredAt;
    }

    public void setExpiredAt(LocalDateTime  expiredAt) {
        this.expiredAt = expiredAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public String getJobVector() {
        return jobVector;
    }

    public void setJobVector(String jobVector) {
        this.jobVector = jobVector;
    }

    public Set<Skill> getSkillSet() {
        return skillSet;
    }

    public void setSkillSet(Set<Skill> skillSet) {
        this.skillSet = skillSet;
    }

    public Set<InterviewSession> getInterviewSessionSet() {
        return interviewSessionSet;
    }

    public void setInterviewSessionSet(Set<InterviewSession> interviewSessionSet) {
        this.interviewSessionSet = interviewSessionSet;
    }

    public Set<SavedJob> getSavedJobSet() {
        return savedJobSet;
    }

    public void setSavedJobSet(Set<SavedJob> savedJobSet) {
        this.savedJobSet = savedJobSet;
    }

    public Set<Application> getApplicationSet() {
        return applicationSet;
    }

    public void setApplicationSet(Set<Application> applicationSet) {
        this.applicationSet = applicationSet;
    }

    public Employer getEmployerId() {
        return employerId;
    }

    public void setEmployerId(Employer employerId) {
        this.employerId = employerId;
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
        if (!(object instanceof JobPost)) {
            return false;
        }
        JobPost other = (JobPost) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.pojo.JobPost[ id=" + id + " ]";
    }
    
}
