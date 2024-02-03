package com.sgw.backend.entity_booking;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sgw.backend.entity.Billable;
import com.sgw.backend.entity.BookStatusEnum;
import com.sgw.backend.entity.Student;
import com.sgw.backend.entity_venue.Venue;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking extends Billable {

    private BookStatusEnum bookStatus;

    @ManyToOne(optional = false)
    @JoinColumn(name = "booking_student_id")
    @JsonIgnore
    private Student bookingStudent;

    // this is a derived attribute. the data here is already contained in tableTypeBookingSlots, but
    // for convenience's sake, we duplicate it here.
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime fromDateTime;
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime toDateTime;

    @ManyToOne
    @JsonIgnore
    private Venue venue;

    private Long venueId;

    private String studentName;

    @JsonIgnore
    @ManyToMany
    private List<TableTypeBookingSlot> tableTypeBookingSlots;

    // we may want to add subfields here if we want to store more information about the booking pricing
    // for example the basePrice and pricePerHour, so that we can calculate the price of the booking
    // it should be a duplicated field, so as to enable the owner to update/delete price even after booking is made

    @Override
    public int hashCode() {
        return Objects.hash(getBillableId());
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        Booking booking = (Booking) obj;
        return this.getBillableId() == booking.getBillableId();
    }

    public String getLabel() {
        return "Booking at " + venue.getVenueName();
    }
}
