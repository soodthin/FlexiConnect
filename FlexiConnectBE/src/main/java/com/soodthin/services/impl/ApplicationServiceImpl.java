/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.soodthin.dto.request.ApplicationReviewRequest;
import com.soodthin.dto.request.NotificationRequest;
import com.soodthin.dto.response.CandidateApplicationResponse;
import com.soodthin.dto.response.EmployerApplicationResponse;
import com.soodthin.entity.Application;
import com.soodthin.entity.Application.ApplicationStatus;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.Employer;
import com.soodthin.entity.JobPost;
import com.soodthin.entity.Notification;
import com.soodthin.entity.User;
import com.soodthin.repositories.ApplicationRepository;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.EmployerRepository;
import com.soodthin.repositories.JobPostRepository;
import com.soodthin.services.ApplicationService;
import com.soodthin.services.EmailService;
import com.soodthin.services.NotificationService;
import java.util.UUID;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
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
    @Autowired
    private EmailService emailService;
    @Autowired
    private NotificationService notificationService;

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

        try {
            // Gửi mail cho ỨNG VIÊN
            emailService.sendHtmlMessage(
                    candidate.getUserId().getEmail(),
                    "Ứng tuyển thành công",
                    "<p>Chào <b>" + candidate.getUserId().getFullName() + "</b>,</p>"
                    + "<p>Bạn đã ứng tuyển thành công vào vị trí: <b>" + jobPost.getTitle() + "</b> tại công ty <b>"
                    + jobPost.getEmployerId().getCompanyName() + "</b>.</p>"
                    + "<p>Chúng tôi sẽ xem xét hồ sơ và phản hồi trong thời gian sớm nhất.</p>"
                    + "<p>Trân trọng!</p>"
            );

            // Gửi mail cho NHÀ TUYỂN DỤNG (HR)
            emailService.sendHtmlMessage(
                    jobPost.getEmployerId().getUserId().getEmail(), // email HR
                    "Ứng viên mới ứng tuyển",
                    "<p>Kính gửi <b>" + jobPost.getEmployerId().getCompanyName() + "</b>,</p>"
                    + "<p>Có một ứng viên mới vừa ứng tuyển vào vị trí <b>" + jobPost.getTitle() + "</b>.</p>"
                    + "<p><b>Thông tin ứng viên:</b></p>"
                    + "<ul>"
                    + "  <li>Họ tên: " + candidate.getUserId().getFullName() + "</li>"
                    + "  <li>Email: " + candidate.getUserId().getEmail() + "</li>"
                    + "  <li>Số điện thoại: " + (candidate.getUserId().getPhone() != null ? candidate.getUserId().getPhone() : "Chưa cập nhật") + "</li>"
                    + "  <li>CV: <a href='" + resumeFile + "' target='_blank'>Xem CV</a></li>"
                    + "</ul>"
                    + "<p>Vui lòng đăng nhập hệ thống để xem chi tiết hồ sơ ứng tuyển.</p>"
                    + "<p>Trân trọng!</p>"
            );
        } catch (Exception e) {
            System.err.println("Không thể gửi email xác nhận: " + e.getMessage());
        }

        try {
            notificationService.createNotification(
                    NotificationRequest.builder()
                            .userId(jobPost.getEmployerId().getUserId().getId())
                            .title("Ứng viên mới ứng tuyển")
                            .content(candidate.getUserId().getFullName() + " vừa ứng tuyển vào job: " + jobPost.getTitle())
                            .type(Notification.NotificationType.APPLICATION_STATUS)
                            .linkTo("/employer/applications/" + application.getId())
                            .build()
            );
        } catch (Exception e) {
            System.err.println("Không thể gửi notification: " + e.getMessage());
        }

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

        // 🔹 Gửi email kết quả duyệt hồ sơ
        try {
            String subject;
            String body;

            String candidateName = application.getCandidateId().getUserId().getFullName();
            String jobTitle = application.getJobPostId().getTitle();
            String companyName = employer.getCompanyName();

            if (request.getStatus() == ApplicationStatus.ACCEPTED) {
                subject = "Hồ sơ đã được duyệt - " + companyName;
                body = "<p>Chào <b>" + candidateName + "</b>,</p>"
                        + "<p>Chúc mừng! Hồ sơ của bạn cho vị trí <b>" + jobTitle + "</b> tại <b>" + companyName + "</b> đã được <span style='color:green;'>duyệt</span> và sẽ chuyển qua vòng tiếp theo.</p>"
                        + "<p>Chúng tôi sẽ liên hệ với bạn sớm để thông báo chi tiết.</p>"
                        + "<p>Trân trọng,<br/><b>" + companyName + "</b></p>";
            } else if (request.getStatus() == ApplicationStatus.REJECTED) {
                subject = "Hồ sơ bị từ chối - " + companyName;
                body = "<p>Chào <b>" + candidateName + "</b>,</p>"
                        + "<p>Rất tiếc, hồ sơ của bạn cho vị trí <b>" + jobTitle + "</b> tại <b>" + companyName + "</b> đã bị <span style='color:red;'>từ chối</span>.</p>"
                        + "<p><b>Lý do:</b> " + request.getReason() + "</p>"
                        + "<p>Chúc bạn may mắn trong những cơ hội tiếp theo.</p>"
                        + "<p>Trân trọng,<br/><b>" + companyName + "</b></p>";
            } else {
                subject = "Cập nhật hồ sơ ứng tuyển - " + companyName;
                body = "<p>Chào <b>" + candidateName + "</b>,</p>"
                        + "<p>Hồ sơ của bạn đã được cập nhật trạng thái: <b>" + request.getStatus() + "</b>.</p>"
                        + "<p>Trân trọng,<br/><b>" + companyName + "</b></p>";
            }

            emailService.sendHtmlMessage(
                    application.getCandidateId().getUserId().getEmail(),
                    subject,
                    body
            );
        } catch (Exception e) {
            System.err.println("❌ Không thể gửi email kết quả duyệt hồ sơ: " + e.getMessage());
        }

        try {
            notificationService.createNotification(
                    NotificationRequest.builder()
                            .userId(application.getCandidateId().getUserId().getId())
                            .title(request.getStatus() == ApplicationStatus.ACCEPTED ? "Hồ sơ đã được duyệt" : "Hồ sơ bị từ chối")
                            .content("Hồ sơ của bạn cho vị trí " + application.getJobPostId().getTitle() + " tại " + employer.getCompanyName()
                                    + (request.getStatus() == ApplicationStatus.REJECTED ? " đã bị từ chối" : " đã được duyệt") + ".")
                            .type(Notification.NotificationType.APPLICATION_STATUS)
                            .linkTo("/candidate/applications/" + application.getId())
                            .build()
            );
        } catch (Exception e) {
            System.err.println("❌ Không thể gửi notification: " + e.getMessage());
        }

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

        return applications.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private CandidateApplicationResponse mapToResponseDTO(Application application) {
        CandidateApplicationResponse dto = new CandidateApplicationResponse();

        dto.setId(application.getId());
        dto.setCandidateId(application.getCandidateId().getId());
        dto.setCandidateName(application.getCandidateId().getUserId().getFullName());

        dto.setJobPostId(application.getJobPostId().getId());
        dto.setJobPostTitle(application.getJobPostId().getTitle());

        dto.setCoverLetter(application.getCoverLetter());
        dto.setResumeFile(application.getResumeFile());
        if (application.getResumeFile() != null) {
            dto.setDownloadUrl(application.getResumeFile() + "?fl_attachment=true");
        }

        dto.setStatus(application.getStatus());
        dto.setRejectionReason(application.getRejectionReason());
        dto.setAppliedAt(application.getAppliedAt());

        // Thông tin job
        dto.setCompanyName(application.getJobPostId().getEmployerId().getCompanyName());
        dto.setJobTitle(application.getJobPostId().getTitle());
        dto.setLocation(application.getJobPostId().getLocation());
        dto.setDescription(application.getJobPostId().getDescription());
        dto.setSalaryMin(application.getJobPostId().getSalaryMin());
        dto.setSalaryMax(application.getJobPostId().getSalaryMax());
        dto.setJobType(application.getJobPostId().getJobType());

        return dto;
    }

}
