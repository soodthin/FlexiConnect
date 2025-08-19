/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.User;
import com.soodthin.entity.User.UserStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
/**
 *
 * @author ADMIN
 */
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    // Count
    long countByRoleSet_RoleName(String roleName);
    long countByStatus(User.UserStatus status);

    // Find with pagination
    Page<User> findByRoleSet_RoleNameOrderByCreatedAtDesc(String roleName, Pageable pageable);

    Page<User> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByCreatedAtDesc(
        String fullName, String email, Pageable pageable);

    Page<User> findByRoleSet_RoleNameAndFullNameContainingIgnoreCaseOrderByCreatedAtDesc(
        String roleName, String fullName, Pageable pageable);

    Page<User> findByRoleSet_RoleNameAndEmailContainingIgnoreCaseOrderByCreatedAtDesc(
        String roleName, String email, Pageable pageable);

    // Statistics
    List<User> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}

