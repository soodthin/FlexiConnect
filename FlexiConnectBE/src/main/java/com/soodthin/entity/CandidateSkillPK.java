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
public class CandidateSkillPK implements Serializable {

    @Basic(optional = false)
    @NotNull
    @Column(name = "candidate_id")
    private int candidateId;
    @Basic(optional = false)
    @NotNull
    @Column(name = "skill_id")
    private int skillId;

    public CandidateSkillPK() {
    }

    public CandidateSkillPK(int candidateId, int skillId) {
        this.candidateId = candidateId;
        this.skillId = skillId;
    }

    public int getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(int candidateId) {
        this.candidateId = candidateId;
    }

    public int getSkillId() {
        return skillId;
    }

    public void setSkillId(int skillId) {
        this.skillId = skillId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (int) candidateId;
        hash += (int) skillId;
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof CandidateSkillPK)) {
            return false;
        }
        CandidateSkillPK other = (CandidateSkillPK) object;
        if (this.candidateId != other.candidateId) {
            return false;
        }
        if (this.skillId != other.skillId) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.entity.CandidateSkillPK[ candidateId=" + candidateId + ", skillId=" + skillId + " ]";
    }
    
}
