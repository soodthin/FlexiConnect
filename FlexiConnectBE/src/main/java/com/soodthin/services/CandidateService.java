/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.request.CandidateProfileRequest;
import com.soodthin.dto.response.CandidateProfileResponse;
import com.soodthin.entity.User;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author ADMIN
 */
public interface CandidateService {

    CandidateProfileResponse getProfile(User user);

    void updateProfile(User user, CandidateProfileRequest request);

    String updateAvatar(User user, MultipartFile avatar);
}
