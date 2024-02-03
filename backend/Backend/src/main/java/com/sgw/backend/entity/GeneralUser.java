package com.sgw.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
//@EqualsAndHashCode
@Data
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class GeneralUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long userId;

    @Column(nullable = false, unique = true)
    private String username;

    // we need to do some hashing shenanigans here
    @Column(nullable = false)
    private String password;

    private boolean enabled = true;

    private boolean isVerified = false;

    private Instant createdAt = Instant.now();
    // this might have inaccurate values if when updating with PUT, we create an entirely new object
    // and forget to transfer the createdAt property over


    private String name;

    private String email;

    private String verificationCode;

    private LocalDateTime verificationCodeCreateTime;

    @OneToOne(optional = false)
    private Wallet wallet;

    @OneToMany(mappedBy = "generalUser")
    private List<Ticket> tickets;

    public GeneralUser(String username, String password) {
        this.username = username;
        this.password = password;
        this.tickets = new ArrayList<>();
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, username);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;

        GeneralUser otherUser = (GeneralUser) obj;
        return Objects.equals(userId, otherUser.userId) && Objects.equals(username, otherUser.username);
    }


}
