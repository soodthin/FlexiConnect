/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.controllers;

import com.soodthin.dto.request.NotificationRequest;
import com.soodthin.dto.response.NotificationResponse;
import com.soodthin.entity.User;
import com.soodthin.repositories.UserRepository;
import com.soodthin.services.NotificationService;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    private UserRepository userRepository;

    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public NotificationResponse create(@RequestBody NotificationRequest request) {
        return notificationService.createNotification(request);
    }

    @GetMapping
    public Page<NotificationResponse> getMyNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        User user = getCurrentUser(authentication);
        return notificationService.getNotifications(user, page, size);
    }

    @PatchMapping("/{id}/read")
    public Optional<NotificationResponse> markAsRead(
            @PathVariable Integer id,
            Authentication authentication) {
        User user = getCurrentUser(authentication);
        return notificationService.markAsRead(id, user);
    }

    @PatchMapping("/mark-all-read")
    public void markAllAsRead(Authentication authentication) {
        User user = getCurrentUser(authentication);
        notificationService.markAllAsRead(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id, Authentication authentication) {
        User user = getCurrentUser(authentication);
        notificationService.deleteNotification(id, user);
    }
}
