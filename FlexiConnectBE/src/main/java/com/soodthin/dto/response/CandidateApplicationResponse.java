/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response;

import com.soodthin.entity.Application.ApplicationStatus;
import java.math.BigDecimal;
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
public class CandidateApplicationResponse {

    private Integer id;
    private Integer jobPostId;
    private String jobPostTitle;
    private Integer candidateId;
    private String candidateName;
    private String coverLetter;
    private String resumeFile;
    private String downloadUrl;
    private ApplicationStatus status;
    private String rejectionReason;
    private LocalDateTime appliedAt;

    private String companyName;

    private String jobTitle;
    private String location;
    private String description;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String jobType;
}
