/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.EmployerRegisterDTO;
import com.soodthin.dto.CandidateRegisterDTO;
import com.soodthin.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author ADMIN
 */
@Service
public interface UserService extends UserDetailsService {

    User registerCandidate(CandidateRegisterDTO userRegisterDTO);

    User registerEmployer(EmployerRegisterDTO employerDTO, MultipartFile[] images);

    User getUserByEmail(String email);

    boolean authenticate(String email, String password);
}
