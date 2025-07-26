package com.soodthin.services.impl;

import com.soodthin.dto.request.EmployerProfileRequest;
import com.soodthin.dto.response.EmployerProfileResponse;
import com.soodthin.entity.Employer;
import com.soodthin.entity.User;
import com.soodthin.repositories.EmployerRepository;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.EmployerService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class EmployerServiceImpl implements EmployerService {

    @Autowired
    private EmployerRepository employerRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public EmployerProfileResponse getProfile(User user) {
        Employer employer = employerRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ nhà tuyển dụng!"));

        EmployerProfileResponse response = new EmployerProfileResponse();
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhone());
        response.setAvatarUrl(user.getAvatar());

        response.setCompanyName(employer.getCompanyName());
        response.setTaxId(employer.getTaxId());
        response.setCompanyAddress(employer.getCompanyAddress());
        response.setWebsite(employer.getWebsite());
        response.setCompanyIntro(employer.getCompanyIntro());

        return response;
    }

    @Override
    public void updateProfile(User user, EmployerProfileRequest request) {
        Employer employer = employerRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ nhà tuyển dụng!"));

        user.setFullName(request.getName());
        user.setPhone(request.getPhoneNumber());
        user.setAvatar(request.getAvatarUrl());
        userRepository.save(user);

        employer.setCompanyName(request.getCompanyName());
        employer.setTaxId(request.getTaxId());
        employer.setCompanyAddress(request.getCompanyAddress());
        employer.setWebsite(request.getWebsite());
        employer.setCompanyIntro(request.getCompanyIntro());
        employerRepository.save(employer);
    }

}
