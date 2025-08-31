/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.request.NotificationRequest;
import com.soodthin.dto.response.NotificationResponse;
import com.soodthin.entity.User;
import java.util.Optional;
import org.springframework.data.domain.Page;

/**
 *
 * @author ADMIN
 */
public interface NotificationService {

    NotificationResponse createNotification(NotificationRequest request);

    Page<NotificationResponse> getNotifications(User userId, int page, int size);

    Optional<NotificationResponse> markAsRead(Integer id, User user);

    void markAllAsRead(User userId);

    void deleteNotification(Integer id, User user);
}
