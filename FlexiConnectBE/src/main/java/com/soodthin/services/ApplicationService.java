/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.response.ApplicationResponseDTO;
import com.soodthin.entity.User;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author ADMIN
 */
public interface ApplicationService {

    ApplicationResponseDTO applyToJob(Integer jobPostId, MultipartFile cvFile, User user);

}
