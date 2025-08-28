/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.soodthin.dto.request.ApplicationReviewRequest;
import com.soodthin.dto.response.CandidateApplicationResponse;
import com.soodthin.dto.response.EmployerApplicationResponse;
import com.soodthin.entity.Application;
import com.soodthin.entity.Application.ApplicationStatus;
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
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
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
    @Autowired
    private EmployerRepository employerRepository;

    @Override
    public CandidateApplicationResponse applyToJob(Integer jobPostId, MultipartFile cvFile, User user) {
        System.out.println("Tên file: " + cvFile.getOriginalFilename());
        System.out.println("Kích thước: " + cvFile.getSize() + " bytes");
        System.out.println("Loại: " + cvFile.getContentType());

        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Bạn không phải là ứng viên."));

        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tin tuyển dụng không tồn tại."));

        if (applicationRepository.existsByCandidateAndJobPost(candidate, jobPost)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bạn đã ứng tuyển vào tin này rồi.");
        }

        String resumeFile;
        try {
            String safeFilename = UUID.randomUUID().toString();

            Map uploadResult = cloudinary.uploader().upload(cvFile.getBytes(), ObjectUtils.asMap(
                    "resource_type", "auto",
                    "folder", "cv_applications",
                    "public_id", safeFilename,
                    "type", "upload" // Đảm bảo file là public
            ));

            System.out.println("Cloudinary upload result: " + uploadResult);

            resumeFile = uploadResult.get("secure_url").toString();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Không thể upload CV.");
        }

        Application application = new Application();
        application.setCandidateId(candidate);
        application.setJobPostId(jobPost);
        application.setResumeFile(resumeFile);
        application.setAppliedAt(LocalDateTime.now());
        application.setStatus(ApplicationStatus.PENDING);

        application = applicationRepository.save(application);

        return mapToResponseDTO(application);
    }

    @Override
    public List<EmployerApplicationResponse> getAllApplicationsByEmployer(User user) {
        Employer employer = employerRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy employer"));

        List<JobPost> jobPosts = jobPostRepository.findByEmployer(employer);

        if (jobPosts.isEmpty()) {
            return List.of();
        }

        List<Application> applications = applicationRepository.findByJobPostIn(jobPosts);

        return applications.stream()
                .map(this::mapToEmployerApplicationResponse)
                .toList();
    }

    @Override
    public EmployerApplicationResponse reviewApplication(Integer id, ApplicationReviewRequest request, User user) {
        Employer employer = employerRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy employer"));

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));

        if (!application.getJobPostId().getEmployerId().getId().equals(employer.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền duyệt hồ sơ này");
        }

        application.setStatus(request.getStatus());
        if (request.getStatus() == ApplicationStatus.REJECTED) {
            application.setRejectionReason(request.getReason());
        } else {
            application.setRejectionReason(null);
        }

        applicationRepository.saveAndFlush(application);

        return mapToEmployerApplicationResponse(application);
    }

    private EmployerApplicationResponse mapToEmployerApplicationResponse(Application application) {
        return EmployerApplicationResponse.builder()
                .id(application.getId())
                .candidateName(application.getCandidateId().getUserId().getFullName())
                .jobTitle(application.getJobPostId().getTitle())
                .status(application.getStatus())
                .rejectionReason(application.getRejectionReason())
                .appliedAt(application.getAppliedAt())
                .build();
    }

    @Override
    public List<CandidateApplicationResponse> getAppliedJobs(User user) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ ứng viên!"));

        List<Application> applications = applicationRepository.findAll()
                .stream()
                .filter(app -> app.getCandidateId().getId().equals(candidate.getId()))
                .toList();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return applications.stream().map(app -> {
            CandidateApplicationResponse dto = new CandidateApplicationResponse();
            dto.setId(app.getId());
            dto.setJobTitle(app.getJobPostId().getTitle());
            dto.setCompanyName(app.getJobPostId().getEmployerId().getCompanyName());
            dto.setCompanyAddress(app.getJobPostId().getEmployerId().getCompanyAddress());
            dto.setStatus(app.getStatus());
            dto.setRejectionReason(app.getRejectionReason());
            dto.setAppliedAt(app.getAppliedAt());

            return dto;
        }).collect(Collectors.toList());
    }

    private CandidateApplicationResponse mapToResponseDTO(Application application) {
        CandidateApplicationResponse dto = modelMapper.map(application, CandidateApplicationResponse.class
        );
        dto.setCandidateId(application.getCandidateId().getId());
        dto.setCandidateName(application.getCandidateId().getUserId().getFullName());
        dto.setJobPostId(application.getJobPostId().getId());
        dto.setJobPostTitle(application.getJobPostId().getTitle());
        dto.setDownloadUrl(application.getResumeFile() + "?fl_attachment=true");
        application.setStatus(ApplicationStatus.PENDING);
        return dto;
    }
}
