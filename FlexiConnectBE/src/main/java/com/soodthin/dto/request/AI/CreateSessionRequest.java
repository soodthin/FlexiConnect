/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.request.AI;

import com.soodthin.entity.Candidate;
import com.soodthin.entity.JobPost;
import lombok.Data;

/**
 *
 * @author ADMIN
 */

@Data
public class CreateSessionRequest {

    private Candidate candidateId;
    private JobPost jobPostId;
}
