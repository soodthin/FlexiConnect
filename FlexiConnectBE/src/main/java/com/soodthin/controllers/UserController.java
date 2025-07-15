/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.Employer;
import com.soodthin.entity.User;
import com.soodthin.services.UserService;
import com.soodthin.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author ADMIN
 */
@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private Cloudinary cloudinary;

    @PostMapping("/register/candidate")
    public ResponseEntity<?> registerCandidate(@RequestBody Candidate candidate) {
        try {
            User saved = userService.registerCandidate(candidate);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = "/register/employer", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerEmployer(
            @RequestPart("employer") Employer employer,
            @RequestPart("images") MultipartFile[] images
    ) {
        try {
            StringBuilder intro = new StringBuilder();
            intro.append(employer.getCompanyIntro() == null ? "" : employer.getCompanyIntro());

            intro.append("<div class='company-gallery'>");

            for (MultipartFile file : images) {
                Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                String imageUrl = uploadResult.get("secure_url").toString();
                intro.append("<img src='").append(imageUrl).append("' alt='company image' />");
            }

            intro.append("</div>");
            employer.setCompanyIntro(intro.toString());

            User saved = userService.registerEmployer(employer);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User u) {
        if (userService.authenticate(u.getEmail(), u.getPassword())) {
            try {
                User user = userService.getUserByEmail(u.getEmail());

                String role = user.getRoleSet().iterator().next().getRoleName();
                String token = JwtUtils.generateToken(user.getEmail(), role);

                Map<String, Object> resp = new HashMap<>();
                resp.put("token", token);
                resp.put("email", user.getEmail());
                resp.put("role", role);
                return ResponseEntity.ok(resp);
            } catch (Exception e) {
                return ResponseEntity.status(500).body("Lỗi khi tạo JWT");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai thông tin đăng nhập");
    }

    @GetMapping("/current-user")
    public ResponseEntity<?> currentUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Thiếu token!");
        }

        String token = authHeader.substring(7);
        try {
            String email = JwtUtils.validateTokenAndGetUsername(token);
            if (email == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ!");
            }

            User user = userService.getUserByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Không tìm thấy người dùng!");
            }

            Map<String, Object> resp = new HashMap<>();
            resp.put("email", user.getEmail());
            resp.put("fullName", user.getFullName());
            resp.put("role", user.getRoleSet().iterator().next().getRoleName());

            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Lỗi xác thực token!");
        }
    }

}
