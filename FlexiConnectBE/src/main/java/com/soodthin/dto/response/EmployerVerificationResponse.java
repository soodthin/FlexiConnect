/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

/**
 *
 * @author ADMIN
 */
@Data
@Builder
public class EmployerVerificationResponse {
    private Integer id;
    private Long userId;
    private String email;
    private String fullName;
    private String companyName;
    private String taxCode;
    private String website;
    private String companyAddress;
    private String companyIntro;
    private Boolean isVerified;
    private LocalDateTime createdAt;
}
