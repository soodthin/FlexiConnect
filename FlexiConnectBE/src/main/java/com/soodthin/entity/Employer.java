/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.entity;

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
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;

/**
 *
 * @author ADMIN
 */
@Entity
@Table(name = "employer")
@NamedQueries({
    @NamedQuery(name = "Employer.findAll", query = "SELECT e FROM Employer e"),
    @NamedQuery(name = "Employer.findById", query = "SELECT e FROM Employer e WHERE e.id = :id"),
    @NamedQuery(name = "Employer.findByCompanyName", query = "SELECT e FROM Employer e WHERE e.companyName = :companyName"),
    @NamedQuery(name = "Employer.findByTaxId", query = "SELECT e FROM Employer e WHERE e.taxId = :taxId"),
    @NamedQuery(name = "Employer.findByWebsite", query = "SELECT e FROM Employer e WHERE e.website = :website"),
    @NamedQuery(name = "Employer.findByIsVerified", query = "SELECT e FROM Employer e WHERE e.isVerified = :isVerified")})
public class Employer implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "company_name")
    private String companyName;
    @Size(max = 20)
    @Column(name = "tax_id")
    private String taxId;
    @Size(max = 100)
    @Column(name = "website")
    private String website;
    @Lob
    @Size(max = 65535)
    @Column(name = "company_address")
    private String companyAddress;
    @Lob
    @Size(max = 65535)
    @Column(name = "company_intro")
    private String companyIntro;
    @Column(name = "is_verified")
    private Boolean isVerified;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "employer")
    private Set<FollowEmployer> followEmployerSet;
    @OneToMany(mappedBy = "employerId")
    private Set<CompanyImage> companyImageSet;
    @OneToMany(mappedBy = "employerId")
    private Set<JobPost> jobPostSet;
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @OneToOne(optional = false)
    private User userId;

    public Employer() {
    }

    public Employer(Integer id) {
        this.id = id;
    }

    public Employer(Integer id, String companyName) {
        this.id = id;
        this.companyName = companyName;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getTaxId() {
        return taxId;
    }

    public void setTaxId(String taxId) {
        this.taxId = taxId;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

   

    public String getCompanyIntro() {
        return companyIntro;
    }

    public void setCompanyIntro(String companyIntro) {
        this.companyIntro = companyIntro;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public Set<FollowEmployer> getFollowEmployerSet() {
        return followEmployerSet;
    }

    public void setFollowEmployerSet(Set<FollowEmployer> followEmployerSet) {
        this.followEmployerSet = followEmployerSet;
    }

    public Set<CompanyImage> getCompanyImageSet() {
        return companyImageSet;
    }

    public void setCompanyImageSet(Set<CompanyImage> companyImageSet) {
        this.companyImageSet = companyImageSet;
    }

    public Set<JobPost> getJobPostSet() {
        return jobPostSet;
    }

    public void setJobPostSet(Set<JobPost> jobPostSet) {
        this.jobPostSet = jobPostSet;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
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
        if (!(object instanceof Employer)) {
            return false;
        }
        Employer other = (Employer) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.pojo.Employer[ id=" + id + " ]";
    }

    /**
     * @return the companyAddress
     */
    public String getCompanyAddress() {
        return companyAddress;
    }

    /**
     * @param companyAddress the companyAddress to set
     */
    public void setCompanyAddress(String companyAddress) {
        this.companyAddress = companyAddress;
    }
    
}
