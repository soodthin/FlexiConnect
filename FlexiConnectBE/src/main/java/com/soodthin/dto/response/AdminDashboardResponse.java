/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response;

import com.soodthin.dto.JobPostStatsDTO;
import com.soodthin.dto.UserRegistrationStatsDTO;
import java.util.List;
import lombok.Builder;
import lombok.Data;

/**
 *
 * @author ADMIN
 */
@Data
@Builder
public class AdminDashboardResponse {
     private Long totalUsers;
    private Long totalCandidates;
    private Long totalEmployers;
    private Long totalJobPosts;
    private Long totalApplications;
    private Long activeJobs;
    private Long pendingEmployerVerifications;
    private Long bannedUsers;
    private Long deletedUsers;
    private List<UserRegistrationStatsDTO> userRegistrationStats;
    private List<JobPostStatsDTO> jobPostStats;

}
