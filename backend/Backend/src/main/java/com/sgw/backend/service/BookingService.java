package com.sgw.backend.service;

import com.sgw.backend.entity.BookStatusEnum;
import com.sgw.backend.entity.Student;
import com.sgw.backend.entity_booking.Booking;
import com.sgw.backend.entity_booking.TableTypeBookingSlot;
import com.sgw.backend.entity_booking.TableTypeDayAvailability;
import com.sgw.backend.entity_booking.VenueSchedule;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.exception.BillableAlreadyHasTransactionException;
import com.sgw.backend.exception.NoTablesAvailableException;
import com.sgw.backend.exception.PayerBalanceInsufficientException;
import com.sgw.backend.exception.TransactionNotPendingException;
import com.sgw.backend.repository.*;
import com.sgw.backend.utilities.UserContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class BookingService {

    private final TransactionService transactionService;
    private final VenueRepository venueRepository;

    private final OwnerRepository ownerRepository;

    private final OwnerService ownerService;

    private final OperatorRepository operatorRepository;

    private final StudentRepository studentRepository;

    private final BookingRepository bookingRepository;
    private final TableTypeBookingSlotRepository tableTypeBookingSlotRepository;

    private final UserContext userContext;

    public BookingService(TransactionService transactionService, VenueRepository venueRepository,
            OwnerRepository ownerRepository,
            OwnerService ownerService, OperatorRepository operatorRepository,
            StudentRepository studentRepository, BookingRepository bookingRepository,
            TableTypeBookingSlotRepository tableTypeBookingSlotRepository, UserContext userContext) {
        this.transactionService = transactionService;
        this.venueRepository = venueRepository;
        this.ownerRepository = ownerRepository;
        this.ownerService = ownerService;
        this.operatorRepository = operatorRepository;
        this.studentRepository = studentRepository;
        this.bookingRepository = bookingRepository;
        this.tableTypeBookingSlotRepository = tableTypeBookingSlotRepository;
        this.userContext = userContext;

    }

    // get bookings by venue
    // public List<Booking> getBookingsByVenue(long venueId) {
    // return bookingRepository.findBookingsByVenue(venueId);
    // }

    public List<Booking> getAllBookings() {
        // if this doesn't work, try changing to findBookingsByBookingStudentUserId
        return bookingRepository.findAll();
    }

    // get bookings by user
    public List<Booking> getBookingsByStudentId(long userId) {
        // if this doesn't work, try changing to findBookingsByBookingStudentUserId
        return bookingRepository.findByBookingStudentUserId(userId);
    }

    public List<Booking> getBookingsByStudentToken() {
        Student student = userContext.obtainRequesterIdentity(studentRepository::getStudentByUsername)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return bookingRepository.findByBookingStudentUserId(student.getUserId());
    }

    // shouldn't need this, but just in case
    public List<Booking> getBookingsByVenueId(long venueId) {
        return bookingRepository.findByVenueVenueId(venueId);
    }

    public Booking createBooking(List<Long> bookingSlotIds, Long venueId) {
        Student student = userContext.obtainRequesterIdentity(studentRepository::getStudentByUsername)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return createBooking(bookingSlotIds, venueId, student.getUserId());
    }

    // !== REST API should use this method !==
    // createBooking fetches the user from the SecurityContext and creates a booking
    // based on the bookingSlots passed in
    // also we can technically get the venue from TableTypeDayAvailability but its a
    // huge hassle, so for now we pass in venueId
    public Booking createBooking(List<Long> bookingSlotIds, Long venueId, Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Venue venue = venueRepository.findById(venueId).orElseThrow(() -> new RuntimeException("Venue not found"));
        VenueSchedule venueSchedule = venue.getVenueSchedule();

        List<TableTypeBookingSlot> bookingSlots = tableTypeBookingSlotRepository.findAllById(bookingSlotIds);
        bookingSlots.forEach(bslot -> {
            System.out.println("bslot of id fetched: " + bslot.getId());
        });

        if (venueSchedule.getMaxBookingSlots() < bookingSlots.size()) {
            throw new RuntimeException("Too many booking slots");
        }

        Booking booking = new Booking();
        booking.setBookingStudent(student);
        booking.setStudentName(student.getName());
        booking.setVenue(venue);
        booking.setVenueId(venue.getVenueId());
        booking.setTableTypeBookingSlots(bookingSlots);
        booking.setBookStatus(BookStatusEnum.RESERVED);

        BigDecimal mostExpensiveBasePrice = bookingSlots.stream()
                .map(TableTypeBookingSlot::getSlotBasePrice)
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);

        booking.setBillablePrice(bookingSlots.stream()
                .map(TableTypeBookingSlot::getSlotPricePerHalfHour)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .add(mostExpensiveBasePrice));

        // Add booking to tableTypeBookingSlot and also checks if the slot has available
        // tables

        LocalDateTime earliestDateTime = null;
        LocalDateTime latestDateTime = null;

        for (TableTypeBookingSlot tableTypeBookingSlot : bookingSlots) {
            int tablesAvailable = tableTypeBookingSlot.getTablesAvailable();
            if (tablesAvailable == 0) {
                throw new NoTablesAvailableException("No tables available for booking in this slot");
            } else {
                tableTypeBookingSlot.setTablesAvailable(tablesAvailable - 1);
            }

            LocalDateTime fromDateTime = tableTypeBookingSlot.getFromDateTime();
            if (earliestDateTime == null || fromDateTime.isBefore(earliestDateTime)) {
                earliestDateTime = fromDateTime;
            }

            LocalDateTime toDateTime = tableTypeBookingSlot.getToDateTime();
            if (latestDateTime == null || toDateTime.isAfter(latestDateTime)) {
                latestDateTime = toDateTime;
            }
            tableTypeBookingSlot.getBookings().add(booking);
        }

        booking.setFromDateTime(earliestDateTime);
        booking.setToDateTime(latestDateTime);

        // Add booking to TableTypeDayAvailability; this is found thru the first
        // BookingSlot
        String billableName = "Booking at " + venue.getVenueName() + " on "
                + bookingSlots.get(0).getFromDateTime().toLocalDate().toString() +
                " from " + earliestDateTime.toLocalTime().toString() +
                " to " + latestDateTime.toLocalTime().toString();
        booking.setBillableName(billableName);

        // Add booking to TableTypeDayAvailability; this is found thru the first
        // BookingSlot
        TableTypeDayAvailability tableTypeDayAvailability = bookingSlots.get(0).getTableTypeDayAvailability();
        tableTypeDayAvailability.getBookings().add(booking);

        Booking finalB = bookingRepository.save(booking);
        System.out.println("Final booking price: " + finalB.getBillablePrice());
        addBookingToStudent(finalB, student);
        return finalB;
    }

    // I set this as private so REST shouldn't call this directly, neither should
    // other service classes tbh
    private void addBookingToStudent(Booking booking, Student student) {
        student.getBookings().add(booking);
        try {
            transactionService.createAndAddTransactionV2(booking, student.getWallet(),
                    booking.getVenue().getOwner().getWallet());
        } catch (PayerBalanceInsufficientException | BillableAlreadyHasTransactionException e) {
            throw new RuntimeException(e);
        }

        studentRepository.save(student);
    }

    public void cancelAllPastBookings() {
        List<Booking> allPendingBookings = bookingRepository.findBookingsByBookStatus(BookStatusEnum.RESERVED);
        for (Booking booking : allPendingBookings) {
            if (booking.getToDateTime().isBefore(LocalDateTime.now())) {

                System.out.println("Cancelling booking of id: " + booking.getBillableId());

                try {
                    cancelBooking(booking, false);
                } catch (TransactionNotPendingException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }

    public Booking cancelBooking(Long bookingId) throws TransactionNotPendingException {
        Booking managedBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return cancelBooking(managedBooking, false);
    }

    public Booking cancelBookingDefiniteRefund(Long bookingId) throws TransactionNotPendingException {
        Booking managedBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return cancelBooking(managedBooking, true);
    }

    public Booking cancelBooking(Booking managedBooking, boolean definiteRefund) throws TransactionNotPendingException {
        managedBooking.setBookStatus(BookStatusEnum.CANCELLED);
        LocalDateTime currentTime = LocalDateTime.now();
        // if current time is before 24 hours of booking, then refund 100%
        if (definiteRefund || currentTime.isBefore(managedBooking.getFromDateTime().minusHours(24))) {
            transactionService.cancelATransaction(managedBooking.getTransactionDetail());
        } else {
            transactionService.completeATransaction(managedBooking.getTransactionDetail());
        }

        managedBooking.getTableTypeBookingSlots().forEach(tableTypeBookingSlot -> {
            tableTypeBookingSlot.setTablesAvailable(tableTypeBookingSlot.getTablesAvailable() + 1);
        });

        return bookingRepository.save(managedBooking);

    }

    public Booking completeBooking(Long bookingId) {
        Booking managedBooking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        System.out.println("Setting booking to complete");
        managedBooking.setBookStatus(BookStatusEnum.COMPLETE);

        return bookingRepository.save(managedBooking);
    }

}
