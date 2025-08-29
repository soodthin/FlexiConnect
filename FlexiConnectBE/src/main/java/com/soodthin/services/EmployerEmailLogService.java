/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.request.EmployerEmailRequest;
import com.soodthin.dto.response.EmployerEmailLogResponse;
import com.soodthin.entity.User;
import java.util.List;

/**
 *
 * @author ADMIN
 */
public interface EmployerEmailLogService {

    List<EmployerEmailLogResponse> getEmailLogsByApplication(User user, Integer applicationId);

    EmployerEmailLogResponse sendEmailToCandidate(User user, EmployerEmailRequest request);

}
