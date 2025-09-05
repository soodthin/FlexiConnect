/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response.AI;
import lombok.*;
import java.time.LocalDateTime;

/**
 *
 * @author ADMIN
 */

@Data
@AllArgsConstructor
public class TurnResponse {
    private Integer id;
    private String question;
    private String answer;
    private String aiFeedback;
    private Integer aiScore;
    private Integer turnOrder;
    private LocalDateTime createdAt;
    
    
}