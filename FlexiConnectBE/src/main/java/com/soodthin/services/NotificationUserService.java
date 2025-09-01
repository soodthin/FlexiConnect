/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.response.NotificationUserResponse;
import com.soodthin.entity.Notification;
import com.soodthin.entity.User;
import java.util.List;

/**
 *
 * @author ADMIN
 */
public interface NotificationUserService {

    List<NotificationUserResponse> getNotifications(User user);

    void markAsRead(Integer notificationUserId, User user);

    void markAllAsRead(User user);

    void markAsUnread(Integer notificationUserId, User user);

    void deleteNotificationForUser(Notification notificationId, User user);

    long countUnreadByUser(User user);
}
