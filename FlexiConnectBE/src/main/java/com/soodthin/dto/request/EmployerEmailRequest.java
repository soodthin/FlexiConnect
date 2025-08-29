/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.request;

import com.soodthin.entity.EmployerEmailLog.ActionType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 *
 * @author ADMIN
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmployerEmailRequest {

    private Integer applicationId;
    private ActionType actionType;
    private String subject;
    private String content;

    private LocalDateTime interviewTime;
    private String location;
    private String result;
    private String documents;
    private int salary;
    private LocalDate startDate;

}
