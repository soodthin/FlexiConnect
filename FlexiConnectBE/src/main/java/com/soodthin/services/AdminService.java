/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.request.EmployerVerificationRequest;
import com.soodthin.dto.request.UserStatusUpdateRequest;
import com.soodthin.dto.response.AdminDashboardResponse;
import com.soodthin.dto.response.EmployerVerificationResponse;
import com.soodthin.dto.response.UserManagementResponse;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

/**
 *
 * @author ADMIN
 */
@Service
public interface AdminService {

    AdminDashboardResponse getDashboardStats();

    Page<UserManagementResponse> getUsers(String role, String search, int page, int size);

    Page<EmployerVerificationResponse> getPendingEmployerVerifications(int page, int size);

    Page<EmployerVerificationResponse> getEmployers(Boolean verified, String search, int page, int size);

    UserManagementResponse updateUserStatus(Integer userId, UserStatusUpdateRequest request);

    EmployerVerificationResponse updateEmployerVerification(Integer employerId, EmployerVerificationRequest request);

    void deleteUser(Integer userId);
}
