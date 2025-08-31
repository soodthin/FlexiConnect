/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.request;

import com.soodthin.entity.Notification.NotificationType;
import lombok.*;

/**
 *
 * @author ADMIN
 */
@Data
@Builder
public class NotificationRequest {

    private Integer userId;
    private String title;
    private String content;
    private NotificationType type;
    private String linkTo;
}
