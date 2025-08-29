/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.Application;
import com.soodthin.entity.Employer;
import com.soodthin.entity.EmployerEmailLog;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author ADMIN
 */
public interface EmployerEmailLogRepository extends JpaRepository<EmployerEmailLog, Integer> {

    List<EmployerEmailLog> findByApplicationId(Application applicationId);

    List<EmployerEmailLog> findByEmployerId(Employer employerId);


}
