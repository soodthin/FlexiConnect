package com.soodthin.dto.response;

import lombok.*;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author ADMIN
 */
@Data
@Builder
@NoArgsConstructor 
@AllArgsConstructor 
public class SavedJobResponse {

    private Integer jobPostId;
    private String title;
    private String companyName;
    private String avatar;
    private String location;
    private Integer salaryMin;
    private Integer salaryMax;
    private String jobType;
    private Boolean isSaved;
}
