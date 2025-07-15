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
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author ADMIN
 */
@Entity
@Table(name = "work_experience")
@NamedQueries({
    @NamedQuery(name = "WorkExperience.findAll", query = "SELECT w FROM WorkExperience w"),
    @NamedQuery(name = "WorkExperience.findById", query = "SELECT w FROM WorkExperience w WHERE w.id = :id"),
    @NamedQuery(name = "WorkExperience.findByCompany", query = "SELECT w FROM WorkExperience w WHERE w.company = :company"),
    @NamedQuery(name = "WorkExperience.findByPosition", query = "SELECT w FROM WorkExperience w WHERE w.position = :position"),
    @NamedQuery(name = "WorkExperience.findByStartDate", query = "SELECT w FROM WorkExperience w WHERE w.startDate = :startDate"),
    @NamedQuery(name = "WorkExperience.findByEndDate", query = "SELECT w FROM WorkExperience w WHERE w.endDate = :endDate")})
public class WorkExperience implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Size(max = 100)
    @Column(name = "company")
    private String company;
    @Size(max = 100)
    @Column(name = "position")
    private String position;
    @Lob
    @Size(max = 65535)
    @Column(name = "description")
    private String description;
    @Lob
    @Size(max = 65535)
    @Column(name = "description_ai_suggestion")
    private String descriptionAiSuggestion;
    @Column(name = "start_date")
    @Temporal(TemporalType.DATE)
    private Date startDate;
    @Column(name = "end_date")
    @Temporal(TemporalType.DATE)
    private Date endDate;
    @JoinColumn(name = "candidate_id", referencedColumnName = "id")
    @ManyToOne
    private Candidate candidateId;

    public WorkExperience() {
    }

    public WorkExperience(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescriptionAiSuggestion() {
        return descriptionAiSuggestion;
    }

    public void setDescriptionAiSuggestion(String descriptionAiSuggestion) {
        this.descriptionAiSuggestion = descriptionAiSuggestion;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
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
        if (!(object instanceof WorkExperience)) {
            return false;
        }
        WorkExperience other = (WorkExperience) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.entity.WorkExperience[ id=" + id + " ]";
    }
    
}
