/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

/**
 *
 * @author ADMIN
 */
import com.soodthin.dto.JobPostDTO;
import com.soodthin.services.JobPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class JobPostController {

    @Autowired
    private JobPostService jobPostService;

    @GetMapping("/job-posts")
    public List<JobPostDTO> getAllPublicJobPosts() {
        return jobPostService.getAllPublicJobPosts();
    }
}

