package com.sgw.backend.entity_booking;
//
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class VenueSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToMany
    private List<DaySchedule> daySchedules;

    // unidirectional (technically we don't need to annotate but good for clarity)
    @OneToOne(cascade = CascadeType.ALL)
    private DayScheduleGenerator dayScheduleGenerator;

    @OneToMany
    private List<DayScheduleTemplate> dayScheduleTemplates;

    private int fixedUnitTimeInMinutes = 30; // smallest unit of time bookable (30 min by default?)
    private int minBookingSlots = 0; // minimum number of booking slots students are required to book
    private int maxBookingSlots = Integer.MAX_VALUE; // maximum number of booking slots students can book
    // kinda afraid to set a default value of null, so we keep it liek this for now

}
