/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.soodthin.services;

import com.soodthin.dto.FollowEmployerDTO;

/**
 *
 * @author ADMIN
 */
public interface FollowEmployerService {

    FollowEmployerDTO follow(Integer candidateId, Integer employerId);

    void unfollow(Integer candidateId, Integer employerId);

    void toggleNotify(Integer candidateId, Integer employerId, Boolean notify);

    boolean isFollowed(Integer candidateId, Integer employerId);

    boolean getNotifyStatus(Integer candidateId, Integer employerId);
}
