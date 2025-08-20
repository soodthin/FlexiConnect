/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.soodthin.dto.EmployerDTO;
import com.soodthin.dto.response.AdminDashboardResponse;
import com.soodthin.dto.response.EmployerVerificationResponse;
import com.soodthin.dto.response.UserManagementResponse;
import com.soodthin.dto.request.UserStatusUpdateRequest;
import com.soodthin.dto.request.EmployerVerificationRequest;
import com.soodthin.entity.Employer;
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

import java.util.logging.Logger;

/**
 *
 * @author ADMIN
 */
@RestController
@RequestMapping("/api/users/admin")
public class AdminController {

    private static final Logger log = Logger.getLogger(AdminController.class.getName());

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
            log.severe("Error retrieving dashboard stats: " + e.getMessage());
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
            log.severe("Error retrieving users: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/employers/pending-verifications")
    public ResponseEntity<Page<EmployerVerificationResponse>> getPendingVerifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info(String.format("GET /api/admin/employers/pending-verifications - page: %d, size: %d", page, size));

        try {
            Page<EmployerVerificationResponse> employers = adminService.getPendingEmployerVerifications(page, size);
            return ResponseEntity.ok(employers);
        } catch (Exception e) {
            log.severe("Error retrieving pending verifications: " + e.getMessage());
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
            log.severe("Error updating user status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.severe("Error updating user status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/employers/{employerId}/verification")
    public ResponseEntity<EmployerVerificationResponse> updateEmployerVerification(
            @PathVariable Integer employerId,
            @RequestBody EmployerVerificationRequest request) {

        log.info(String.format("PUT /api/admin/employers/%d/verification - verified: %s", employerId, request.getIsVerified()));

        try {
            EmployerVerificationResponse employer = adminService.updateEmployerVerification(employerId, request);
            return ResponseEntity.ok(employer);
        } catch (RuntimeException e) {
            log.severe("Error updating employer verification: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.severe("Error updating employer verification: " + e.getMessage());
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
            log.severe("Error deleting user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.severe("Error deleting user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
