package com.soodthin.services.impl;

import com.soodthin.dto.request.EmployerEmailRequest;
import com.soodthin.dto.response.EmployerEmailLogResponse;
import com.soodthin.entity.Application;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.Employer;
import com.soodthin.entity.EmployerEmailLog;
import com.soodthin.entity.User;
import com.soodthin.repositories.ApplicationRepository;
import com.soodthin.repositories.EmployerEmailLogRepository;
import com.soodthin.repositories.EmployerRepository;
import com.soodthin.services.EmailService;
import com.soodthin.services.EmployerEmailLogService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EmployerEmailLogServiceImpl implements EmployerEmailLogService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private EmployerEmailLogRepository employerEmailLogRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public List<EmployerEmailLogResponse> getEmailLogsByApplication(User user, Integer applicationId) {
        Employer employer = employerRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.FORBIDDEN, "Không tìm thấy employer"));

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Application không tồn tại"));

        // Check quyền
        if (!application.getJobPostId().getEmployerId().getId().equals(employer.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền xem log email của application này");
        }

        return employerEmailLogRepository.findByApplicationId(application)
                .stream()
                .map(log -> EmployerEmailLogResponse.builder()
                .id(log.getId())
                .applicationId(application.getId())
                .employerId(employer.getId())
                .candidateId(log.getCandidateId().getId())
                .candidateEmail(log.getCandidateId().getUserId().getEmail())
                .actionType(log.getActionType())
                .subject(log.getSubject())
                .content(log.getContent())
                .createdAt(log.getCreatedAt())
                .build())
                .toList();

    }

    @Override
    public EmployerEmailLogResponse sendEmailToCandidate(User user, EmployerEmailRequest request) {
        Employer employer = employerRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.FORBIDDEN, "Không tìm thấy employer"));

        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Application không tồn tại"));

        Candidate candidate = application.getCandidateId();

        // 🔹 Nếu subject/content không được truyền từ request → sinh template tự động theo actionType
        String subject = (request.getSubject() != null && !request.getSubject().isBlank())
                ? request.getSubject()
                : buildSubject(request.getActionType(), application);

        String content = (request.getContent() != null && !request.getContent().isBlank())
                ? request.getContent()
                : buildContent(request.getActionType(), application, employer, candidate, request);

        // 1. Gửi email HTML
        emailService.sendHtmlMessage(
                candidate.getUserId().getEmail(),
                subject,
                content
        );

        // 2. Lưu log
        EmployerEmailLog log = new EmployerEmailLog();
        log.setApplicationId(application);
        log.setEmployerId(employer);
        log.setCandidateId(candidate);
        log.setActionType(request.getActionType());
        log.setSubject(subject);
        log.setContent(content);
        log.setCreatedAt(LocalDateTime.now());

        log = employerEmailLogRepository.save(log);

        // 3. Trả response DTO
        return EmployerEmailLogResponse.builder()
                .id(log.getId())
                .applicationId(application.getId())
                .employerId(employer.getId())
                .candidateId(candidate.getId())
                .candidateEmail(candidate.getUserId().getEmail())
                .actionType(log.getActionType())
                .subject(log.getSubject())
                .content(log.getContent())
                .createdAt(log.getCreatedAt())
                .build();
    }

    // ================== Template xử lý nội dung ==================
    private String buildSubject(EmployerEmailLog.ActionType actionType, Application app) {
        return switch (actionType) {
            case INTERVIEW_INVITE ->
                "Thư mời phỏng vấn - " + app.getJobPostId().getTitle();
            case INTERVIEW_RESULT ->
                "Kết quả phỏng vấn - " + app.getJobPostId().getTitle();
            case REQUEST_DOCUMENTS ->
                "Yêu cầu bổ sung hồ sơ - " + app.getJobPostId().getTitle();
            case OFFER_LETTER ->
                "Thư mời nhận việc - " + app.getJobPostId().getTitle();
            case INTERVIEW_CANCEL ->
                "Hủy lịch phỏng vấn - " + app.getJobPostId().getTitle();
        };
    }

    private String buildContent(EmployerEmailLog.ActionType actionType,
            Application app,
            Employer emp,
            Candidate cand,
            EmployerEmailRequest request) {
        String candidateName = cand.getUserId().getFullName();
        String jobTitle = app.getJobPostId().getTitle();
        String company = emp.getCompanyName();

        return switch (actionType) {
            case INTERVIEW_INVITE ->
                """
            <p>Chào %s,</p>
            <p>Bạn được mời tham gia buổi phỏng vấn cho vị trí <b>%s</b> tại <b>%s</b>.</p>
            <p>Thời gian: %s<br>
               Địa điểm/Link online: %s</p>
            <p>Vui lòng xác nhận sự tham gia của bạn.</p>
            <p>Trân trọng,<br/>%s</p>
            """.formatted(candidateName, jobTitle, company,
                request.getInterviewTime(), request.getLocation(), company);

            case INTERVIEW_RESULT ->
                """
            <p>Chào %s,</p>
            <p>Kết quả phỏng vấn của bạn cho vị trí <b>%s</b>: <b>%s</b>.</p>
            <p>Cảm ơn bạn đã tham gia phỏng vấn.</p>
            <p>Trân trọng,<br/>%s</p>
            """.formatted(candidateName, jobTitle, request.getResult(), company);

            case REQUEST_DOCUMENTS ->
                """
            <p>Chào %s,</p>
            <p>Hồ sơ ứng tuyển của bạn cho vị trí <b>%s</b> còn thiếu giấy tờ.</p>
            <p>Vui lòng bổ sung: %s</p>
            <p>Trân trọng,<br/>%s</p>
            """.formatted(candidateName, jobTitle, request.getDocuments(), company);

            case OFFER_LETTER ->
                """
            <p>Chào %s,</p>
            <p>Chúc mừng bạn đã trúng tuyển vị trí <b>%s</b> tại <b>%s</b>.</p>
            <p>Vui lòng phản hồi email này để xác nhận nhận việc.</p>
            <p>Trân trọng,<br/>%s</p>
            """.formatted(candidateName, jobTitle, company, company);

            case INTERVIEW_CANCEL ->
                """
            <p>Chào %s,</p>
            <p>Buổi phỏng vấn cho vị trí <b>%s</b> tại <b>%s</b> đã bị hủy.</p>
            <p>Chúng tôi sẽ liên hệ lại với bạn để sắp xếp lịch mới nếu cần thiết.</p>
            <p>Trân trọng,<br/>%s</p>
            """.formatted(candidateName, jobTitle, company, company);
        };
    }

}
