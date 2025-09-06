/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto;

import lombok.*;

/**
 *
 * @author ADMIN
 */
@Data
@AllArgsConstructor
public class SessionStatistics {
    private Integer totalTurns;
    private Double averageScore;
    private String overallFeedback;
}