/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.soodthin.dto.request.NotificationRequest;
import com.soodthin.dto.response.NotificationUserResponse;
import com.soodthin.entity.User;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.NotificationService;
import com.soodthin.services.NotificationUserService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ADMIN
 */
@RestController
@RequestMapping("/api/users/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationUserService notificationUserService;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public NotificationUserResponse createNotification(@RequestBody NotificationRequest request) {
        return notificationService.createNotification(request);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(
            @PathVariable("id") Integer id,
            Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        notificationService.deleteNotification(
                new com.soodthin.entity.Notification(id), // tạo object với id
                currentUser
        );
    }

    @GetMapping
    public List<NotificationUserResponse> getMyNotifications(Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        return notificationUserService.getNotifications(currentUser);
    }

    @GetMapping("/unread-count")
    public long countUnread(Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        return notificationUserService.countUnreadByUser(currentUser);
    }

    @PatchMapping("/{id}/read")
    public void markAsRead(@PathVariable("id") Integer id, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        notificationUserService.markAsRead(id, currentUser);
    }

    @PatchMapping("/read-all")
    public void markAllAsRead(Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        notificationUserService.markAllAsRead(currentUser);
    }

    @PatchMapping("/{id}/unread")
    public void markAsUnread(@PathVariable("id") Integer id, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        notificationUserService.markAsUnread(id, currentUser);
    }

    @DeleteMapping("/{id}/user")
    public void deleteNotificationForUser(
            @PathVariable("id") Integer id,
            Authentication authentication
    ) {
        User currentUser = getCurrentUser(authentication);
        notificationUserService.deleteNotificationForUser(
                new com.soodthin.entity.Notification(id),
                currentUser
        );
    }
}
