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
@Table(name = "verification")
@NamedQueries({
    @NamedQuery(name = "Verification.findAll", query = "SELECT v FROM Verification v"),
    @NamedQuery(name = "Verification.findById", query = "SELECT v FROM Verification v WHERE v.id = :id"),
    @NamedQuery(name = "Verification.findByType", query = "SELECT v FROM Verification v WHERE v.type = :type"),
    @NamedQuery(name = "Verification.findByCode", query = "SELECT v FROM Verification v WHERE v.code = :code"),
    @NamedQuery(name = "Verification.findByDocumentUrl", query = "SELECT v FROM Verification v WHERE v.documentUrl = :documentUrl"),
    @NamedQuery(name = "Verification.findByIsVerified", query = "SELECT v FROM Verification v WHERE v.isVerified = :isVerified"),
    @NamedQuery(name = "Verification.findByExpiredAt", query = "SELECT v FROM Verification v WHERE v.expiredAt = :expiredAt")})
public class Verification implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Size(max = 8)
    @Column(name = "type")
    private String type;
    @Size(max = 100)
    @Column(name = "code")
    private String code;
    @Size(max = 255)
    @Column(name = "document_url")
    private String documentUrl;
    @Column(name = "is_verified")
    private Boolean isVerified;
    @Column(name = "expired_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date expiredAt;
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @ManyToOne
    private User userId;

    public Verification() {
    }

    public Verification(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDocumentUrl() {
        return documentUrl;
    }

    public void setDocumentUrl(String documentUrl) {
        this.documentUrl = documentUrl;
    }

    public Boolean getIsVerified() {
        return isVerified;
    }

    public void setIsVerified(Boolean isVerified) {
        this.isVerified = isVerified;
    }

    public Date getExpiredAt() {
        return expiredAt;
    }

    public void setExpiredAt(Date expiredAt) {
        this.expiredAt = expiredAt;
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
        if (!(object instanceof Verification)) {
            return false;
        }
        Verification other = (Verification) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.entity.Verification[ id=" + id + " ]";
    }
    
}
