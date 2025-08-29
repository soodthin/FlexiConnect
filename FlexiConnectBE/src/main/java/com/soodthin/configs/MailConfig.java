package com.soodthin.configs;

import java.util.Properties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class MailConfig {

    @Bean
    public JavaMailSender getJavaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587); // TLS port

        mailSender.setUsername("thinhthai963@gmail.com");
        mailSender.setPassword("gbyw evbi qvxb disq"); // App Password của Gmail

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true"); // thêm dòng này
        props.put("mail.smtp.ssl.trust", "*"); // hoặc smtp.gmail.com nếu bạn thích cụ thể hơn
        props.put("mail.debug", "true");

        return mailSender;
    }
}
