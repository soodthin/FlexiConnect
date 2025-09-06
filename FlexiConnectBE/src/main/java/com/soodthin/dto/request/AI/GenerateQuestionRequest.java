/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.request.AI;

import lombok.*;
/**
 *
 * @author ADMIN
 */
@Data
@AllArgsConstructor
public class GenerateQuestionRequest {
    private String jobTitle;
    private String jobDescription;
    private String difficulty; 
    private String category; 
    private Integer sessionId; 
}
