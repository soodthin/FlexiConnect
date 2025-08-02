/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.soodthin.dto.request.ApplicationReviewRequest;
import com.soodthin.dto.response.ApplicationResponseDTO;
import com.soodthin.entity.Application;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.Employer;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.User;
import com.soodthin.repositories.ApplicationRepository;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.EmployerRepository;
import com.soodthin.repositories.JobPostRepository;
import com.soodthin.services.ApplicationService;
import java.util.UUID;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
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
    @Autowired
    private EmployerRepository employerRepository;

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

        return mapToResponseDTO(application);
    }

    @Override
    public List<ApplicationResponseDTO> getAllApplicationsByEmployer(User user) {
        Employer employer = employerRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy employer"));

        List<JobPost> jobPosts = jobPostRepository.findByEmployer(employer);

        if (jobPosts.isEmpty()) {
            return List.of();
        }

        List<Application> applications = applicationRepository.findByJobPostIn(jobPosts);

        return applications.stream()
                .map(this::mapToResponseDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public ApplicationResponseDTO reviewApplication(Integer applicationId, ApplicationReviewRequest request, User currentUser) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Hồ sơ không tồn tại."));

        // Kiểm tra xem employer có sở hữu job này không
        Integer employerUserId = application.getJobPostId().getEmployerId().getUserId().getId();
        if (!employerUserId.equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền duyệt hồ sơ này.");
        }

        String newStatus = request.getStatus().toUpperCase();
        if (!newStatus.equals("ACCEPTED") && !newStatus.equals("REJECTED")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái không hợp lệ.");
        }

        application.setStatus(newStatus);
        application.setRejectionReason("REJECTED".equals(newStatus) ? request.getReason() : null);
        applicationRepository.save(application);

        return mapToResponseDTO(application);

    }

    private ApplicationResponseDTO mapToResponseDTO(Application application) {
        ApplicationResponseDTO dto = modelMapper.map(application, ApplicationResponseDTO.class
        );
        dto.setCandidateId(application.getCandidateId().getId());
        dto.setCandidateName(application.getCandidateId().getUserId().getFullName());
        dto.setJobPostId(application.getJobPostId().getId());
        dto.setJobPostTitle(application.getJobPostId().getTitle());
        dto.setStatus(application.getStatus());
        return dto;
    }
}
