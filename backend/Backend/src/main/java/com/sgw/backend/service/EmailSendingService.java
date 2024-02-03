package com.sgw.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.CompletableFuture;

@Service
public class EmailSendingService {

    @Autowired
    private JavaMailSender mailSender;
    private String capitalCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private String lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
    private String specialCharacters = "!@#$";
    private String numbers = "1234567890";


    public void sendEmail(String toEmail, String subject, String body)
    {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("studygowherein02@gmail.com");
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public String sendEmailForPassword(String toEmail, int length)
    {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("studygowherein02@gmail.com");
        message.setTo(toEmail);
        String subject = "StudyGoWhere password";
        message.setSubject(subject);
        String password = this.getRandomPassword(length);
        String body = "Dear user your password is : " + password;
        message.setText(body);
        CompletableFuture.runAsync(() -> mailSender.send(message));
        return password;
    }

    public String getRandomPassword(int length) {
        char[] password = new char[length];
        String combination = this.capitalCaseLetters + this.lowerCaseLetters + this.specialCharacters + this.numbers;
        Random r = new Random();
        for (int i = 0; i < length; i++) {
            password[i] = combination.charAt(r.nextInt(combination.length()));
        }

        return new String(password);
    }
}
