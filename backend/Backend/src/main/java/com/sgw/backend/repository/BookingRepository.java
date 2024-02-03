package com.sgw.backend.repository;

import com.sgw.backend.entity.BookStatusEnum;
import com.sgw.backend.entity_booking.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // List<Booking> findBookingsByVenue(long venueId);

    List<Booking> findByBookingStudentUserId(long userId);

    List<Booking> findByVenueVenueId(long venueId);

    List<Booking> findBookingsByBookingStudentUserId(long userId);

    List<Booking> findBookingsByBookStatus(BookStatusEnum bookStatus);
}
