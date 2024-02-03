package com.sgw.backend.entity_booking;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class TableTypeDayAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    // keep the cascade types in mind if there are any data inconsistency issues when updating/deleting

    @OneToMany(cascade = CascadeType.ALL) // period should be deleted if ttda is deleted
    private List<AvailabilityPeriod> availabilityPeriods = new ArrayList<>();

    // REMOVE CASCADE.MERGE to enable saving multiple tableTypes.
    // This is not beause of the backend in any way, its because of the frontend who sends up 2 copies of the same TableType which
    // then confuses JPA on which one to select as the source of truth.
    @ManyToOne(cascade = {CascadeType.PERSIST}) // ttype should not be deleted if ttda is deleted
    private TableType tableType;

    // also technically a derived attribute, but its fine to duplicate
    @OneToMany // casaced NONE
    private List<Booking> bookings = new ArrayList<>();

    // orphan removal is false, so if we detach, the booking slots should still be there
    // i manually delete the bookingslots with repository when publish method is called.
    // simply detaching won't delete the slots
    @OneToMany(mappedBy = "tableTypeDayAvailability", cascade = CascadeType.ALL)
    private List<TableTypeBookingSlot> tableTypeBookingSlots = new ArrayList<>();

    // we dont have a CascadeType.MERGE use case i think
    // because publishing pretty much generates "new" slots. so we dont need to merge anything


}




