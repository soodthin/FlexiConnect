/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response;

import com.soodthin.entity.JobPost.JobStatus;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

/**
 *
 * @author ADMIN
 */
@Data
@Builder
public class JobPostAdminResponse {
    private Integer id;
    private String title;
    private String description;
    private String location;
    private JobStatus status;
    private String companyName;
    private LocalDateTime createdAt;

    public JobPostAdminResponse(Integer id, String title, String description, String location, JobStatus status, String companyName, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.status = status;
        this.companyName = companyName;
        this.createdAt = createdAt;
    }
}
