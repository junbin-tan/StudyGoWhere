//package com.sgw.backend.entity_venue;
//
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import com.sgw.backend.entity.TimeSlot;
//import com.sgw.backend.entity_venue.Venue;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.hibernate.annotations.SortNatural;
//
//import java.util.SortedSet;
//
//@Entity
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//public class TableVenue {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private long userId;
//
//    private int numberOfSeats;
//
//    private int price;
//
//    @OneToMany(mappedBy = "tableVenue")
//    @SortNatural
//    private SortedSet<TimeSlot> timeSlots;
//
//    @JsonIgnore
//    @ManyToOne(optional = false)
//    private Venue venue;
//
//
////    public TableVenue(){
////        this.timeSlots = new TreeSet<>();
////    }
//
//
//}
