package com.sgw.backend.service;

import com.sgw.backend.entity.GeneralUser;
import com.sgw.backend.entity.Message;
import com.sgw.backend.entity.Ticket;
import com.sgw.backend.exception.InvalidTicketException;
import com.sgw.backend.exception.InvalidUserException;
import com.sgw.backend.repository.*;
import com.sgw.backend.utilities.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.SortedSet;
import java.util.function.Function;
import java.util.function.Predicate;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageTicketService {

    private final MessageRepository messageRepository;

    private final StudentRepository studentRepository;

    private final OwnerRepository ownerRepository;

    private final TicketRepository ticketRepository;

    private final GeneralUserRepository generalUserRepository;

    private final UserContext userContext;

    public Optional<SortedSet<Message>> getMessages(Long ticketId) {
        return ticketRepository.findById(ticketId).map(ticket -> ticket.getMessages());
    }

    public Optional<SortedSet<Message>> getRelatedMessages(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .filter(ticket -> validateTicketAssociationByUsername((username) -> generalUserRepository.getGeneralUserByUsername(username))
                                    .test(ticket)).map(ticket -> ticket.getMessages());
    }
    public Message postOwnerMessage(Long ticketId, String message) throws InvalidTicketException {
        ticketRepository.findById(ticketId).ifPresent(ticket -> ticket.setNotifyAdmin(true));
        Predicate<Ticket> ownerPredicate = validateTicketAssociationByUsername((username) -> ownerRepository.getOwnerByUsername(username));
        return postMessage(ticketId, message, ownerPredicate);
    }

    public Message postAdminMessage(Long ticketId, String message) throws InvalidTicketException {
        ticketRepository.findById(ticketId).ifPresent(ticket -> ticket.setNotifyClient(true));
        Predicate<Ticket> adminPredicate = (ticket) -> true;
        return postMessage(ticketId, message, adminPredicate);
    }

    public Message postStudentMessage(Long ticketId, String message) throws InvalidTicketException {
        ticketRepository.findById(ticketId).ifPresent(ticket -> ticket.setNotifyAdmin(true));
        Predicate<Ticket> studentPredicate = validateTicketAssociationByUsername((username) -> studentRepository.getStudentByUsername(username));
        return postMessage(ticketId, message, studentPredicate);
    }
    public <T extends GeneralUser> Predicate<Ticket> validateTicketAssociationByUsername(Function<String, T> function) {
        return (ticket) -> {
            return userContext.obtainRequesterIdentity(function)
                    .map(a -> a.getTickets().stream().map(t -> t.getTicketId()).anyMatch(id -> id.equals(ticket.getTicketId()))).orElse(false);
        };
    }
    public Message postMessage(Long ticketId, String message, Predicate<Ticket> predicate) throws InvalidTicketException {
        Ticket ticket =  Optional.ofNullable(ticketId)
                            .flatMap(id -> ticketRepository.findById(id))
                            .filter(t -> predicate.test(t))
                            .orElseThrow(() -> new InvalidTicketException("NO ASSOCIATED TICKET FOUND"));
        return saveMessage(message).apply(ticket);
    }

    private Function<Ticket, Message> saveMessage(String msg) {
        return ticket -> {
            Message message = new Message();
            message.setMessage(msg);
            message.setCreatedAt(Instant.now());
            ticket.getMessages().add(message);
            userContext.obtainRequesterIdentity(generalUserRepository::getGeneralUserByUsername)
                    .ifPresentOrElse(user -> message.setSender(user), () -> new InvalidUserException("INVALID USER"));
            messageRepository.save(message);
            return message;
        };
    }

}
