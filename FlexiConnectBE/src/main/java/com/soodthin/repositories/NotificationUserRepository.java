/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.Notification;
import com.soodthin.entity.NotificationUser;
import com.soodthin.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author ADMIN
 */
public interface NotificationUserRepository extends JpaRepository<NotificationUser, Integer> {

    List<NotificationUser> findTop10ByUserIdOrderByNotificationIdCreatedAtDesc(User user);

    Optional<NotificationUser> findByNotificationIdAndUserId(Notification notificationId, User userId);

    List<NotificationUser> findByUserId(User userId);

    long countByUserIdAndIsReadFalse(User userId);

    Optional<NotificationUser> findByIdAndUserId(Integer id, User userId);

    List<NotificationUser> findByUserIdAndIsReadFalse(User userId);

}
