/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.soodthin.dto.EmployerRegisterDTO;
import com.soodthin.dto.CandidateRegisterDTO;
import com.soodthin.dto.request.UserLoginRequest;
import com.soodthin.dto.response.UserLoginResponse;
import com.soodthin.entity.User;
import com.soodthin.services.UserService;
import com.soodthin.utils.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
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
    

     @PostMapping("/register/candidate")
    public ResponseEntity<?> registerCandidate(@RequestBody CandidateRegisterDTO userRegisterDTO) {
        try {
            User savedUser = userService.registerCandidate(userRegisterDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = "/register/employer", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerEmployer(
            @RequestPart("employer") EmployerRegisterDTO employerDTO,
            @RequestPart("images") MultipartFile[] images
    ) {
        try {
            User savedUser = userService.registerEmployer(employerDTO, images);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest loginRequest) {
        if (userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword())) {
            try {
                User user = userService.getUserByEmail(loginRequest.getEmail());
                String role = user.getRoleSet().iterator().next().getRoleName();
                String token = JwtUtils.generateToken(user.getEmail(), role);

                UserLoginResponse resp = new UserLoginResponse();
                resp.setToken(token);
                resp.setEmail(user.getEmail());
                resp.setRole(role);
                resp.setFullName(user.getFullName());

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
            
            UserLoginResponse resp = new UserLoginResponse();
            resp.setEmail(user.getEmail());
            resp.setFullName(user.getFullName());
            resp.setRole(user.getRoleSet().iterator().next().getRoleName());

            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Lỗi xác thực token!");
        }
    }

}
