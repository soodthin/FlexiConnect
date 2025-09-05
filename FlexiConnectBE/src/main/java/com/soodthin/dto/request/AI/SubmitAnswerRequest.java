/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.request.AI;

import lombok.Data;

/**
 *
 * @author ADMIN
 */
@Data
public class SubmitAnswerRequest {

    private Integer sessionId;
    private String question;
    private String answer;

}
