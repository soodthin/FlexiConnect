/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response;

import com.soodthin.entity.Application.ApplicationStatus;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

/**
 *
 * @author ADMIN
 */
@Data
@Builder
public class EmployerApplicationResponse {

    private Integer id;
    private String candidateName;
    private String jobTitle;
    private String resumeFile;
    private ApplicationStatus status;
    private String rejectionReason;
    private LocalDateTime appliedAt;
}
