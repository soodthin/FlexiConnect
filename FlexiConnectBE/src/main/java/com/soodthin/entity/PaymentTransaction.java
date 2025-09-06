/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

/**
 *
 * @author ADMIN
 */
@Entity
@Table(name = "payment_transaction")
@NamedQueries({
    @NamedQuery(name = "PaymentTransaction.findAll", query = "SELECT p FROM PaymentTransaction p"),
    @NamedQuery(name = "PaymentTransaction.findById", query = "SELECT p FROM PaymentTransaction p WHERE p.id = :id"),
    @NamedQuery(name = "PaymentTransaction.findByAmount", query = "SELECT p FROM PaymentTransaction p WHERE p.amount = :amount"),
    @NamedQuery(name = "PaymentTransaction.findByTransactionCode", query = "SELECT p FROM PaymentTransaction p WHERE p.transactionCode = :transactionCode"),
    @NamedQuery(name = "PaymentTransaction.findByStatus", query = "SELECT p FROM PaymentTransaction p WHERE p.status = :status"),
    @NamedQuery(name = "PaymentTransaction.findByCreatedAt", query = "SELECT p FROM PaymentTransaction p WHERE p.createdAt = :createdAt"),
    @NamedQuery(name = "PaymentTransaction.findByUpdatedAt", query = "SELECT p FROM PaymentTransaction p WHERE p.updatedAt = :updatedAt")})
public class PaymentTransaction implements Serializable {

    public enum TransactionStatus {
    PENDING,
    SUCCESS,
    FAILED
}
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "amount")
    private BigDecimal amount;
    @Size(max = 100)
    @Column(name = "transaction_code")
    private String transactionCode;
    @Column(name = "momo_trans_id")
    private String momoTransId;
    @Column(name = "status", length = 20)
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @JoinColumn(name = "package_id", referencedColumnName = "id")
    @ManyToOne
    private Package packageId;
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @ManyToOne
    private User userId;
    @OneToMany(mappedBy = "transactionId")
    @JsonIgnore
    private Set<UserPackage> userPackageSet;

    public PaymentTransaction() {
    }

    public PaymentTransaction(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getTransactionCode() {
        return transactionCode;
    }

    public void setTransactionCode(String transactionCode) {
        this.transactionCode = transactionCode;
    }

    public String getMomoTransId() {
        return momoTransId;
    }

    public void setMomoTransId(String momoTransId) {
        this.momoTransId = momoTransId;
    }

    
    public TransactionStatus getStatus() {
        return status;
    }

    public void setStatus(TransactionStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Package getPackageId() {
        return packageId;
    }

    public void setPackageId(Package packageId) {
        this.packageId = packageId;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
    }

    public Set<UserPackage> getUserPackageSet() {
        return userPackageSet;
    }

    public void setUserPackageSet(Set<UserPackage> userPackageSet) {
        this.userPackageSet = userPackageSet;
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
        if (!(object instanceof PaymentTransaction)) {
            return false;
        }
        PaymentTransaction other = (PaymentTransaction) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.pojo.PaymentTransaction[ id=" + id + " ]";
    }
    
}
