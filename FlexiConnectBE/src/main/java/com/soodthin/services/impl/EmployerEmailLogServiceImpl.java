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
import java.time.format.DateTimeFormatter;
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
        String jobType = app.getJobPostId().getJobType();

        String interviewTime = null;
        if (request.getInterviewTime() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            interviewTime = request.getInterviewTime().format(formatter);
        }

        return switch (actionType) {
            case INTERVIEW_INVITE ->
                String.format("""
        <p>Kính chào %s,</p>
        <p>Cảm ơn bạn đã quan tâm và ứng tuyển vào vị trí <b>%s</b> tại <b>%s</b>.</p>
        <p>Sau khi xem xét hồ sơ, chúng tôi trân trọng mời bạn tham dự buổi phỏng vấn để trao đổi chi tiết hơn.</p>
        <p><b>Thời gian:</b> %s<br>
           <b>Link phỏng vấn:</b> <a href="%s" target="_blank">%s</a></p>
        <p>Rất mong bạn sắp xếp thời gian và phản hồi xác nhận tham dự trong thời gian sớm nhất.</p>
        <p>Trân trọng,<br/>%s</p>
        """,
                candidateName, jobTitle, company,
                interviewTime, request.getLocation(), request.getLocation(), company);

            case INTERVIEW_RESULT ->
                """
                <p>Kính chào %s,</p>
                <p>Chúng tôi xin gửi đến bạn kết quả phỏng vấn cho vị trí <b>%s</b>: <b>%s</b>.</p>
                <p>Cảm ơn bạn đã dành thời gian trao đổi cùng chúng tôi.</p>
                <p>Chúc bạn luôn thành công và may mắn trên con đường sự nghiệp.</p>
                <p>Trân trọng,<br/>%s</p>
                """.formatted(candidateName, jobTitle, request.getResult(), company);

            case REQUEST_DOCUMENTS ->
                """
                <p>Kính chào %s,</p>
                <p>Trong quá trình rà soát hồ sơ ứng tuyển vị trí <b>%s</b> tại <b>%s</b>, chúng tôi nhận thấy còn thiếu một số giấy tờ cần thiết.</p>
                <p>Để hoàn thiện, bạn vui lòng bổ sung các tài liệu sau: %s</p>
                <p>Việc bổ sung đầy đủ hồ sơ sẽ giúp chúng tôi tiến hành các bước tiếp theo nhanh chóng và thuận lợi hơn.</p>
                <p>Trân trọng,<br/>%s</p>
                """.formatted(candidateName, jobTitle, company, request.getDocuments(), company);

            case OFFER_LETTER ->
                """
                <p>Kính chào %s,</p>
                <p>Chúc mừng bạn đã xuất sắc vượt qua toàn bộ vòng tuyển dụng và chính thức được lựa chọn cho vị trí <b>%s</b> tại <b>%s</b>.</p>
                <p><b>Thông tin công việc:</b></p>
                <ul>
                    <li><b>Vị trí:</b> %s</li>
                    <li><b>Mức lương:</b> %s triệu</li>
                    <li><b>Hình thức làm việc:</b> %s</li>
                    <li><b>Ngày bắt đầu dự kiến:</b> %s</li>
                </ul>
                <p>Chúng tôi tin rằng sự đồng hành của bạn sẽ mang lại nhiều giá trị và thành công chung. Vui lòng xác nhận phản hồi để chúng tôi hoàn tất thủ tục tiếp theo.</p>
                <p>Trân trọng,<br/>%s</p>
                """.formatted(candidateName, jobTitle, company,
                jobTitle,
                request.getSalary(),
                jobType,
                request.getStartDate(),
                company);

            case INTERVIEW_CANCEL ->
                """
                <p>Kính chào %s,</p>
                <p>Rất tiếc phải thông báo rằng buổi phỏng vấn cho vị trí <b>%s</b> tại <b>%s</b> đã bị hoãn/hủy do một số lý do khách quan.</p>
                <p>Chúng tôi sẽ sớm liên hệ lại với bạn để sắp xếp lịch phỏng vấn khác phù hợp hơn.</p>
                <p>Rất mong bạn thông cảm và tiếp tục đồng hành cùng chúng tôi.</p>
                <p>Trân trọng,<br/>%s</p>
                """.formatted(candidateName, jobTitle, company, company);
        };
    }

}
