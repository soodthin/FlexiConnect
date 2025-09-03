/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.User;
import com.soodthin.entity.UserPackage;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author ADMIN
 */
@Repository
public interface UserPackageRepository extends JpaRepository<UserPackage, Integer> {

    Optional<UserPackage> findByUserId(User user);

    Optional<UserPackage> findTopByUserIdOrderByEndDateDesc(User user);

}
