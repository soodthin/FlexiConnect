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
public class N8nQuestionRequest {
    private String jobTitle;
    private String jobDescription;
    private String difficulty;
    private String category;
    private Integer questionNumber; 

   
    
}
