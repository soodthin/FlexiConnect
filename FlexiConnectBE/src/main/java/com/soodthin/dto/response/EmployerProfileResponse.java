/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response;

import lombok.*;

/**
 *
 * @author ADMIN
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployerProfileResponse {

    private String fullName;
    private String email;
    private String phoneNumber;
    private String avatar;

    private String companyName;
    private String companyAddress;
    private String taxCode;
    private String website;
    private String companyIntro;

    private Integer follower;
    private Boolean isVerified;
    private String reasonReject;

}
