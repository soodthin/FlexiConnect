/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.soodthin.services;


import org.springframework.stereotype.Service;

/**
 *
 * @author ADMIN
 */
public interface EmailService {

    void sendHtmlMessage(String to, String subject, String htmlContent);
}
