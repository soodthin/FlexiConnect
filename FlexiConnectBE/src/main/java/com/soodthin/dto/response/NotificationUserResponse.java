/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.soodthin.entity.Notification;
import lombok.*;

import java.time.LocalDateTime;

/**
 *
 * @author ADMIN
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationUserResponse {
    private Integer id;    
    private Integer userId;
    private String title;         
    private String content;     
    private Notification.NotificationType type;       
    private String linkTo;     
    @JsonProperty("isRead") 
    private boolean isRead;     
    private LocalDateTime createdAt; 
    private LocalDateTime readAt; 
}
