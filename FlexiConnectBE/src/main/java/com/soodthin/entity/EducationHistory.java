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
@Table(name = "education_history")
@NamedQueries({
    @NamedQuery(name = "EducationHistory.findAll", query = "SELECT e FROM EducationHistory e"),
    @NamedQuery(name = "EducationHistory.findById", query = "SELECT e FROM EducationHistory e WHERE e.id = :id"),
    @NamedQuery(name = "EducationHistory.findBySchool", query = "SELECT e FROM EducationHistory e WHERE e.school = :school"),
    @NamedQuery(name = "EducationHistory.findByMajor", query = "SELECT e FROM EducationHistory e WHERE e.major = :major"),
    @NamedQuery(name = "EducationHistory.findByStartDate", query = "SELECT e FROM EducationHistory e WHERE e.startDate = :startDate"),
    @NamedQuery(name = "EducationHistory.findByEndDate", query = "SELECT e FROM EducationHistory e WHERE e.endDate = :endDate")})
public class EducationHistory implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Size(max = 100)
    @Column(name = "school")
    private String school;
    @Size(max = 100)
    @Column(name = "major")
    private String major;
    @Column(name = "start_date")
    @Temporal(TemporalType.DATE)
    private Date startDate;
    @Column(name = "end_date")
    @Temporal(TemporalType.DATE)
    private Date endDate;
    @JoinColumn(name = "candidate_id", referencedColumnName = "id")
    @ManyToOne
    private Candidate candidate;

    public EducationHistory() {
    }

    public EducationHistory(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSchool() {
        return school;
    }

    public void setSchool(String school) {
        this.school = school;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
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
        return candidate;
    }

    public void setCandidateId(Candidate candidateId) {
        this.candidate= candidateId;
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
        if (!(object instanceof EducationHistory)) {
            return false;
        }
        EducationHistory other = (EducationHistory) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.entity.EducationHistory[ id=" + id + " ]";
    }
    
}
