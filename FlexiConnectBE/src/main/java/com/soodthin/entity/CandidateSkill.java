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
import jakarta.validation.constraints.Size;
import java.io.Serializable;

/**
 *
 * @author ADMIN
 */
@Entity
@Table(name = "candidate_skill")
@NamedQueries({
    @NamedQuery(name = "CandidateSkill.findAll", query = "SELECT c FROM CandidateSkill c"),
    @NamedQuery(name = "CandidateSkill.findByCandidateId", query = "SELECT c FROM CandidateSkill c WHERE c.candidateSkillPK.candidateId = :candidateId"),
    @NamedQuery(name = "CandidateSkill.findBySkillId", query = "SELECT c FROM CandidateSkill c WHERE c.candidateSkillPK.skillId = :skillId"),
    @NamedQuery(name = "CandidateSkill.findByLevel", query = "SELECT c FROM CandidateSkill c WHERE c.level = :level")})
public class CandidateSkill implements Serializable {

    private static final long serialVersionUID = 1L;
    @EmbeddedId
    protected CandidateSkillPK candidateSkillPK;
    @Size(max = 12)
    @Column(name = "level")
    private String level;
    @JoinColumn(name = "candidate_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ManyToOne(optional = false)
    private Candidate candidate;
    @JoinColumn(name = "skill_id", referencedColumnName = "id", insertable = false, updatable = false)
    @ManyToOne(optional = false)
    private Skill skill;

    public CandidateSkill() {
    }

    public CandidateSkill(CandidateSkillPK candidateSkillPK) {
        this.candidateSkillPK = candidateSkillPK;
    }

    public CandidateSkill(int candidateId, int skillId) {
        this.candidateSkillPK = new CandidateSkillPK(candidateId, skillId);
    }

    public CandidateSkillPK getCandidateSkillPK() {
        return candidateSkillPK;
    }

    public void setCandidateSkillPK(CandidateSkillPK candidateSkillPK) {
        this.candidateSkillPK = candidateSkillPK;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Candidate getCandidate() {
        return candidate;
    }

    public void setCandidate(Candidate candidate) {
        this.candidate = candidate;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (candidateSkillPK != null ? candidateSkillPK.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof CandidateSkill)) {
            return false;
        }
        CandidateSkill other = (CandidateSkill) object;
        if ((this.candidateSkillPK == null && other.candidateSkillPK != null) || (this.candidateSkillPK != null && !this.candidateSkillPK.equals(other.candidateSkillPK))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.entity.CandidateSkill[ candidateSkillPK=" + candidateSkillPK + " ]";
    }
    
}
