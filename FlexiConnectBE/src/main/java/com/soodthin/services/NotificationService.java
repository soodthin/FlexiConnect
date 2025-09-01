/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.request.NotificationRequest;
import com.soodthin.dto.response.NotificationUserResponse;
import com.soodthin.entity.Notification;
import com.soodthin.entity.User;

/**
 *
 * @author ADMIN
 */
public interface NotificationService {

    NotificationUserResponse createNotification(NotificationRequest request);

    void deleteNotification(Notification notificationId, User user);

}
