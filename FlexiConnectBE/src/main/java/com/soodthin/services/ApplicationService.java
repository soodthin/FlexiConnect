/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.request.ApplicationReviewRequest;
import com.soodthin.dto.response.CandidateApplicationResponse;
import com.soodthin.dto.response.EmployerApplicationResponse;
import com.soodthin.entity.User;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author ADMIN
 */
public interface ApplicationService {

   CandidateApplicationResponse applyToJob(Integer jobPostId, MultipartFile cvFile,String coverLetter, User user);

    public EmployerApplicationResponse reviewApplication(Integer id, ApplicationReviewRequest request, User user);

    public List<EmployerApplicationResponse> getAllApplicationsByEmployer(User user);

    List<CandidateApplicationResponse> getAppliedJobs(User user);

}
