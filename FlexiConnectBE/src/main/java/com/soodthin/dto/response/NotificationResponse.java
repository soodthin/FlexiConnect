/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response;

import com.soodthin.entity.Notification.NotificationType;
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
public class NotificationResponse {

    private Integer id;
    private Integer userId;
    private String title;
    private String content;
    private NotificationType type;
    private String linkTo;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
