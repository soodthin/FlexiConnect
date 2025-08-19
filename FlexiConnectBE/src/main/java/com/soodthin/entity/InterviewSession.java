/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.entity;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
import jakarta.validation.constraints.Size;
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
    @NamedQuery(name = "InterviewSession.findByCompletedAt", query = "SELECT i FROM InterviewSession i WHERE i.completedAt = :completedAt"),
    @NamedQuery(name = "InterviewSession.findByTotalScore", query = "SELECT i FROM InterviewSession i WHERE i.totalScore = :totalScore")})
public class InterviewSession implements Serializable {

    public enum InterviewStatus {
    IN_PROGRESS,
    COMPLETED
}
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Size(max = 11)
    @Column(name = "status")
    private InterviewStatus status;
    @Column(name = "started_at")
    private LocalDateTime startedAt;
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    @Column(name = "total_score")
    private Integer totalScore;
    @Lob
    @Size(max = 65535)
    @Column(name = "note")
    private String note;
    @OneToMany(mappedBy = "session")
    private Set<InterviewTurn> interviewTurnSet;
    @JoinColumn(name = "candidate_id", referencedColumnName = "id")
    @ManyToOne
    private Candidate candidate;
    @JoinColumn(name = "job_post_id", referencedColumnName = "id")
    @ManyToOne
    private JobPost jobPost;

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

    public InterviewStatus getStatus() {
        return status;
    }

    public void setStatus(InterviewStatus status) {
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

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Set<InterviewTurn> getInterviewTurnSet() {
        return interviewTurnSet;
    }

    public void setInterviewTurnSet(Set<InterviewTurn> interviewTurnSet) {
        this.interviewTurnSet = interviewTurnSet;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }

    public void setJobPost(JobPost jobPost) {
        this.jobPost = jobPost;
    }

    public Candidate getCandidate() {
        return candidate;
    }

    public JobPost getJobPost() {
        return jobPost;
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
