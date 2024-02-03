package com.sgw.backend.service;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sgw.backend.controller.TicketController;
import com.sgw.backend.entity.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.stereotype.Service;

import javax.security.auth.kerberos.KerberosCredMessage;
import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.SortedSet;
import java.util.function.Function;
import java.util.stream.Collectors;

public class DTOMapperService {
    public static Function<Student, StudentDTO> getStudentMapper() {
        return (student) -> new StudentDTO(student.getUserId(),
                                student.getUsername(),
                                student.getPassword(),
                                student.isEnabled(),
                                student.getCreatedAt(),
                                student.getName(),
                                student.getEmail());
    }

    public static Function<Ticket, TicketDTO>  getTicketMapper() {
        return (ticket) -> {
            return new TicketDTO(
                    ticket.getTicketId(),
                    ticket.getSubject(),
                    ticket.getDescription(),
                    ticket.getCreatedAt(),
                    ticket.getImages(),
                    ticket.getTicketStatus(),
                    ticket.getTicketCategory(),
                    ticket.getGeneralUser().getUsername(),
                    ticket.isNotifyAdmin(),
                    ticket.isNotifyClient()
            );
        };
    }



    public static Function<Message, MessageDTO> getMessageDTO() {
        return (message) -> {
            return new MessageDTO(
                    message.getMessageId(),
                    message.getMessage(),
                    message.getSender().getUsername(),
                    message.getCreatedAt()
            );
        };
    }

    public static Function<SortedSet<Message>, List<MessageDTO>> getMessagesDTO() {
        return (collection) -> collection.stream().map(getMessageDTO()).collect(Collectors.toList());
    }

    public record StudentDTO(
            long userId,
            String username,
            String password,
            boolean enabled,
            Instant createdAt,
            String name,
            String email
    ) {
        // Constructor, accessor methods, and other members can be added here
    }
    public record MessageDTO(

            long messageId,
            String message,
            String sender,
            Instant createdAt
    ) {
        // Constructor, accessor methods, and other members can be added here
    }

    public record TicketDTO(

            long ticketId,
          String subject,
          String description,
            Instant createdAt,
            List<String> images,

            TicketStatusEnum ticketStatus,
            String ticketCategory,
             String generalUser,
             Boolean notifyAdmin,
             Boolean notifyClient
    ) {
        // Constructor, accessor methods, and other members can be added here
    }

}
