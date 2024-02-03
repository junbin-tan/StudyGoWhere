package com.sgw.backend.entity_venue;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
public class BusinessHours {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long businessHoursId;

//    @ElementCollection
//    private List<String> testElem;

    // element collections of embeddables... but it doesn't work here
    // https://en.wikibooks.org/wiki/Java_Persistence/ElementCollection

    // empty list of FromToHour means closed
    @ElementCollection
    private List<FromToTime> mon;
    @ElementCollection
    private List<FromToTime> tue;
    @ElementCollection
    private List<FromToTime> wed;
    @ElementCollection
    private List<FromToTime> thu;
    @ElementCollection
    private List<FromToTime> fri;
    @ElementCollection
    private List<FromToTime> sat;
    @ElementCollection
    private List<FromToTime> sun;

    @ElementCollection
    private List<FromToHolidayDate> holidays;


    public BusinessHours() {
        this.mon = new ArrayList<>();
        this.tue = new ArrayList<>();
        this.wed = new ArrayList<>();
        this.thu = new ArrayList<>();
        this.fri = new ArrayList<>();
        this.sat = new ArrayList<>();
        this.sun = new ArrayList<>();
        this.holidays = new ArrayList<>();
    }
//    public void formatTimes() {
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");
//        this.openHour = LocalTime.parse(this.openHour.format(formatter));
//        this.closeHour = LocalTime.parse(this.closeHour.format(formatter));
//    }
}
