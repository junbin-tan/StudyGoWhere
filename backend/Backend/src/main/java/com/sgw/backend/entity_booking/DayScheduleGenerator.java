package com.sgw.backend.entity_booking;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class DayScheduleGenerator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JsonIgnore
    @OneToOne(mappedBy = "dayScheduleGenerator")
    private VenueSchedule venueSchedule;

    @ManyToOne
    private DayScheduleTemplate mon;
    @ManyToOne
    private DayScheduleTemplate tue;
    @ManyToOne
    private DayScheduleTemplate wed;
    @ManyToOne
    private DayScheduleTemplate thu;
    @ManyToOne
    private DayScheduleTemplate fri;
    @ManyToOne
    private DayScheduleTemplate sat;
    @ManyToOne
    private DayScheduleTemplate sun;

    @Column(nullable = false)
    private int daysInAdvance = 7; // set as 1 week as default
    @Column(nullable = false)
    private boolean enabled = false;
//    private boolean autoPublishDaySchedules;

}