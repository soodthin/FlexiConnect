/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.soodthin.dto.request.CandidateProfileRequest;
import com.soodthin.dto.response.CandidateProfileResponse;
import com.soodthin.dto.response.UserPackageResponse;
import com.soodthin.entity.Candidate;
import com.soodthin.entity.User;
import com.soodthin.entity.UserPackage;
import com.soodthin.repositories.CandidateRepository;
import com.soodthin.repositories.UserPackageRepository;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.CandidateService;
import jakarta.transaction.Transactional;
import java.util.Map;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

/**
 *
 * @author ADMIN
 */
@Service
@Transactional
public class CandidateServiceImpl implements CandidateService {

    @Autowired
    private CandidateRepository candidateRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private UserPackageRepository userPackageRepository;

     @Override
    public Candidate getCandidateByUser(User user) {
        return candidateRepository.findByUserId(user)
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));
    }
    @Override
    public CandidateProfileResponse getProfile(User user) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ ứng viên!"
        ));

        CandidateProfileResponse response = new CandidateProfileResponse();
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhone());
        response.setAddress(user.getAddress());
        response.setAvatar(user.getAvatar());
        response.setDateOfBirth(user.getDateOfBirth());
        response.setGender(user.getGender());

        response.setTitle(candidate.getTitle());
        response.setBio(candidate.getBio());
        response.setResumeFile(candidate.getResumeFile());

        UserPackage userPackage = userPackageRepository.findByUserId(user)
                .orElse(null);

        if (userPackage != null) {
            UserPackageResponse packageResponse = new UserPackageResponse();
            packageResponse.setId(userPackage.getId());
            packageResponse.setIsActive(userPackage.getIsActive());
            packageResponse.setStartDate(userPackage.getStartDate());
            packageResponse.setEndDate(userPackage.getEndDate());

            if (userPackage.getPackageId() != null) {
                packageResponse.setName(userPackage.getPackageId().getName());
            }

            response.setUserPackage(packageResponse);
        }

        return response;
    }

    @Override
    public void updateProfile(User user, CandidateProfileRequest request) {
        Candidate candidate = candidateRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ ứng viên!"));

        modelMapper.map(request, candidate);
        candidateRepository.save(candidate);

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setAvatar(request.getAvatar());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setGender(request.getGender());
        userRepository.save(user);
    }

    @Override
    public String updateAvatar(User user, MultipartFile avatar) {
        try {
            Map uploadResult = cloudinary.uploader().upload(avatar.getBytes(), ObjectUtils.emptyMap());
            String url = uploadResult.get("secure_url").toString();
            user.setAvatar(url);
            userRepository.save(user);
            return url;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi cập nhật ảnh đại diện!");
        }
    }

}
