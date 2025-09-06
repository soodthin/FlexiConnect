/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.request.AI.CreateSessionRequest;
import com.soodthin.dto.request.AI.GenerateQuestionRequest;
import com.soodthin.dto.request.AI.SubmitAnswerRequest;
import com.soodthin.dto.response.AI.GenerateQuestionResponse;
import com.soodthin.dto.response.AI.SessionResponse;
import com.soodthin.dto.response.AI.SubmitAnswerResponse;
import com.soodthin.dto.response.AI.TurnResponse;
import com.soodthin.entity.User;
import java.util.List;

/**
 *
 * @author ADMIN
 */
public interface InterviewService {

    SessionResponse createSession(User user, CreateSessionRequest request);

    TurnResponse submitAnswer(User user, SubmitAnswerRequest request) throws Exception;

   SubmitAnswerResponse submitAnswerNextQuest(User user, Integer sessionId, SubmitAnswerRequest request) throws Exception;

    SessionResponse completeSession(User user, Integer sessionId);

    List<TurnResponse> getSessionTurns(User user, Integer sessionId);

    SessionResponse getSession(User user, Integer sessionId);

    GenerateQuestionResponse generateQuestion(User user, GenerateQuestionRequest request) throws Exception;

    GenerateQuestionResponse generateContextualQuestion(User user, Integer sessionId,
            String difficulty, String category) throws Exception;

    GenerateQuestionResponse getNextQuestionForSession(User user, Integer sessionId) throws Exception;

}
