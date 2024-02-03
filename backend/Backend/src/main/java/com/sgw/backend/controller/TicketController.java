package com.sgw.backend.controller;

import com.sgw.backend.entity.Message;
import com.sgw.backend.entity.Ticket;
import com.sgw.backend.entity.TicketStatusEnum;
import com.sgw.backend.exception.InvalidTicketException;
import com.sgw.backend.exception.InvalidUserException;
import com.sgw.backend.service.DTOMapperService;
import com.sgw.backend.service.MessageTicketService;
import com.sgw.backend.service.TicketService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.SortedSet;
import java.util.function.Supplier;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TicketController {

    private final TicketService ticketService;

    private final MessageTicketService messageTicketService;

    @GetMapping
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("TEST");
    }

    @GetMapping("/student/ticket/getall/{username}")
    public ResponseEntity<List<Ticket>> getAllTicketsUsername(@PathVariable String username) {
        List<Ticket> tickets = ticketService.getTicketsByUsername(username);
        if (tickets != null) {
            return ResponseEntity.ok(tickets);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(value = { "/student/ticket/create", "/owner/ticket/create" })
    public ResponseEntity<Ticket> createTicket(@Valid @RequestBody Ticket ticket) {
        return ticketService.createTicket(ticket)
                .map(t -> ResponseEntity.ok(ticket))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/admin/ticket/search")
    public ResponseEntity<Pair<List<DTOMapperService.TicketDTO>, Long>> getAllTickets(
            @Valid @RequestBody SearchDTO searchDTO) {
        return ResponseEntity.ok(ticketService.getAllTickets(searchDTO.keyword, searchDTO.field,
                searchDTO.pageNum, searchDTO.pageSize,
                searchDTO.sortField, searchDTO.sortOrder));
    }

    @GetMapping("/admin/ticket/{ticketId}")
    public ResponseEntity<DTOMapperService.TicketDTO> getTicketById(@PathVariable Long ticketId) {
        return ticketService.getTicketById(ticketId).map(ticket -> ResponseEntity.ok(ticket))
                .orElse(ResponseEntity.badRequest().build());
    }

    @PostMapping("/student/ticket/{ticketId}/message")
    public ResponseEntity<DTOMapperService.MessageDTO> postStudentMessage(@PathVariable Long ticketId,
            @Valid @RequestBody MessageDTO msg) {
        return postMessage(() -> messageTicketService.postStudentMessage(ticketId, msg.message));
    }

    @PostMapping("/admin/ticket/{ticketId}/message")
    public ResponseEntity<DTOMapperService.MessageDTO> postAdminMessage(@PathVariable Long ticketId,
            @Valid @RequestBody MessageDTO msg) {
        return postMessage(() -> messageTicketService.postAdminMessage(ticketId, msg.message));
    }

    @PostMapping("/owner/ticket/{ticketId}/message")
    public ResponseEntity<DTOMapperService.MessageDTO> postOwnerMessage(@PathVariable @NotNull Long ticketId,
            @Valid @RequestBody MessageDTO message) {
        return postMessage(() -> messageTicketService.postOwnerMessage(ticketId, message.message));
    }

    @GetMapping(value = { "/admin/ticket/{ticketId}/message", "/student/ticket/{ticketId}/getallmessages" })
    public ResponseEntity<List<DTOMapperService.MessageDTO>> getMessages(@PathVariable @NotNull Long ticketId) {
        return messageTicketService.getMessages(ticketId).map(DTOMapperService.getMessagesDTO())
                .map(list -> ResponseEntity.ok(list))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping(value = { "/owner/ticket/{ticketId}/message", "/student/ticket/{ticketId}/message" })
    public ResponseEntity<List<DTOMapperService.MessageDTO>> getRelatedMessages(@PathVariable @NotNull Long ticketId) {
        return messageTicketService.getRelatedMessages(ticketId).map(DTOMapperService.getMessagesDTO())
                .map(set -> ResponseEntity.ok(set))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(value = { "/student/ticket/search", "/owner/ticket/search" })
    public ResponseEntity<Pair<List<DTOMapperService.TicketDTO>, Long>> getRelatedTickets(
            @Valid @RequestBody SearchDTO searchDTO) {
        return ResponseEntity.ok(ticketService.getRelatedTicketsRefactored(searchDTO.keyword, searchDTO.field,
                searchDTO.pageNum, searchDTO.pageSize,
                searchDTO.sortField, searchDTO.sortOrder));
    }

    @PutMapping("/admin/updateTicket/{ticketId}")
    public ResponseEntity updateTicketByAdmin(@Valid @RequestBody Ticket ticket, @PathVariable Long ticketId) {
        if (ticketService.updateTicketByAdmin(ticket, ticketId)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/admin/{id}/toggle-resolution")
    public ResponseEntity toggleTicketResolution(@Valid @PathVariable("id") Long id,
            @Valid @NotNull @RequestBody TicketStatusEnum statusEnum) {
        if (ticketService.toggleTicketResolution(id, statusEnum)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/admin/ticket-read/{ticketId}")
    public ResponseEntity markAsReadAdmin(@NotNull @PathVariable("ticketId") Long ticketId) {
        return markTicketAsRead(ticketId);
    }

    @PutMapping("/owner/ticket-read/{ticketId}")
    public ResponseEntity markAsReadOwner(@NotNull @PathVariable("ticketId") Long ticketId) {
        return markTicketAsRead(ticketId);
    }

    @PutMapping("/student/ticket-read/{ticketId}")
    public ResponseEntity markAsReadStudent(@NotNull @PathVariable("ticketId") Long ticketId) {
        return markTicketAsRead(ticketId);
    }

    private ResponseEntity markTicketAsRead(Long ticketId) {
        try {
            ticketService.markAsRead(ticketId);
            return ResponseEntity.ok().build();
        } catch (InvalidUserException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (InvalidTicketException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private ResponseEntity<DTOMapperService.MessageDTO> postMessage(Supplier<Message> messageFunction) {
        try {
            return ResponseEntity.ok(DTOMapperService.getMessageDTO().apply(messageFunction.get()));
        } catch (InvalidUserException user) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (InvalidTicketException ticket) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    public record SearchDTO(@NotNull String keyword, @NotNull String field,
            @NotNull Integer pageNum, @NotNull Integer pageSize,
            @NotNull String sortField, @NotNull String sortOrder) {
    }

    public record AdminReplyDTO(@NotNull String reply) {
    }

    public record MessageDTO(@NotNull @Size(max = 255) String message) {
    }
}