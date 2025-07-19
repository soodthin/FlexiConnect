/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto;

/**
 *
 * @author ADMIN
 */
public class EmployerRegisterDTO {
    private String companyName;
    private String taxId;
    private String companyIntro;
    private CandidateRegisterDTO user;

    /**
     * @return the companyName
     */
    public String getCompanyName() {
        return companyName;
    }

    /**
     * @param companyName the companyName to set
     */
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    /**
     * @return the companyIntro
     */
    public String getCompanyIntro() {
        return companyIntro;
    }

    /**
     * @param companyIntro the companyIntro to set
     */
    public void setCompanyIntro(String companyIntro) {
        this.companyIntro = companyIntro;
    }

    /**
     * @return the user
     */
    public CandidateRegisterDTO getUser() {
        return user;
    }

    /**
     * @param user the user to set
     */
    public void setUser(CandidateRegisterDTO user) {
        this.user = user;
    }

    /**
     * @return the taxId
     */
    public String getTaxId() {
        return taxId;
    }

    /**
     * @param taxId the taxId to set
     */
    public void setTaxId(String taxId) {
        this.taxId = taxId;
    }
    
}
