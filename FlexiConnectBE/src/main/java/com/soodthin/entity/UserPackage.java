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
import java.io.Serializable;
import java.time.LocalDate;

/**
 *
 * @author ADMIN
 */
@Entity
@Table(name = "user_package")
@NamedQueries({
    @NamedQuery(name = "UserPackage.findAll", query = "SELECT u FROM UserPackage u"),
    @NamedQuery(name = "UserPackage.findById", query = "SELECT u FROM UserPackage u WHERE u.id = :id"),
    @NamedQuery(name = "UserPackage.findByStartDate", query = "SELECT u FROM UserPackage u WHERE u.startDate = :startDate"),
    @NamedQuery(name = "UserPackage.findByEndDate", query = "SELECT u FROM UserPackage u WHERE u.endDate = :endDate"),
    @NamedQuery(name = "UserPackage.findByIsActive", query = "SELECT u FROM UserPackage u WHERE u.isActive = :isActive")})
public class UserPackage implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "start_date")
    private LocalDate startDate;
    @Column(name = "end_date")
    private LocalDate endDate;
    @Column(name = "is_active")
    private Boolean isActive;
    @JoinColumn(name = "package_id", referencedColumnName = "id")
    @ManyToOne
    private Package packageId;
    @JoinColumn(name = "transaction_id", referencedColumnName = "id")
    @ManyToOne
    private PaymentTransaction transactionId;
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @ManyToOne
    private User userId;

    public UserPackage() {
    }

    public UserPackage(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Package getPackageId() {
        return packageId;
    }

    public void setPackageId(Package packageId) {
        this.packageId = packageId;
    }

    public PaymentTransaction getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(PaymentTransaction transactionId) {
        this.transactionId = transactionId;
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
        if (!(object instanceof UserPackage)) {
            return false;
        }
        UserPackage other = (UserPackage) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.pojo.UserPackage[ id=" + id + " ]";
    }
    
}
