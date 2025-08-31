/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response;

import com.soodthin.entity.JobPost.JobStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;
/**
 *
 * @author ADMIN
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JobPostResponse {

    private Integer id;
    private String title;
    private String description;
    private String location;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private String jobType;
    private LocalDateTime createdAt;
    private LocalDateTime expiredAt;
    private JobStatus status;

    private Integer employerId;
    private String companyName;
    private String avatar;
    private String companyAddress;
    private String website;
    private int viewCount;

    private Boolean isFollowed;
    private Boolean notifyJob;
 

}
