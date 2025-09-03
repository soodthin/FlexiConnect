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
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MomoPaymentResponse {
    private int resultCode;
    private String message;
    private String payUrl;
    private String returnUrl;   
    private String failUrl;
}