/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services.impl;

/**
 *
 * @author ADMIN
 */
import com.soodthin.dto.request.NotificationRequest;
import com.soodthin.dto.response.NotificationUserResponse;
import com.soodthin.entity.Notification;
import com.soodthin.entity.NotificationUser;
import com.soodthin.entity.User;
import com.soodthin.repositories.NotificationRepository;
import com.soodthin.repositories.NotificationUserRepository;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.NotificationService;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private NotificationUserRepository notificationUserRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Override
    public NotificationUserResponse createNotification(NotificationRequest request) {
        Notification notification = new Notification();
        notification.setTitle(request.getTitle());
        notification.setContent(request.getContent());
        notification.setType(request.getType());
        notification.setLinkTo(request.getLinkTo());
        notification.setCreatedAt(LocalDateTime.now());

        Notification saved = notificationRepository.save(notification);

        // Gán cho user nhận thông báo
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        NotificationUser notifUser = new NotificationUser();
        notifUser.setNotificationId(saved);
        notifUser.setUserId(user);
        notifUser.setIsRead(false);
        notifUser.setReadAt(null);

        notificationUserRepository.save(notifUser);

        // Build response
        NotificationUserResponse response = NotificationMapper.toDTO(saved, notifUser);

        // Push realtime qua WebSocket cho đúng user
        simpMessagingTemplate.convertAndSendToUser(
                user.getId().toString(),
                "/queue/notifications",
                response
        );

        return response;
    }

    @Override
    public void deleteNotification(Notification notificationId, User user) {
        notificationUserRepository.findByNotificationIdAndUserId(notificationId, user)
                .ifPresent(notificationUserRepository::delete);
    }

    // Mapper tách riêng
    public static class NotificationMapper {

        public static NotificationUserResponse toDTO(Notification notification, NotificationUser notifUser) {
            return NotificationUserResponse.builder()
                    .id(notification.getId())
                    .userId(notifUser.getUserId().getId())
                    .title(notification.getTitle())
                    .content(notification.getContent())
                    .type(notification.getType())
                    .linkTo(notification.getLinkTo())
                    .isRead(notifUser.getIsRead())
                    .createdAt(notification.getCreatedAt())
                    .readAt(notifUser.getReadAt())
                    .build();
        }
    }
}
    