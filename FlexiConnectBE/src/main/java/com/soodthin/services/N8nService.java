/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.request.AI.N8nAnalysisRequest;
import com.soodthin.dto.request.AI.N8nQuestionRequest;
import com.soodthin.dto.response.AI.CvSuggestionResponse;
import com.soodthin.dto.response.AI.N8nAnalysisResponse;
import com.soodthin.dto.response.AI.N8nQuestionResponse;

/**
 *
 * @author ADMIN
 */
public interface N8nService {

    CvSuggestionResponse getSuggestionFromAI(String input);

    N8nQuestionResponse n8nForQuestionGeneration(N8nQuestionRequest request) throws Exception;

    N8nAnalysisResponse n8nForAnalysis(N8nAnalysisRequest request) throws Exception;
}
