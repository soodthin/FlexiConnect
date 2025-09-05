/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response.AI;

import com.soodthin.entity.Candidate;
import com.soodthin.entity.InterviewSession;
import com.soodthin.entity.InterviewSession.SessionStatus;
import com.soodthin.entity.JobPost;
import lombok.*;
import java.time.LocalDateTime;

/**
 *
 * @author ADMIN
 */

@Data
@AllArgsConstructor
public class SessionResponse {
    private Integer id;
    private Candidate candidateId;
    private JobPost jobPostId;
    private SessionStatus status;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    
    public static SessionResponse fromEntity(InterviewSession session) {
        return new SessionResponse(
                session.getId(),
                session.getCandidateId(),
                session.getJobPostId(),
                session.getStatus(),
                session.getStartedAt(),
                session.getCompletedAt()
        );
    }
}
