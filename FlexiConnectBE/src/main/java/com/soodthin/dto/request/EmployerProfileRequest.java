/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.request;

import lombok.*;

/**
 *
 * @author ADMIN
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployerProfileRequest {

    private String email;
    private String name;
    private String phoneNumber;
    private String avatar;
    
    private String companyName;
    private String companyAddress; 
    private String taxCode;
    private String website;
    private String companyIntro;

}
