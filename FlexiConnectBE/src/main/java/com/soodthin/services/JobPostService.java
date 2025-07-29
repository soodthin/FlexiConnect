/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.request.JobPostRequest;
import com.soodthin.dto.response.JobPostResponse;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.User;
import java.util.List;

/**
 *
 * @author ADMIN
 */
public interface JobPostService {

    JobPost createJobPost(User user, JobPostRequest request);

    List<JobPostResponse> getJobPostsByEmployer(User user);

    JobPost updateJobPost(User user, Integer id, JobPostRequest request);

    JobPostResponse viewJobPost(Integer id);

    void deleteJobPost(User user, Integer id);

    List<JobPostResponse> getAllPublicJobPosts();
}
