package com.soodthin.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.soodthin.dto.EmployerRegisterDTO;
import com.soodthin.dto.CandidateRegisterDTO;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.Employer;
import com.soodthin.entity.Role;
import com.soodthin.entity.User;
import com.soodthin.entity.User.UserStatus;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.EmployerRepository;
import com.soodthin.repositories.RoleRepository;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.EmailService;
import com.soodthin.services.UserService;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder; // Thêm import này
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service("userDetailsService")
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;

    @Override
    public User registerCandidate(CandidateRegisterDTO dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }

        User user = modelMapper.map(dto, User.class);
        Role candidateRole = roleRepository.findByRoleName("CANDIDATE")
                .orElseThrow(() -> new IllegalArgumentException("Vai trò 'CANDIDATE' không tồn tại."));

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus(UserStatus.ACTIVE); // ✅ Kích hoạt ngay, không cần xác thực
        user.setCreatedAt(LocalDateTime.now());
        user.setRoleSet(Set.of(candidateRole));
        user = userRepository.save(user);

        Candidate candidate = new Candidate();
        candidate.setUserId(user);
        candidateRepository.save(candidate);

        try {
            emailService.sendHtmlMessage(
                    user.getEmail(),
                    "Chào mừng đến với FlexiConnect",
                    "<p>Kính chào <b>" + user.getFullName() + "</b>,</p>"
                    + "<p>Bạn đã đăng ký tài khoản ứng viên thành công trên <b>FlexiConnect</b>.</p>"
                    + "<p>Từ bây giờ, bạn có thể:</p>"
                    + "<ul>"
                    + "  <li>Tìm kiếm và ứng tuyển các công việc phù hợp</li>"
                    + "  <li>Theo dõi trạng thái ứng tuyển của mình</li>"
                    + "  <li>Kết nối nhanh chóng với các nhà tuyển dụng</li>"
                    + "</ul>"
                    + "<p>Chúc bạn sớm tìm được công việc phù hợp và thành công trong sự nghiệp.</p>"
                    + "<p>Trân trọng,<br/><b>FlexiConnect</b></p>"
            );
        } catch (Exception e) {
            System.err.println("Không thể gửi email chào mừng: " + e.getMessage());
        }

        return user;
    }

    @Override
    public User registerEmployer(EmployerRegisterDTO employerDTO, MultipartFile[] images) {
        if (userRepository.findByEmail(employerDTO.getUser().getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }

        User user = modelMapper.map(employerDTO.getUser(), User.class);
        Role employerRole = roleRepository.findByRoleName("EMPLOYER")
                .orElseThrow(() -> new IllegalArgumentException("Vai trò 'EMPLOYER' không tồn tại."));

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus(UserStatus.INACTIVE);
        user.setCreatedAt(LocalDateTime.now());
        user.setRoleSet(Set.of(employerRole));
        user = userRepository.save(user);

        Employer employer = modelMapper.map(employerDTO, Employer.class);
        employer.setUserId(user);
        employer.setTaxCode(employerDTO.getTaxCode());
        employer.setIsVerified(false);
        employer.setCompanyIntro(buildCompanyIntro(employerDTO.getCompanyIntro(), images));
        employerRepository.save(employer);

        try {
            emailService.sendHtmlMessage(
                    user.getEmail(),
                    "Chào mừng đến với FlexiConnect",
                    "<p>Kính chào <b>" + employer.getCompanyName() + "</b>,</p>"
                    + "<p>Bạn đã đăng ký tài khoản nhà tuyển dụng thành công trên <b>FlexiConnect</b>.</p>"
                    + "<p>Từ bây giờ, bạn có thể:</p>"
                    + "<ul>"
                    + "  <li>Đăng tin tuyển dụng và thu hút ứng viên</li>"
                    + "  <li>Quản lý hồ sơ ứng viên tập trung</li>"
                    + "  <li>Kết nối nhanh chóng với nhân tài tiềm năng</li>"
                    + "</ul>"
                    + "<p>Chúc quý công ty sớm tìm được những ứng viên phù hợp nhất.</p>"
                    + "<p>Trân trọng,<br/><b>FlexiConnect</b></p>"
            );
        } catch (Exception e) {
            System.err.println("Không thể gửi email chào mừng: " + e.getMessage());
        }

        return user;
    }

    private String buildCompanyIntro(String introText, MultipartFile[] images) {
        StringBuilder intro = new StringBuilder();
        if (introText != null) {
            intro.append(introText);
        }
        intro.append("<div class='company-gallery'>");

        for (MultipartFile file : images) {
            try {
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                String imageUrl = uploadResult.get("secure_url").toString();
                intro.append("<img src='").append(imageUrl).append("' alt='company image' />");
            } catch (IOException e) {
                throw new RuntimeException("Tải ảnh lên thất bại: " + file.getOriginalFilename(), e);
            }
        }

        intro.append("</div>");
        return intro.toString();
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy email: " + email));
    }

    @Override
    public boolean authenticate(String email, String rawPassword) {
        User user = getUserByEmail(email);
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = getUserByEmail(email);
        return (UserDetails) user;
    }
}
