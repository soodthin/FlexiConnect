/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */

package com.soodthin.flexiconnectbe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 *
 * @author ADMIN
 */
@SpringBootApplication(scanBasePackages = "com.soodthin")
@EnableJpaRepositories(basePackages = "com.soodthin.repositories")
@EntityScan(basePackages = "com.soodthin.entity")
public class FlexiConnectBE {
    public static void main(String[] args) {
        SpringApplication.run(FlexiConnectBE.class, args);
    }
}

