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
import com.soodthin.dto.response.NotificationResponse;
import com.soodthin.entity.Notification;
import com.soodthin.entity.User;
import com.soodthin.repositories.NotificationRepository;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.NotificationService;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepository userRepository;

    @Override
    public NotificationResponse createNotification(NotificationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        Notification notification = new Notification();
        notification.setUserId(user);
        notification.setTitle(request.getTitle());
        notification.setContent(request.getContent());
        notification.setType(request.getType());
        notification.setLinkTo(request.getLinkTo());
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        Notification saved = notificationRepository.save(notification);

        NotificationResponse response = toResponse(saved);

        // Push realtime qua WebSocket cho đúng user
        messagingTemplate.convertAndSendToUser(
                user.getId().toString(),
                "/queue/notifications",
                response
        );

        return response;
    }

    @Override
    public Page<NotificationResponse> getNotifications(User user, int page, int size) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user, PageRequest.of(page, size))
                .map(this::toResponse);
    }

    @Override
    public Optional<NotificationResponse> markAsRead(Integer id, User user) {
        return notificationRepository.findById(id)
                .filter(n -> n.getUserId().getId().equals(user.getId())) // chỉ cho phép đọc của chính mình
                .map(n -> {
                    n.setIsRead(true);
                    return toResponse(notificationRepository.save(n));
                });
    }

    @Override
    public void markAllAsRead(User user) {
        notificationRepository.findByUserIdOrderByCreatedAtDesc(user, PageRequest.of(0, Integer.MAX_VALUE))
                .forEach(n -> {
                    n.setIsRead(true);
                    notificationRepository.save(n);
                });
    }

    @Override
    public void deleteNotification(Integer id, User user) {
        notificationRepository.findById(id)
                .filter(n -> n.getUserId().getId().equals(user.getId())) // chỉ xoá của mình
                .ifPresent(notificationRepository::delete);
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId().getId()) // trả về ID thôi, không trả nguyên User
                .title(notification.getTitle())
                .content(notification.getContent())
                .type(notification.getType())
                .linkTo(notification.getLinkTo())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
