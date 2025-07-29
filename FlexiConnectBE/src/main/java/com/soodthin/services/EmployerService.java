/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.request.EmployerProfileRequest;
import com.soodthin.dto.response.EmployerProfileResponse;
import com.soodthin.entity.User;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author ADMIN
 */
public interface EmployerService {

    EmployerProfileResponse getProfile(User user);

    void updateProfile(User user, EmployerProfileRequest request);

    String updateAvatar(User user, MultipartFile avatar);
}
