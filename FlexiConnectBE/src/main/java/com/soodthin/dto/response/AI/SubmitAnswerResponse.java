/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response.AI;

import com.soodthin.dto.SessionStatistics;
import lombok.*;

/**
 *
 * @author ADMIN
 */
@Data
@AllArgsConstructor
public class SubmitAnswerResponse {
    private TurnResponse currentTurn;
    private GenerateQuestionResponse nextQuestion; 
    private SessionStatistics sessionStats;
}
