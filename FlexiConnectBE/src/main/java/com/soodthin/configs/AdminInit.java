/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.configs;

import com.soodthin.entity.Role;
import com.soodthin.entity.User;
import com.soodthin.repositories.RoleRepository;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

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
    private UserService userService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void initAdminAccount() {
        Optional<User> adminOpt = userRepository.findByEmail("admin@example.com");
        if (adminOpt.isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setFullName("Administrator");
            admin.setPassword("admin123"); 
            admin.setStatus("ACTIVE");
            admin.setCreatedAt(LocalDateTime.now());

            Role adminRole = roleRepository.findByRoleName("ADMIN")
                    .orElseGet(() -> {
                        Role r = new Role();
                        r.setRoleName("ADMIN");
                        return roleRepository.save(r);
                    });

            admin.setRoleSet(Set.of(adminRole));
            userRepository.save(admin);

            System.out.println("✅ Tạo tài khoản admin mặc định thành công!");
        } else {
            System.out.println("ℹ️ Tài khoản admin đã tồn tại.");
        }
    }
}
