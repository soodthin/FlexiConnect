/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.JobPostDTO;
import java.util.List;

/**
 *
 * @author ADMIN
 */
public interface JobPostService {
    List<JobPostDTO> getAllPublicJobPosts();
}
