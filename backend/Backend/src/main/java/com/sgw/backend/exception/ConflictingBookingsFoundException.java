package com.sgw.backend.exception;

import com.sgw.backend.dto.BookingDTO;
import com.sgw.backend.entity_booking.Booking;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class ConflictingBookingsFoundException extends RuntimeException {
    public ConflictingBookingsFoundException(String message) {
        super(message);
    }

    private List<Booking> bookings;
}
