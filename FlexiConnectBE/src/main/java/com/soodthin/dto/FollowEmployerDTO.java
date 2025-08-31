/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto;
import java.time.LocalDateTime;
import lombok.*;
/**
 *
 * @author ADMIN
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FollowEmployerDTO {
    private Integer candidateId;
    private Integer employerId;
    private Boolean notifyJob;
    private LocalDateTime followedAt;
}