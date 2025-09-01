/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

import com.soodthin.dto.response.NotificationUserResponse;
import com.soodthin.entity.Notification;
import com.soodthin.entity.NotificationUser;
import com.soodthin.entity.User;
import com.soodthin.repositories.NotificationUserRepository;
import com.soodthin.services.NotificationUserService;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ADMIN
 */
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
@Service
@Transactional
public class NotificationUserServiceImpl implements NotificationUserService {

    @Autowired
    private NotificationUserRepository notificationUserRepository;

    @Override
    public List<NotificationUserResponse> getNotifications(User user) {
        return notificationUserRepository.findTop10ByUserIdOrderByNotificationIdCreatedAtDesc(user)
                .stream()
                .map(NotificationMapper::toDTO)
                .toList();
    }

    @Override
    public void markAsRead(Integer notificationUserId, User user) {
        NotificationUser nu = notificationUserRepository
                .findByIdAndUserId(notificationUserId, user)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found for this user"));
        nu.setIsRead(true);
        nu.setReadAt(LocalDateTime.now());
        notificationUserRepository.save(nu);
    }

    @Override
    public void markAllAsRead(User user) {
        List<NotificationUser> notifications = notificationUserRepository.findByUserIdAndIsReadFalse(user);
        notifications.forEach(n -> {
            n.setIsRead(true);
            n.setReadAt(LocalDateTime.now());
        });
        notificationUserRepository.saveAll(notifications);
    }

    @Override
    public void markAsUnread(Integer notificationUserId, User user) {
        NotificationUser nu = notificationUserRepository
                .findByIdAndUserId(notificationUserId, user)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found for this user"));
        nu.setIsRead(false);
        nu.setReadAt(null);
        notificationUserRepository.save(nu);
    }

    @Override
    public void deleteNotificationForUser(Notification notificationId, User user) {
        notificationUserRepository.findByNotificationIdAndUserId(notificationId, user)
                .ifPresent(notificationUserRepository::delete);
    }

    @Override
    public long countUnreadByUser(User user) {
        return notificationUserRepository.countByUserIdAndIsReadFalse(user);
    }

    public static class NotificationMapper {

        public static NotificationUserResponse toDTO(NotificationUser nu) {
            Notification notification = nu.getNotificationId();
            return NotificationUserResponse.builder()
                    .id(nu.getId())
                    .title(notification.getTitle())
                    .content(notification.getContent())
                    .type(notification.getType())
                    .linkTo(notification.getLinkTo())
                    .isRead(nu.getIsRead())
                    .createdAt(notification.getCreatedAt())
                    .readAt(nu.getReadAt())
                    .build();
        }
    }
}
