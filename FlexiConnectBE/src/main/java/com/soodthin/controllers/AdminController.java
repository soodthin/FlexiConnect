/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.soodthin.dto.EmployerDTO;
import com.soodthin.dto.response.AdminDashboardResponse;
import com.soodthin.dto.response.UserManagementResponse;
import com.soodthin.dto.request.UserStatusUpdateRequest;
import com.soodthin.dto.request.JobPostAdminRequest;
import com.soodthin.dto.response.JobPostAdminResponse;
import com.soodthin.services.AdminService;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

/**
 *
 * @author ADMIN
 */
@Slf4j
@RestController
@RequestMapping("/api/users/admin")
public class AdminController {


    @Autowired
    private AdminService adminService;

    @GetMapping("/employers")
    public ResponseEntity<List<EmployerDTO>> getAllEmployers() {
        return ResponseEntity.ok(adminService.getAllEmployers());
    }

    @PutMapping("/employers/{id}/verify")
    public ResponseEntity<EmployerDTO> verifyEmployer(@PathVariable Integer id) {
        return ResponseEntity.ok(adminService.verifyEmployer(id));
    }

    @PutMapping("/employers/{id}/reject")
    public ResponseEntity<EmployerDTO> rejectEmployer(
            @PathVariable Integer id,
            @RequestBody Map<String, String> body
    ) {
        return ResponseEntity.ok(
                adminService.rejectEmployer(id, body.get("reason"))
        );
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<AdminDashboardResponse> getDashboardStats(
            @RequestParam(required = false) Integer year) {
        log.info("GET /api/admin/dashboard/stats with year=" + year);

        try {
            // Nếu không truyền thì mặc định lấy năm hiện tại
            if (year == null) {
                year = LocalDate.now().getYear();
            }

            AdminDashboardResponse stats = adminService.getDashboardStats(year);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error retrieving dashboard stats: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserManagementResponse>> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info(String.format("GET /api/admin/users - role: %s, search: %s, page: %d, size: %d",
                role, search, page, size));

        try {
            Page<UserManagementResponse> users = adminService.getUsers(role, search, page, size);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Error retrieving users: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<UserManagementResponse> updateUserStatus(
            @PathVariable Integer userId,
            @RequestBody UserStatusUpdateRequest request) {

        log.info(String.format("PUT /api/admin/users/%d/status - status: %s", userId, request.getStatus()));

        try {
            UserManagementResponse user = adminService.updateUserStatus(userId, request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            log.error("Error updating user status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error updating user status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer userId) {
        log.info(String.format("DELETE /api/admin/users/%d", userId));

        try {
            adminService.deleteUser(userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            log.error("Error deleting user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error deleting user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/jobposts")
public ResponseEntity<Page<JobPostAdminResponse>> getJobPosts(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String search,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size) {

    log.info(String.format("GET /api/users/admin/jobposts - status: %s, search: %s, page: %d, size: %d",
            status, search, page, size));

    Page<JobPostAdminResponse> jobPosts = adminService.getJobPosts(status, search, page, size);
    return ResponseEntity.ok(jobPosts);
}


    @PutMapping("/jobposts/{id}/status")
    public ResponseEntity<JobPostAdminResponse> updateJobPostStatus(
            @PathVariable Integer id,
            @RequestBody JobPostAdminRequest request
    ) {
        try {
            JobPostAdminResponse updated = adminService.updateJobPostStatus(id, request.getStatus());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
