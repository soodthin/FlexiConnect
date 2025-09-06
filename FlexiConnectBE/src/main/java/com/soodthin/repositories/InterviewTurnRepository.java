/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.InterviewTurn;
import feign.Param;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 *
 * @author ADMIN
 */
public interface InterviewTurnRepository extends JpaRepository<InterviewTurn, Integer> {

    List<InterviewTurn> findBySessionId_IdOrderByTurnOrderAsc(Integer sessionId);

    InterviewTurn findTopBySessionId_IdOrderByTurnOrderDesc(Integer sessionId);

    @Query("SELECT AVG(t.aiScore) FROM InterviewTurn t WHERE t.sessionId.id = :sessionId")
    Double findAverageAiScoreBySessionId_Id(@Param("sessionId") Integer sessionId);

}
