/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;

/**
 *
 * @author ADMIN
 */
@Entity
@Table(name = "candidate")
@NamedQueries({
    @NamedQuery(name = "Candidate.findAll", query = "SELECT c FROM Candidate c"),
    @NamedQuery(name = "Candidate.findById", query = "SELECT c FROM Candidate c WHERE c.id = :id"),
    @NamedQuery(name = "Candidate.findByTitle", query = "SELECT c FROM Candidate c WHERE c.title = :title"),
    @NamedQuery(name = "Candidate.findByResumeFile", query = "SELECT c FROM Candidate c WHERE c.resumeFile = :resumeFile")})
public class Candidate implements Serializable {

    @Size(max = 150)
    @Column(name = "title")
    private String title;
    @Lob
    @Size(max = 65535)
    @Column(name = "bio")
    private String bio;
    @Size(max = 255)
    @Column(name = "resume_file")
    private String resumeFile;
    @Lob
    @Size(max = 65535)
    @Column(name = "profile_vector")
    private String profileVector;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "candidateId")
    private Set<EmployerEmailLog> employerEmailLogSet;
    @Lob
    @Size(max = 65535)
    @Column(name = "bio_ai_suggestion")
    private String bioAiSuggestion;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "candidateId")
    private Set<CvSuggestion> cvSuggestionsSet;

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "candidate")
    private Set<FollowEmployer> followEmployerSet;
    @OneToMany(mappedBy = "candidate")
    @JsonIgnore
    private Set<InterviewSession> interviewSessionSet;
    @OneToMany(mappedBy = "candidate")
    private Set<EducationHistory> educationHistorySet;
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @OneToOne(optional = false)
    private User userId;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "candidate")
    private Set<SavedJob> savedJobSet;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "candidate")
    private Set<CandidateSkill> candidateSkillSet;
    @OneToMany(mappedBy = "candidate")
    @JsonIgnore
    private Set<Application> applicationSet;
    @OneToMany(mappedBy = "candidate")
    private Set<WorkExperience> workExperienceSet;

    public Candidate() {
    }

    public Candidate(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getResumeFile() {
        return resumeFile;
    }

    public void setResumeFile(String resumeFile) {
        this.resumeFile = resumeFile;
    }

    public String getProfileVector() {
        return profileVector;
    }

    public void setProfileVector(String profileVector) {
        this.profileVector = profileVector;
    }

    public Set<FollowEmployer> getFollowEmployerSet() {
        return followEmployerSet;
    }

    public void setFollowEmployerSet(Set<FollowEmployer> followEmployerSet) {
        this.followEmployerSet = followEmployerSet;
    }

    public Set<InterviewSession> getInterviewSessionSet() {
        return interviewSessionSet;
    }

    public void setInterviewSessionSet(Set<InterviewSession> interviewSessionSet) {
        this.interviewSessionSet = interviewSessionSet;
    }

    public Set<EducationHistory> getEducationHistorySet() {
        return educationHistorySet;
    }

    public void setEducationHistorySet(Set<EducationHistory> educationHistorySet) {
        this.educationHistorySet = educationHistorySet;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
    }

    public Set<SavedJob> getSavedJobSet() {
        return savedJobSet;
    }

    public void setSavedJobSet(Set<SavedJob> savedJobSet) {
        this.savedJobSet = savedJobSet;
    }

    public Set<CandidateSkill> getCandidateSkillSet() {
        return candidateSkillSet;
    }

    public void setCandidateSkillSet(Set<CandidateSkill> candidateSkillSet) {
        this.candidateSkillSet = candidateSkillSet;
    }

    public Set<Application> getApplicationSet() {
        return applicationSet;
    }

    public void setApplicationSet(Set<Application> applicationSet) {
        this.applicationSet = applicationSet;
    }

    public Set<WorkExperience> getWorkExperienceSet() {
        return workExperienceSet;
    }

    public void setWorkExperienceSet(Set<WorkExperience> workExperienceSet) {
        this.workExperienceSet = workExperienceSet;
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
        if (!(object instanceof Candidate)) {
            return false;
        }
        Candidate other = (Candidate) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.pojo.Candidate[ id=" + id + " ]";
    }

    public String getBioAiSuggestion() {
        return bioAiSuggestion;
    }

    public void setBioAiSuggestion(String bioAiSuggestion) {
        this.bioAiSuggestion = bioAiSuggestion;
    }

    public Set<CvSuggestion> getCvSuggestionsSet() {
        return cvSuggestionsSet;
    }

    public void setCvSuggestionsSet(Set<CvSuggestion> cvSuggestionsSet) {
        this.cvSuggestionsSet = cvSuggestionsSet;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }


    public Set<EmployerEmailLog> getEmployerEmailLogSet() {
        return employerEmailLogSet;
    }

    public void setEmployerEmailLogSet(Set<EmployerEmailLog> employerEmailLogSet) {
        this.employerEmailLogSet = employerEmailLogSet;
    }

}
