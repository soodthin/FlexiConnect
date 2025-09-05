/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response.AI;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;
/**
 *
 * @author ADMIN
 */
@Data
public class N8nAnalysisResponse {
    @JsonProperty("ai_score")
    private Integer aiScore;
    
    @JsonProperty("feedback")
    private String feedback;
    
    @JsonProperty("strengths")
    private String strengths;
    
    @JsonProperty("weaknesses")
    private String weaknesses;
    
    @JsonProperty("suggested_answer")
    private String suggestedAnswer;
}
