/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;


/**
 *
 * @author ADMIN
 */

@Entity
@Table(name = "interview_session")
@NamedQueries({
    @NamedQuery(name = "InterviewSession.findAll", query = "SELECT i FROM InterviewSession i"),
    @NamedQuery(name = "InterviewSession.findById", query = "SELECT i FROM InterviewSession i WHERE i.id = :id"),
    @NamedQuery(name = "InterviewSession.findByStatus", query = "SELECT i FROM InterviewSession i WHERE i.status = :status"),
    @NamedQuery(name = "InterviewSession.findByStartedAt", query = "SELECT i FROM InterviewSession i WHERE i.startedAt = :startedAt"),
    @NamedQuery(name = "InterviewSession.findByCompletedAt", query = "SELECT i FROM InterviewSession i WHERE i.completedAt = :completedAt")})
public class InterviewSession implements Serializable {

    public enum SessionStatus {
    IN_PROGRESS,
    COMPLETED
}
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "status", length = 20)
    @Enumerated(EnumType.STRING)
    private SessionStatus status;
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    @OneToMany(mappedBy = "sessionId")
    @JsonIgnore
    private Set<InterviewTurn> interviewTurnSet;
    @JoinColumn(name = "candidate_id", referencedColumnName = "id")
    @ManyToOne
    @JsonIgnore
    private Candidate candidateId;
    @JoinColumn(name = "job_post_id", referencedColumnName = "id")
    @ManyToOne
    @JsonIgnore
    private JobPost jobPostId;

    public InterviewSession() {
    }

    public InterviewSession(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }


    public Set<InterviewTurn> getInterviewTurnSet() {
        return interviewTurnSet;
    }

    public void setInterviewTurnSet(Set<InterviewTurn> interviewTurnSet) {
        this.interviewTurnSet = interviewTurnSet;
    }

    public Candidate getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Candidate candidateId) {
        this.candidateId = candidateId;
    }

    public JobPost getJobPostId() {
        return jobPostId;
    }

    public void setJobPostId(JobPost jobPostId) {
        this.jobPostId = jobPostId;
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
        if (!(object instanceof InterviewSession)) {
            return false;
        }
        InterviewSession other = (InterviewSession) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.entity.InterviewSession[ id=" + id + " ]";
    }

}
