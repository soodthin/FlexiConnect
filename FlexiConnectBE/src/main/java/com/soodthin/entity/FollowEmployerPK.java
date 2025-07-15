/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.entity;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;

/**
 *
 * @author ADMIN
 */
@Embeddable
public class FollowEmployerPK implements Serializable {

    @Basic(optional = false)
    @NotNull
    @Column(name = "candidate_id")
    private int candidateId;
    @Basic(optional = false)
    @NotNull
    @Column(name = "employer_id")
    private int employerId;

    public FollowEmployerPK() {
    }

    public FollowEmployerPK(int candidateId, int employerId) {
        this.candidateId = candidateId;
        this.employerId = employerId;
    }

    public int getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(int candidateId) {
        this.candidateId = candidateId;
    }

    public int getEmployerId() {
        return employerId;
    }

    public void setEmployerId(int employerId) {
        this.employerId = employerId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (int) candidateId;
        hash += (int) employerId;
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof FollowEmployerPK)) {
            return false;
        }
        FollowEmployerPK other = (FollowEmployerPK) object;
        if (this.candidateId != other.candidateId) {
            return false;
        }
        if (this.employerId != other.employerId) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.entity.FollowEmployerPK[ candidateId=" + candidateId + ", employerId=" + employerId + " ]";
    }
    
}
