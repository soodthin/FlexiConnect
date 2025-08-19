/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.request;

import lombok.Data;

/**
 *
 * @author ADMIN
 */
@Data
public class EmployerVerificationRequest {
    private Boolean isVerified;
    private String reason;
}

