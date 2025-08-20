/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto;

import lombok.Builder;
import lombok.Data;

/**
 *
 * @author ADMIN
 */
@Data
@Builder
public class EmployerDTO {
    private Integer id;
    private String companyName;
    private String taxCode;
    private String website;
    private String companyAddress;
    private String companyIntro;
    private Boolean isVerified;
    private String reasonReject;
}
