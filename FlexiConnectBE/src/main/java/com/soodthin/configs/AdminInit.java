/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.configs;

import com.soodthin.entity.Candidate;
import com.soodthin.entity.Employer;
import com.soodthin.entity.Role;
import com.soodthin.entity.User;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.EmployerRepository;
import com.soodthin.repositories.RoleRepository;
import com.soodthin.repositories.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

/**
 *
 * @author ADMIN
 */
@Component
public class AdminInit {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private EmployerRepository employerRepository;

    @PostConstruct
    public void initAccounts() {
        Role adminRole = roleRepository.findByRoleName("ADMIN")
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setRoleName("ADMIN");
                    return roleRepository.save(r);
                });

        Role candidateRole = roleRepository.findByRoleName("CANDIDATE")
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setRoleName("CANDIDATE");
                    return roleRepository.save(r);
                });

        Role employerRole = roleRepository.findByRoleName("EMPLOYER")
                .orElseGet(() -> {
                    Role r = new Role();
                    r.setRoleName("EMPLOYER");
                    return roleRepository.save(r);
                });

        // 1. Admin Demo Account
        Optional<User> adminOpt = userRepository.findByEmail("admin@example.com");
        if (adminOpt.isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setFullName("Administrator");
            admin.setPassword(passwordEncoder.encode("Admin123"));
            admin.setStatus(User.UserStatus.ACTIVE);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setRoleSet(Set.of(adminRole));
            userRepository.save(admin);
            System.out.println("✅ Tạo tài khoản admin mặc định (admin@example.com) thành công!");
        }

        // 2. Candidate Demo Account (Xem được nhiều flow nhất: Mock Interview, Gợi ý CV, Ứng tuyển)
        Optional<User> candidateOpt = userRepository.findByEmail("candidate@demo.com");
        if (candidateOpt.isEmpty()) {
            User candidateUser = new User();
            candidateUser.setEmail("candidate@demo.com");
            candidateUser.setFullName("Nguyễn Văn Demo (Ứng viên)");
            candidateUser.setPassword(passwordEncoder.encode("123456"));
            candidateUser.setStatus(User.UserStatus.ACTIVE);
            candidateUser.setCreatedAt(LocalDateTime.now());
            candidateUser.setRoleSet(Set.of(candidateRole));
            candidateUser = userRepository.save(candidateUser);

            Candidate candidate = new Candidate();
            candidate.setUserId(candidateUser);
            candidate.setTitle("Senior Fullstack Developer");
            candidate.setBio("Tài khoản demo ứng viên trải nghiệm đầy đủ các tính năng: Luyện phỏng vấn AI, Gợi ý CV, Ứng tuyển việc làm.");
            candidateRepository.save(candidate);
            System.out.println("✅ Tạo tài khoản demo Candidate (candidate@demo.com / 123456) thành công!");
        }

        // 3. Employer Demo Account (Đăng tin tuyển dụng, duyệt ứng viên)
        Optional<User> employerOpt = userRepository.findByEmail("employer@demo.com");
        if (employerOpt.isEmpty()) {
            User employerUser = new User();
            employerUser.setEmail("employer@demo.com");
            employerUser.setFullName("TechCorp HR Manager");
            employerUser.setPassword(passwordEncoder.encode("123456"));
            employerUser.setStatus(User.UserStatus.ACTIVE);
            employerUser.setCreatedAt(LocalDateTime.now());
            employerUser.setRoleSet(Set.of(employerRole));
            employerUser = userRepository.save(employerUser);

            Employer employer = new Employer();
            employer.setUserId(employerUser);
            employer.setCompanyName("TechCorp Vietnam");
            employer.setIsVerified(true);
            employer.setCompanyAddress("Quận 1, TP. Hồ Chí Minh");
            employer.setCompanyIntro("Công ty công nghệ đối tác tuyển dụng chiến lược của FlexiConnect.");
            employerRepository.save(employer);
            System.out.println("✅ Tạo tài khoản demo Employer (employer@demo.com / 123456) thành công!");
        }
    }
}
