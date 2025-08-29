/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response;

import com.soodthin.entity.EmployerEmailLog.ActionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
/**
 *
 * @author ADMIN
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployerEmailLogResponse {
    private Integer id;
    private Integer applicationId;
    private Integer employerId;
    private Integer candidateId;
    private String candidateEmail;
    private ActionType actionType;
    private String subject;
    private String content;
    private LocalDateTime createdAt;
}



