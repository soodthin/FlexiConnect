/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.repositories;

import com.soodthin.entity.Notification;
import com.soodthin.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author ADMIN
 */
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    Page<Notification> findByUserIdOrderByCreatedAtDesc(User user, Pageable pageable);

}
