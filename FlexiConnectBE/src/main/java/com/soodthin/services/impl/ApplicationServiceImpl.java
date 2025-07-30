/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.soodthin.dto.response.ApplicationResponseDTO;

/**
 *
 * @author ADMIN
 */
import com.soodthin.entity.Application;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.User;
import com.soodthin.repositories.ApplicationRepository;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.JobPostRepository;
import com.soodthin.services.ApplicationService;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Map;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;
    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    private JobPostRepository jobPostRepository;
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private ModelMapper modelMapper;

    @Override
    public ApplicationResponseDTO applyToJob(Integer jobPostId, MultipartFile cvFile, User user) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bạn không phải là ứng viên."));

        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tin tuyển dụng không tồn tại."));

        if (applicationRepository.existsByCandidateAndJobPost(candidate, jobPost)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bạn đã ứng tuyển vào tin này rồi.");
        }

        String resumeFile;
        try {
            Map uploadResult = cloudinary.uploader().upload(cvFile.getBytes(), ObjectUtils.asMap(
                    "resource_type", "auto",
                    "folder", "cv_applications"
            ));
            resumeFile = uploadResult.get("secure_url").toString();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể upload CV.");
        }

        Application application = new Application();
        application.setCandidateId(candidate);
        application.setJobPostId(jobPost);
        application.setResumeFile(resumeFile);
        application.setAppliedAt(LocalDateTime.now());
        application.setStatus("PENDING");

        application = applicationRepository.save(application);

        ApplicationResponseDTO responseDTO = modelMapper.map(application, ApplicationResponseDTO.class);
responseDTO.setCandidateId(application.getCandidateId().getId());
        responseDTO.setCandidateName(user.getFullName());
        responseDTO.setJobPostId(jobPost.getId());
        responseDTO.setJobPostTitle(jobPost.getTitle());
        responseDTO.setStatus(application.getStatus());

        return responseDTO;
    }
}

