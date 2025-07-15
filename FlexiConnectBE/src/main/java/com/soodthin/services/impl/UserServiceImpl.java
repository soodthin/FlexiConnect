package com.soodthin.services.impl;

import com.soodthin.entity.Candidate;
import com.soodthin.entity.Employer;
import com.soodthin.entity.Role;
import com.soodthin.entity.User;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.EmployerRepository;
import com.soodthin.repositories.RoleRepository;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.UserService;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
    private BCryptPasswordEncoder passwordEncoder;

    
    @Override
    public User registerCandidate(Candidate candidate) {
        User user = candidate.getUserId();
        if (user == null || user.getEmail() == null) {
            throw new IllegalArgumentException("Thông tin người dùng không hợp lệ.");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }

        Role candidateRole = roleRepository.findByRoleName("CANDIDATE")
                .orElseThrow(() -> new IllegalArgumentException("Vai trò 'CANDIDATE' không tồn tại."));

        user.setFullName(user.getFullName());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus("ACTIVE");
        user.setCreatedAt(LocalDateTime.now());
        user.setRoleSet(Set.of(candidateRole));

        user = userRepository.save(user);

        candidate.setUserId(user);
        candidateRepository.save(candidate);

        return user;
    }

    @Override
    public User registerEmployer(Employer employer) {
        User user = employer.getUserId();
        if (user == null || user.getEmail() == null) {
            throw new IllegalArgumentException("Thông tin người dùng không hợp lệ.");
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }

        Role employerRole = roleRepository.findByRoleName("EMPLOYER")
                .orElseThrow(() -> new IllegalArgumentException("Vai trò 'EMPLOYER' không tồn tại."));

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus("ACTIVE");
        user.setCreatedAt(LocalDateTime.now());
        user.setRoleSet(Set.of(employerRole));

        user = userRepository.save(user);

        employer.setUserId(user);
        employer.setIsVerified(false);
        employerRepository.save(employer);

        return user;
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

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRoleSet().stream().map(Role::getRoleName).toArray(String[]::new))
                .build();
    }
    
}
