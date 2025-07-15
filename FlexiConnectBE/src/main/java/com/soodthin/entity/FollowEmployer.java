/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.entity;

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
import java.util.Date;

/**
 *
 * @author ADMIN
 */
@Entity
@Table(name = "follow_employer")
@NamedQueries({
    @NamedQuery(name = "FollowEmployer.findAll", query = "SELECT f FROM FollowEmployer f"),
    @NamedQuery(name = "FollowEmployer.findByCandidateId", query = "SELECT f FROM FollowEmployer f WHERE f.followEmployerPK.candidateId = :candidateId"),
    @NamedQuery(name = "FollowEmployer.findByEmployerId", query = "SELECT f FROM FollowEmployer f WHERE f.followEmployerPK.employerId = :employerId"),
    @NamedQuery(name = "FollowEmployer.findByFollowedAt", query = "SELECT f FROM FollowEmployer f WHERE f.followedAt = :followedAt")})
public class FollowEmployer implements Serializable {

    private static final long serialVersionUID = 1L;
    @EmbeddedId
    protected FollowEmployerPK followEmployerPK;
    @Column(name = "followed_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date followedAt;
    @JoinColumn(name = "candidate_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ManyToOne(optional = false)
    private Candidate candidate;
    @JoinColumn(name = "employer_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ManyToOne(optional = false)
    private Employer employer;

    public FollowEmployer() {
    }

    public FollowEmployer(FollowEmployerPK followEmployerPK) {
        this.followEmployerPK = followEmployerPK;
    }

    public FollowEmployer(int candidateId, int employerId) {
        this.followEmployerPK = new FollowEmployerPK(candidateId, employerId);
    }

    public FollowEmployerPK getFollowEmployerPK() {
        return followEmployerPK;
    }

    public void setFollowEmployerPK(FollowEmployerPK followEmployerPK) {
        this.followEmployerPK = followEmployerPK;
    }

    public Date getFollowedAt() {
        return followedAt;
    }

    public void setFollowedAt(Date followedAt) {
        this.followedAt = followedAt;
    }

    public Candidate getCandidate() {
        return candidate;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }

    public Employer getEmployer() {
        return employer;
    }

    public void setEmployer(Employer employer) {
        this.employer = employer;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (followEmployerPK != null ? followEmployerPK.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof FollowEmployer)) {
            return false;
        }
        FollowEmployer other = (FollowEmployer) object;
        if ((this.followEmployerPK == null && other.followEmployerPK != null) || (this.followEmployerPK != null && !this.followEmployerPK.equals(other.followEmployerPK))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.entity.FollowEmployer[ followEmployerPK=" + followEmployerPK + " ]";
    }
    
}
