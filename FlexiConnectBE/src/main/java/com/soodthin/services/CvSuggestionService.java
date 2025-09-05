/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.request.AI.CvSuggestionRequest;
import com.soodthin.dto.request.AI.CvSuggestionSubmitRequest;
import com.soodthin.entity.CvSuggestion;

/**
 *
 * @author ADMIN
 */
public interface CvSuggestionService {

    CvSuggestion createSuggestion(Integer candidateId, CvSuggestionRequest request);

    CvSuggestion submitSuggestion(Integer suggestionId, CvSuggestionSubmitRequest request);
}
