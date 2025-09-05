/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 *
 * @author ADMIN
 */
@Entity
@Table(name = "interview_turn")
@NamedQueries({
    @NamedQuery(name = "InterviewTurn.findAll", query = "SELECT i FROM InterviewTurn i"),
    @NamedQuery(name = "InterviewTurn.findById", query = "SELECT i FROM InterviewTurn i WHERE i.id = :id"),
    @NamedQuery(name = "InterviewTurn.findByTurnOrder", query = "SELECT i FROM InterviewTurn i WHERE i.turnOrder = :turnOrder"),
    @NamedQuery(name = "InterviewTurn.findByCreatedAt", query = "SELECT i FROM InterviewTurn i WHERE i.createdAt = :createdAt"),
    @NamedQuery(name = "InterviewTurn.findByAnswerStatus", query = "SELECT i FROM InterviewTurn i WHERE i.answerStatus = :answerStatus"),
    @NamedQuery(name = "InterviewTurn.findByQuestionType", query = "SELECT i FROM InterviewTurn i WHERE i.questionType = :questionType"),
    @NamedQuery(name = "InterviewTurn.findByManualScore", query = "SELECT i FROM InterviewTurn i WHERE i.manualScore = :manualScore"),
    @NamedQuery(name = "InterviewTurn.findByAnswerTimeSeconds", query = "SELECT i FROM InterviewTurn i WHERE i.answerTimeSeconds = :answerTimeSeconds")})
public class InterviewTurn implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Lob
    @Size(max = 65535)
    @Column(name = "question")
    private String question;
    @Lob
    @Size(max = 65535)
    @Column(name = "answer")
    private String answer;
    @Lob
    @Size(max = 65535)
    @Column(name = "ai_feedback")
    private String aiFeedback;
    @Column(name = "turn_order")
    private Integer turnOrder;
    @Column(name = "ai_score")
    private Integer aiScore;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Size(max = 8)
    @Column(name = "answer_status")
    private String answerStatus;
    @Size(max = 10)
    @Column(name = "question_type")
    private String questionType;
    @Column(name = "manual_score")
    private Integer manualScore;
    @Lob
    @Size(max = 65535)
    @Column(name = "manual_feedback")
    private String manualFeedback;
    @Column(name = "answer_time_seconds")
    private Integer answerTimeSeconds;
    @JoinColumn(name = "session_id", referencedColumnName = "id")
    @ManyToOne
    @JsonIgnore
    private InterviewSession sessionId;

    public InterviewTurn() {
    }

    public InterviewTurn(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getAiFeedback() {
        return aiFeedback;
    }

    public void setAiFeedback(String aiFeedback) {
        this.aiFeedback = aiFeedback;
    }

    public Integer getTurnOrder() {
        return turnOrder;
    }

    public void setTurnOrder(Integer turnOrder) {
        this.turnOrder = turnOrder;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getAnswerStatus() {
        return answerStatus;
    }

    public void setAnswerStatus(String answerStatus) {
        this.answerStatus = answerStatus;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public Integer getManualScore() {
        return manualScore;
    }

    public void setManualScore(Integer manualScore) {
        this.manualScore = manualScore;
    }

    public String getManualFeedback() {
        return manualFeedback;
    }

    public void setManualFeedback(String manualFeedback) {
        this.manualFeedback = manualFeedback;
    }

    public Integer getAnswerTimeSeconds() {
        return answerTimeSeconds;
    }

    public void setAnswerTimeSeconds(Integer answerTimeSeconds) {
        this.answerTimeSeconds = answerTimeSeconds;
    }

    public InterviewSession getSessionId() {
        return sessionId;
    }

    public void setSessionId(InterviewSession sessionId) {
        this.sessionId = sessionId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof InterviewTurn)) {
            return false;
        }
        InterviewTurn other = (InterviewTurn) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.soodthin.entity.InterviewTurn[ id=" + id + " ]";
    }

    /**
     * @return the aiScore
     */
    public Integer getAiScore() {
        return aiScore;
    }

    /**
     * @param aiScore the aiScore to set
     */
    public void setAiScore(Integer aiScore) {
        this.aiScore = aiScore;
    }

}
