/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.entity.Candidate;
import com.soodthin.entity.Employer;
import com.soodthin.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 *
 * @author ADMIN
 */
public interface UserService extends UserDetailsService {

    User registerCandidate(Candidate candidate);

    User registerEmployer(Employer employer);

    User getUserByEmail(String email);

    boolean authenticate(String email, String password);
}
