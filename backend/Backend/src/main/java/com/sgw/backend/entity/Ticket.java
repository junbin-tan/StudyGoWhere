package com.sgw.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.*;

@Entity
@Data
@NoArgsConstructor
public class Ticket implements Comparable<Ticket> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long ticketId;

    @NotNull
    @Size(max = 256)
    private String subject;

    @NotNull
    @Size(max = 1000)
    private String description;

    private Instant createdAt;

    @ElementCollection
    private List<String> images;

    @NotNull
    private TicketStatusEnum ticketStatus;

    private String ticketCategory;

    @OneToMany
    @JsonIgnore
    private SortedSet<Message> messages = new TreeSet<>();

    @ManyToOne(optional = false)
    @JsonIgnore
    private GeneralUser generalUser;

    private boolean notifyAdmin;

    private boolean notifyClient;

    public int compareTo(Ticket ticket) {
        return this.createdAt.compareTo(ticket.createdAt);
    }
}
