package com.sgw.backend.controller;

import com.sgw.backend.dto.BookingCreationDTO;
import com.sgw.backend.entity_booking.Booking;
import com.sgw.backend.entity_booking.DaySchedule;
import com.sgw.backend.entity_booking.TableTypeBookingSlot;
import com.sgw.backend.entity_booking.TableTypeDayAvailability;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.exception.NotEnoughMoneyInWalletException;
import com.sgw.backend.service.BookingService;
import com.sgw.backend.service.VenueService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BookingController {
    @Autowired
    BookingService bookingService;
    @Autowired
    VenueService venueService;

    // we can use this if u don't want to pass in all tableType objects, the
    // bookingCreationDTO has venueId and List<Long> of tableTypeBookingSlots
    // @PostMapping("/student/booking")
    // public ResponseEntity<?> createBooking(@RequestBody BookingCreationDTO
    // bookingCreationDTO) {
    // bookingService.createBooking()
    // }

    @PostMapping(value = { "/public/cancel-booking", "/student/cancel-booking" })
    public ResponseEntity<?> cancelBooking(@RequestParam Long bookingId) {
        try {
            System.out.println("cancelling booking of id:" + bookingId);
            Booking cancelBooking = bookingService.cancelBooking(bookingId);
            return ResponseEntity.ok(cancelBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = { "/public/cancel-booking-owner", "/owner/cancel-booking" })
    public ResponseEntity<?> cancelBookingAsOwner(@RequestParam Long bookingId) {
        try {
            System.out.println("cancelling booking of id (as owner):" + bookingId);
            Booking cancelBooking = bookingService.cancelBookingDefiniteRefund(bookingId);
            return ResponseEntity.ok(cancelBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = { "/public/create-booking", "/student/create-booking" })
    public ResponseEntity<?> createBooking(@RequestParam long venueId, @RequestParam long studentId,
            @RequestBody List<Long> tableTypeBookingSlotIdList) {
        try {
            Booking b = bookingService.createBooking(tableTypeBookingSlotIdList, venueId, studentId);
            return ResponseEntity.ok(b);
        } catch (NotEnoughMoneyInWalletException e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    // literally all bookings ever. Use for debugging
    @GetMapping(value = { "/public/get-all-bookings", "/student/get-all-bookings" })
    public ResponseEntity<?> getAllBookings() {
        try {
            List<Booking> b = bookingService.getAllBookings();
            return ResponseEntity.ok(b);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping(value = { "/public/get-booking-slots-from-venue", "/student/get-booking-slots-from-venue" })
    public ResponseEntity<?> getBookingSlotsFromVenue(@RequestParam long venueId) {
        try {
            System.out.println("getting booking slots from venue of id: " + venueId);
            Venue venue = venueService.getVenueById(venueId);
            List<DaySchedule> daySchedules = venue.getVenueSchedule().getDaySchedules();
            return ResponseEntity.ok(daySchedules);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping(value = { "/public/get-bookings-by-student", "/student/get-bookings-by-student" })
    public ResponseEntity<?> getBookingsByStudent(@RequestParam long studentId) {
        try {
            List<Booking> bookings = bookingService.getBookingsByStudentId(studentId);

            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = { "/public/complete-booking", "/student/complete-booking" })
    public ResponseEntity<?> completeBooking(@RequestParam long bookingId) {
        try {
            System.out.println("completing booking of id:" + bookingId);
            Booking booking = bookingService.completeBooking(bookingId);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
