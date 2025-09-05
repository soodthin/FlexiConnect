/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.Candidate;
import com.soodthin.entity.InterviewSession;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author ADMIN
 */
@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Integer> {
    List<InterviewSession> findByCandidateIdOrderByStartedAtDesc(Candidate candidateId);

    List<InterviewSession> findByStatus(InterviewSession.SessionStatus status);

    List<InterviewSession> findByCandidateIdAndStatus(Candidate candidateId, InterviewSession.SessionStatus status);
}
