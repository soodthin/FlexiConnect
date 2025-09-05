/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.InterviewTurn;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author ADMIN
 */
public interface InterviewTurnRepository extends JpaRepository<InterviewTurn, Integer> {

    List<InterviewTurn> findBySessionId_IdOrderByTurnOrderAsc(Integer sessionId);

    InterviewTurn findTopBySessionId_IdOrderByTurnOrderDesc(Integer sessionId);

    Double findAverageAiScoreBySessionId_Id(Integer sessionId);

}
