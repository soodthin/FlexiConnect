/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.entity;

import jakarta.persistence.Basic;
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
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 *
 * @author ADMIN
 */
@Entity
@Table(name = "employer_email_log")
@NamedQueries({
    @NamedQuery(name = "EmployerEmailLog.findAll", query = "SELECT e FROM EmployerEmailLog e"),
    @NamedQuery(name = "EmployerEmailLog.findById", query = "SELECT e FROM EmployerEmailLog e WHERE e.id = :id"),
    @NamedQuery(name = "EmployerEmailLog.findByActionType", query = "SELECT e FROM EmployerEmailLog e WHERE e.actionType = :actionType"),
    @NamedQuery(name = "EmployerEmailLog.findBySubject", query = "SELECT e FROM EmployerEmailLog e WHERE e.subject = :subject"),
    @NamedQuery(name = "EmployerEmailLog.findByCreatedAt", query = "SELECT e FROM EmployerEmailLog e WHERE e.createdAt = :createdAt")})
public class EmployerEmailLog implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    public enum ActionType {
        INTERVIEW_INVITE,
        INTERVIEW_RESULT,
        REQUEST_DOCUMENTS,
        OFFER_LETTER,
        INTERVIEW_CANCEL
    }
    @Column(name = "action_type", length = 30, nullable = false)
    @Enumerated(EnumType.STRING)
    private ActionType actionType;

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "subject")
    private String subject;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "content")
    private String content;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @JoinColumn(name = "application_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Application applicationId;
    @JoinColumn(name = "candidate_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Candidate candidateId;
    @JoinColumn(name = "employer_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Employer employerId;

    public EmployerEmailLog() {
    }

    public EmployerEmailLog(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ActionType getActionType() {
        return actionType;
    }

    public void setActionType(ActionType actionType) {
        this.actionType = actionType;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Application getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Application applicationId) {
        this.applicationId = applicationId;
    }

    public Candidate getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Candidate candidateId) {
        this.candidateId = candidateId;
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
        if (!(object instanceof EmployerEmailLog)) {
            return false;
        }
        EmployerEmailLog other = (EmployerEmailLog) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.entity.EmployerEmailLog[ id=" + id + " ]";
    }

}
