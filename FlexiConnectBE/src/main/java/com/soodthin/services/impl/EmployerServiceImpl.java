package com.soodthin.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.soodthin.dto.request.EmployerProfileRequest;
import com.soodthin.dto.response.EmployerProfileResponse;
import com.soodthin.entity.Employer;
import com.soodthin.entity.User;
import com.soodthin.repositories.EmployerRepository;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.EmployerService;
import jakarta.transaction.Transactional;
import java.util.Map;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class EmployerServiceImpl implements EmployerService {

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public EmployerProfileResponse getProfile(User user) {
        Employer employer = employerRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ nhà tuyển dụng!"));

        return mapToResponse(user, employer);
    }

    @Override
    public void updateProfile(User user, EmployerProfileRequest request) {
        Employer employer = employerRepository.findByUserId(user)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy hồ sơ nhà tuyển dụng!"));

        modelMapper.map(request, user);
        userRepository.save(user);

        modelMapper.map(request, employer);
        employerRepository.save(employer);
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

    private EmployerProfileResponse mapToResponse(User user, Employer employer) {
        EmployerProfileResponse response = modelMapper.map(employer, EmployerProfileResponse.class);
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setPhoneNumber(user.getPhone());
        response.setAvatar(user.getAvatar());
        response.setCompanyAddress(employer.getCompanyAddress());
        response.setWebsite(employer.getWebsite());
        response.setCompanyIntro(employer.getCompanyIntro());
        return response;
    }
}
