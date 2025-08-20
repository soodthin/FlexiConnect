/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.Employer;
import com.soodthin.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author ADMIN
 */
public interface EmployerRepository extends JpaRepository<Employer, Integer> {

    Optional<Employer> findByUserId(User user);

    Optional<Employer> findByCompanyName(String companyName);

    List<Employer> findByIsVerified(Boolean isVerified);

    long countByIsVerified(Boolean isVerified);

    Page<Employer> findByIsVerified(Boolean isVerified, Pageable pageable);

    Page<Employer> findByCompanyNameContainingIgnoreCase(String companyName, Pageable pageable);

    Page<Employer> findByUserId_FullNameContainingIgnoreCase(String fullName, Pageable pageable);

    Page<Employer> findByIsVerifiedAndCompanyNameContainingIgnoreCase(Boolean isVerified, String companyName, Pageable pageable);

    Page<Employer> findByIsVerifiedAndUserId_FullNameContainingIgnoreCase(Boolean isVerified, String fullName, Pageable pageable);
}
