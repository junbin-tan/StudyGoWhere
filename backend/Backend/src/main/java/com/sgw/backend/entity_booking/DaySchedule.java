package com.sgw.backend.entity_booking;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class DaySchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Temporal(TemporalType.DATE)
    private LocalDate date = LocalDate.now();

    @Column(nullable = false)
    private boolean published = false;

    @OneToMany(cascade = CascadeType.ALL)
    private List<TableTypeDayAvailability> tableTypeDayAvailabilities = new ArrayList<>();


}