/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.Employer;
import com.soodthin.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author ADMIN
 */
public interface EmployerRepository extends JpaRepository<Employer, Integer>{
    Optional<Employer> findByUserId(User userId); 
Optional<Employer> findByCompanyName(String companyName);

}
    