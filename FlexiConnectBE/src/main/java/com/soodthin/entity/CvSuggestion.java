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
@Table(name = "cv_suggestion")
@NamedQueries({
    @NamedQuery(name = "CvSuggestion.findAll", query = "SELECT c FROM CvSuggestion c"),
    @NamedQuery(name = "CvSuggestion.findById", query = "SELECT c FROM CvSuggestion c WHERE c.id = :id"),
    @NamedQuery(name = "CvSuggestion.findBySection", query = "SELECT c FROM CvSuggestion c WHERE c.section = :section"),
    @NamedQuery(name = "CvSuggestion.findByStatus", query = "SELECT c FROM CvSuggestion c WHERE c.status = :status"),
    @NamedQuery(name = "CvSuggestion.findByCreatedAt", query = "SELECT c FROM CvSuggestion c WHERE c.createdAt = :createdAt"),
    @NamedQuery(name = "CvSuggestion.findByUpdatedAt", query = "SELECT c FROM CvSuggestion c WHERE c.updatedAt = :updatedAt")})
public class CvSuggestion implements Serializable {

    public enum SectionType {
        INTRODUCTION, SKILLS, EXPERIENCE
    }

    public enum SuggestionStatus {
        SUGGESTED, EDITED, SUBMITTED
    }
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Enumerated(EnumType.STRING)
    @Column(name = "section", nullable = false)
    private SectionType section;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "original_input")
    private String originalInput;
    @Basic(optional = false)
    @NotNull
    @Lob
    @Size(min = 1, max = 65535)
    @Column(name = "ai_suggestion")
    private String aiSuggestion;
    @Lob
    @Size(max = 65535)
    @Column(name = "edited_version")
    private String editedVersion;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SuggestionStatus status = SuggestionStatus.SUGGESTED;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @JoinColumn(name = "candidate_id", referencedColumnName = "id")
    @ManyToOne(optional = false)
    @JsonIgnore
    private Candidate candidateId;

    public CvSuggestion() {
    }

    public CvSuggestion(Integer id) {
        this.id = id;
    }

    public CvSuggestion(Integer id, SectionType section, String originalInput, String aiSuggestion) {
        this.id = id;
        this.section = section;
        this.originalInput = originalInput;
        this.aiSuggestion = aiSuggestion;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOriginalInput() {
        return originalInput;
    }

    public void setOriginalInput(String originalInput) {
        this.originalInput = originalInput;
    }

    public String getAiSuggestion() {
        return aiSuggestion;
    }

    public void setAiSuggestion(String aiSuggestion) {
        this.aiSuggestion = aiSuggestion;
    }

    public String getEditedVersion() {
        return editedVersion;
    }

    public void setEditedVersion(String editedVersion) {
        this.editedVersion = editedVersion;
    }

   

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Candidate getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Candidate candidateId) {
        this.candidateId = candidateId;
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
        if (!(object instanceof CvSuggestion)) {
            return false;
        }
        CvSuggestion other = (CvSuggestion) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.entity.CvSuggestion[ id=" + id + " ]";
    }

    /**
     * @return the section
     */
    public SectionType getSection() {
        return section;
    }

    /**
     * @param section the section to set
     */
    public void setSection(SectionType section) {
        this.section = section;
    }

    /**
     * @return the status
     */
    public SuggestionStatus getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(SuggestionStatus status) {
        this.status = status;
    }

}
