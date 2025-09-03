/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.dto.response;

import java.time.LocalDate;
import lombok.*;

/**
 *
 * @author ADMIN
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserPackageResponse {

    private Integer id;
    private String name;
    private Boolean isActive;
    private LocalDate startDate;
    private LocalDate endDate;
}
