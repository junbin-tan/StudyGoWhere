package com.sgw.backend.service;

import com.sgw.backend.entity.BookStatusEnum;
import com.sgw.backend.entity_booking.*;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.exception.ConflictingBookingsFoundException;
import com.sgw.backend.exception.TransactionNotPendingException;
import com.sgw.backend.repository.*;
import com.sgw.backend.utilities.UserContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class DayScheduleService {

    private final VenueRepository venueRepository;

    private final OwnerRepository ownerRepository;

    private final OwnerService ownerService;
    private final BookingService bookingService;

    // REPOSITORIES
    private final OperatorRepository operatorRepository;

    private final StudentRepository studentRepository;

    private final BookingRepository bookingRepository;
    private final DayScheduleRepository dayScheduleRepository;
    private final TableTypeDayAvailabilityRepository tableTypeDayAvailabilityRepository;
    private final AvailabilityPeriodRepository availabilityPeriodRepository;
    private final TableTypeRepository tableTypeRepository;
    private final TableTypeBookingSlotRepository tableTypeBookingSlotRepository;

    private final UserContext userContext;

    public DayScheduleService(VenueRepository venueRepository, OwnerRepository ownerRepository, OwnerService ownerService, BookingService bookingService, OperatorRepository operatorRepository, StudentRepository studentRepository, BookingRepository bookingRepository, DayScheduleRepository dayScheduleRepository, TableTypeDayAvailabilityRepository tableTypeDayAvailabilityRepository, AvailabilityPeriodRepository availabilityPeriodRepository, TableTypeRepository tableTypeRepository, TableTypeBookingSlotRepository tableTypeBookingSlotRepository, UserContext userContext) {
        this.venueRepository = venueRepository;
        this.ownerRepository = ownerRepository;
        this.ownerService = ownerService;
        this.bookingService = bookingService;
        this.operatorRepository = operatorRepository;
        this.studentRepository = studentRepository;
        this.bookingRepository = bookingRepository;
        this.dayScheduleRepository = dayScheduleRepository;
        this.tableTypeDayAvailabilityRepository = tableTypeDayAvailabilityRepository;
        this.availabilityPeriodRepository = availabilityPeriodRepository;
        this.tableTypeRepository = tableTypeRepository;
        this.tableTypeBookingSlotRepository = tableTypeBookingSlotRepository;
        this.userContext = userContext;
    }


    // Not called by REST API. Called by booking generator; will consider moving this to other service
    public DaySchedule createDayScheduleFromTemplate(DayScheduleTemplate template, LocalDate date, VenueSchedule venueSchedule) {

        // COPY OVER ALL THE FIELDS FROM THE TEMPLATE
        // Entities to copy wholesale: TableTypeDayAvailability, AvailabilityPeriod
        // Entities to copy reference only (no new entities created): TableType

        DaySchedule newDaySchedule = new DaySchedule();
        newDaySchedule.setDate(date);

//        dayScheduleRepository.saveAndFlush(newDaySchedule); // need to persist the daySchedule first, then later we do the MERGEs

        List<TableTypeDayAvailability> templateTTDAs = template.getTableTypeDayAvailabilities();
        List<TableTypeDayAvailability> newTTDAs = new ArrayList<>();

        for (TableTypeDayAvailability ttda : templateTTDAs) {
            TableTypeDayAvailability newTTDA = new TableTypeDayAvailability();

            List<AvailabilityPeriod> newTTDA_AvailabilityPeriods = new ArrayList<>();
            for (AvailabilityPeriod ap : ttda.getAvailabilityPeriods()) {
                AvailabilityPeriod newAP = new AvailabilityPeriod();
                newAP.setFromTime(ap.getFromTime());
                newAP.setToTime(ap.getToTime());
                newAP.setBasePrice(ap.getBasePrice());
                newAP.setPricePerHalfHour(ap.getPricePerHalfHour());
                newAP.setOverrideDefaultPrice(ap.isOverrideDefaultPrice());
                newAP.setNumAvailable(ap.getNumAvailable());

//                availabilityPeriodRepository.save(newAP);
                newTTDA_AvailabilityPeriods.add(newAP);
            }

            newTTDA.setAvailabilityPeriods(newTTDA_AvailabilityPeriods);

            newTTDA.setBookings(new ArrayList<>());
            newTTDA.setTableTypeBookingSlots(new ArrayList<>());


//            newTTDA.setTableType(tableTypeRepository.findById(ttda.getTableType().getId()).
//                    orElseThrow(() -> new RuntimeException("TableType not found")));
            newTTDA.setTableType(ttda.getTableType());

//            tableTypeDayAvailabilityRepository.save(newTTDA);
            newTTDAs.add(newTTDA);
        }

        newDaySchedule.setTableTypeDayAvailabilities(newTTDAs);

        venueSchedule.getDaySchedules().add(newDaySchedule);
        DaySchedule newManagedSchedule = dayScheduleRepository.saveAndFlush(newDaySchedule);

//         need to set TableTypes as part of a MERGE operation, the previous save only persists the daySchedule
//        List<TableTypeDayAvailability> newManagedTTDAs = newManagedSchedule.getTableTypeDayAvailabilities();
//        for (int i = 0; i < newTTDAs.size(); i++) {
//            newManagedTTDAs.get(i).setTableType(tableTypeRepository.findById(templateTTDAs.get(i).getTableType().getId()).orElseThrow(() -> new RuntimeException("TableType not found")));
////                    orElseThrow(() -> new RuntimeException("TableType not found"))
//        }

        // saving reference to table type, no need to create new entity [ Leave the table type as null for now, will set it later ]
//            newTTDA.setTableType(ttda.getTableType());

        // publish the dayschedule and generate all the booking slots
//        return publishDaySchedule(newDaySchedule);
        return publishDaySchedule(newManagedSchedule);
    }

    // I will be overloading methods; 1 takes in actual entities that they need and does the stuff, the 2nd takes in ids and calls the 1st

    // creating day schedule for TODAY/CURRENT DAY. it uses LocalDate.now()
    public DaySchedule createDaySchedule(Venue venue, LocalDate date) {
        DaySchedule daySchedule = new DaySchedule();
        // just in case, but these should be set by default
        daySchedule.setPublished(false);
        if (date == null) {
            daySchedule.setDate(LocalDate.now());
        } else {
            daySchedule.setDate(date);
        }

        VenueSchedule venueSchedule = venue.getVenueSchedule();
        venueSchedule.getDaySchedules().add(daySchedule);

        return dayScheduleRepository.save(daySchedule);
    }
    public DaySchedule createDaySchedule(Long venueId, LocalDate date) {
        Venue venue = venueRepository.findById(venueId).orElseThrow(() -> new RuntimeException("Venue not found"));
        return createDaySchedule(venue, date);
    }


    public void deleteDaySchedule(Long dayScheduleId) {
        DaySchedule daySchedule = dayScheduleRepository.findById(dayScheduleId).orElseThrow(() ->
                new RuntimeException("DaySchedule with id " + dayScheduleId + " not found"));

        dayScheduleRepository.delete(daySchedule);
    }
    // VERY IMPORTANT TO MAKE IT CLEAR THAT THE DAYSCHEDULE HERE IS AN UNMANAGED DTO TYPECASTED INTO DaySchedule, unlike other methods where it is managed
    public DaySchedule putDaySchedule(DaySchedule dayScheduleDTO, Long venueId) {
        System.out.println("daySchedule id is: " + dayScheduleDTO.getId());
        DaySchedule managedDaySchedule = dayScheduleRepository.findById(dayScheduleDTO.getId()).orElseThrow(() -> new RuntimeException("DaySchedule not found"));
        System.out.println("reached here, before daySchedule isPublished check");

        if (!dayScheduleDTO.isPublished()) {
            return dayScheduleRepository.save(dayScheduleDTO);
        } else {
                List<TableTypeBookingSlot> conflictingBookingSlotEntities = findConflictingBookingSlotEntitiesWhenPublished(dayScheduleDTO);
            System.out.println("conflictingBookingSlotEntities ids (bcos its bidirectional): ");
            conflictingBookingSlotEntities.forEach(bookingSlotEntity -> System.out.println(bookingSlotEntity.getId()));

            System.out.println("calculating and finding conflicting bookings");
                Set<Booking> conflictingBookingEntities = conflictingBookingSlotEntities.stream().flatMap(ttdaBookingSlot -> ttdaBookingSlot.getBookings().stream()).collect(java.util.stream.Collectors.toSet());

            System.out.println("conflictingBookingEntities id: ");
                conflictingBookingEntities.forEach(booking -> System.out.println(booking.getBillableId()));

                if (!conflictingBookingEntities.isEmpty()) {
                    System.out.println("throwing conflicting booking exception");
                    ConflictingBookingsFoundException e = new ConflictingBookingsFoundException("Conflicting bookings found!");
                    e.setBookings(conflictingBookingEntities.stream().toList());
                    throw e;
                }



            DaySchedule managedSavedDaySchedule = dayScheduleRepository.saveAndFlush(dayScheduleDTO); // TODO: Should be fine saving it like this, but if any problems crop up I know where to look
//            System.out.println("logging managedSaveDaySchedule bookingSlot length " + managedSavedDaySchedule.getTableTypeDayAvailabilities().get(0).getTableTypeBookingSlots().size());
//            System.out.println("logging publishedSavedDaySchedule bookingSlot length " + publishedSavedDaySchedule.getTableTypeDayAvailabilities().get(0).getTableTypeBookingSlots().size());

            return managedSavedDaySchedule;
        }
    }

    // note this day schedule hasnt been published yet, so we need to compare the "old/unupdated" booking slots
    // with the "new/updated" booking slots that have yet to be generated
    private List<TableTypeBookingSlot> findConflictingBookingSlotEntitiesWhenPublished(DaySchedule daySchedule) {
//        List<Booking> conflictingBookings = new ArrayList<>();
//        List<String> conflictingBookingsReasons = new ArrayList<>();

        List<TableTypeBookingSlot> oldTableTypeBookingSlots = new ArrayList<>();

        List<TableTypeBookingSlot> newTableTypeBookingSlots = new ArrayList<>();

        List<TableTypeBookingSlot> conflictingOldTableTypeBookingSlots = new ArrayList<>();

        DaySchedule managedDayScheduleEntity = dayScheduleRepository.findById(daySchedule.getId()).orElseThrow(() -> new RuntimeException("Managed DaySchedule not found"));
        // getting old slots
        managedDayScheduleEntity.getTableTypeDayAvailabilities().forEach(ttda -> oldTableTypeBookingSlots.addAll(ttda.getTableTypeBookingSlots()));


        // Generate all the new booking slots only. doesn't attach or modify anything
        for (TableTypeDayAvailability ttda : daySchedule.getTableTypeDayAvailabilities()) {

            // generating new slots (but not assigning them to ttda)
            List<TableTypeBookingSlot> newTtdaBookingSlots = new ArrayList<>();

            for (AvailabilityPeriod ap : ttda.getAvailabilityPeriods()) {
                LocalTime fromTime = ap.getFromTime();
                LocalTime toTime = ap.getToTime();
                Duration duration = Duration.between(fromTime, toTime);
                long numOfThirtyMinuteIntervals = duration.toMinutes() / 30;
                for (int i = 0; i < numOfThirtyMinuteIntervals; i++) {
                    TableTypeBookingSlot ttdaBookingSlot = generateTableTypeBookingSlot(ttda, ap, daySchedule, i);
                    newTtdaBookingSlots.add(ttdaBookingSlot);
                }
            }

            newTableTypeBookingSlots.addAll(newTtdaBookingSlots);
        }


        // comparing old slots with new slots
        oldTableTypeBookingSlots.forEach(oldSlotEntity -> {

            System.out.println("logging oldSlotEntity id: " + oldSlotEntity.getId());
            System.out.println("logging oldSlotEntity table: " + oldSlotEntity.getTableTypeName());
            System.out.println("logging oldSlotEntity bookings:");
            oldSlotEntity.getBookings().forEach(booking -> System.out.println(booking.getBillableId() + " " + booking.getBookStatus()));

            // because the current oldSlot is a DTO rather than a managed entity, we need to get the managed entity
//            TableTypeBookingSlot oldSlotEntity = tableTypeBookingSlotRepository.findById(oldSlot.getId()).orElseThrow(() -> new RuntimeException("Old slot entity not found"));
//            System.out.println("logging oldSlotEntity found id: " + oldSlotEntity.getId());

            int activeBookings = 0;
            List<Booking> bookings = oldSlotEntity.getBookings();
            for (Booking booking : bookings) {
                if (!booking.getBookStatus().equals(BookStatusEnum.CANCELLED)) {
                    activeBookings++;
                }
            }

//            long activeBookings = oldSlotEntity.getBookings().stream()
//                    .filter(booking -> !booking.getBookStatus().equals(BookStatusEnum.CANCELLED)).count();
            System.out.println("logging activeBookings " + activeBookings);
            TableTypeBookingSlot matchedNewSlot = newTableTypeBookingSlots.stream()
                    .filter(newSlot -> areTwoBookingSlotsSameTime(oldSlotEntity, newSlot))
                    .findFirst()
                    .orElse(null);

//            System.out.println("logging matchedNewSlot " + matchedNewSlot.getId() + " at " + matchedNewSlot.getFromDateTime());
            if (matchedNewSlot == null) {
                if (activeBookings > 0) {
                    conflictingOldTableTypeBookingSlots.add(oldSlotEntity); // because there is no new slot that matches the old slot
                }
            } else {
//                System.out.println("logging matchedNewSlot tablesAvailable " + matchedNewSlot.getTablesAvailable());
                if (activeBookings > matchedNewSlot.getTablesAvailable()) {
                    conflictingOldTableTypeBookingSlots.add(oldSlotEntity); // because there are more active bookings than available tables
                }
            }

        });

        System.out.println("logging oldTableTypeBookingSlots");
        oldTableTypeBookingSlots.stream().forEach(oldSlot -> System.out.println(oldSlot.getId() + " at " + oldSlot.getFromDateTime()));
        System.out.println("logging newTableTypeBookingSlots");
        newTableTypeBookingSlots.stream().forEach(newSlot -> System.out.println(newSlot.getId() + " at " + newSlot.getFromDateTime()));
        System.out.println("logging conflictingOldTableTypeBookingSlots");
        conflictingOldTableTypeBookingSlots.stream().forEach(conflictingOldSlot -> System.out.println(conflictingOldSlot.getId() + " at " + conflictingOldSlot.getFromDateTime()));

        return conflictingOldTableTypeBookingSlots;
    }

    private boolean areTwoBookingSlotsSameTime(TableTypeBookingSlot b1, TableTypeBookingSlot b2) {
        // uses isEqual to compare LocalDateTimes instead of equals; the precision of isEquals is seconds while the other is nanoseconds
        if (b1.getTableTypeDayAvailability().getId() != b2.getTableTypeDayAvailability().getId()) {
            return false;
        }

        return b1.getFromDateTime().isEqual(b2.getFromDateTime()) && b1.getToDateTime().isEqual(b2.getToDateTime());
    }

    // Assume the daySchedule that is being taken in is managed.
    public DaySchedule publishDaySchedule(DaySchedule daySchedule) {

//        daySchedule = dayScheduleRepository.findById(daySchedule.getId()).orElseThrow(() -> new RuntimeException("DaySchedule not found"));

        System.out.println("Starting Publishing daySchedule " + daySchedule.getId());
        daySchedule.setPublished(true);

        // Deleting old slots and generating booking slots when published
        for (TableTypeDayAvailability ttda : daySchedule.getTableTypeDayAvailabilities()) {

            System.out.println("logging ttda id: " + ttda.getId());
//            System.out.println("logging ttda booking slot list: " + ttda.getTableTypeBookingSlots());
            System.out.println("Going thru and deleting old booking slots...");
            ttda.getTableTypeBookingSlots().forEach(bookingSlot -> {
                bookingSlot.setTableTypeDayAvailability(null);
                tableTypeBookingSlotRepository.save(bookingSlot);
                System.out.println("logging bookingSlot id: " + bookingSlot.getId());
            });
            tableTypeBookingSlotRepository.deleteAllInBatch(ttda.getTableTypeBookingSlots());
            tableTypeDayAvailabilityRepository.saveAndFlush(ttda);


//            List<TableTypeBookingSlot> oldBookingSlotsWithBookings = new ArrayList<>();

//            ttda.getTableTypeBookingSlots().forEach(ttdaBookingSlot -> {
//                System.out.println("logging ttdaBookingSlot id: " + ttdaBookingSlot.getId());
//                if (ttdaBookingSlot.getBookings().isEmpty()) {
//                    System.out.println("Deleting booking slot: " + ttdaBookingSlot.getId());
//                    tableTypeBookingSlotRepository.delete(ttdaBookingSlot);
//                } else { // should not reach here, but just in case
//                    System.out.println("Booking slot " + ttdaBookingSlot.getId() + " has bookings, not deleting");
//                    oldBookingSlotsWithBookings.add(ttdaBookingSlot);
//                }
//            });

            // GENERATING NEW BOOKING SLOTS
            // create new empty booking slots array; unlikns ttda -> bookingSlots

//            System.out.println("remember to comment these back");
            List<TableTypeBookingSlot> newTtdaBookingSlots = new ArrayList<>();
            ttda.setTableTypeBookingSlots(newTtdaBookingSlots);
            for (AvailabilityPeriod ap : ttda.getAvailabilityPeriods()) {

                LocalTime fromTime = ap.getFromTime();
                LocalTime toTime = ap.getToTime();

                Duration duration = Duration.between(fromTime, toTime);
                long numOfThirtyMinuteIntervals = duration.toMinutes() / 30;

                for (int i = 0; i < numOfThirtyMinuteIntervals; i++) {
                    TableTypeBookingSlot ttdaBookingSlot = generateTableTypeBookingSlot(ttda, ap, daySchedule, i);
                    newTtdaBookingSlots.add(ttdaBookingSlot);
//                    tableTypeBookingSlotRepository.save(ttdaBookingSlot);
                }
            }


            // == THIS PART IS IRRELEVANT SINCE THERE ARE GUARANTEED TO BE NO CONFLICTING BOOKINGS ==
            // remove booking's link with the old booking slots
//            ttda.getBookings().forEach(booking -> booking.setTableTypeBookingSlots(new ArrayList<>()));

//            oldBookingSlotsWithBookings.forEach(oldSlot -> {
//                ttdaBookingSlots.forEach(newSlot -> {
//                    if (areTwoBookingSlotsSameTime(oldSlot, newSlot)) { // will always have 1 match, because the conflict check is done before publishing this
//                        System.out.println("oldSlot " + oldSlot.getId() + "and newSlot " + newSlot.getId() + "are same time");
//                        newSlot.setBookings(oldSlot.getBookings());
//                        newSlot.getBookings().forEach(booking -> booking.getTableTypeBookingSlots().add(newSlot));
//                        int activeBookings = oldSlot.getBookings().stream().filter(booking -> booking.getBookStatus() != BookStatusEnum.CANCELLED).toArray().length;
//                        newSlot.setTablesAvailable(newSlot.getTablesAvailable() - activeBookings);
//                        tableTypeBookingSlotRepository.delete(oldSlot);
//                    }
//                });
//            });

            // replacing TTDA's bookingSlots variable with the newly generated booking slots
            tableTypeDayAvailabilityRepository.saveAndFlush(ttda);
        }

        return dayScheduleRepository.saveAndFlush(daySchedule);
    }
    public DaySchedule publishDaySchedule(Long dayScheduleId) {
        DaySchedule daySchedule = dayScheduleRepository.findById(dayScheduleId).orElseThrow(() -> new RuntimeException("DaySchedule not found"));
        return publishDaySchedule(daySchedule);
    }

    // although the entity name is TableTypeBookingSlot, in actuality its linked to TableTypeDayAvailability rather than the TableType
    private static TableTypeBookingSlot generateTableTypeBookingSlot(TableTypeDayAvailability ttda, AvailabilityPeriod ap, DaySchedule ds, int current30MinuteInterval) {

        TableTypeBookingSlot ttBookingSlot = new TableTypeBookingSlot();

        LocalDate date = ds.getDate();
        LocalTime startTime = ap.getFromTime().plusMinutes(current30MinuteInterval * 30);
        LocalTime endTime = startTime.plusMinutes(30);

        LocalDateTime fromDateTime = LocalDateTime.of(date, startTime);
        LocalDateTime endDateTime = LocalDateTime.of(date, endTime); // technically dont have to do this but its much clearer this way

        ttBookingSlot.setFromDateTime(fromDateTime);
        ttBookingSlot.setToDateTime(endDateTime);
        ttBookingSlot.setTablesAvailable(ap.getNumAvailable());
        ttBookingSlot.setTableTypeDayAvailability(ttda);

        ttBookingSlot.setTableTypeId(ttda.getTableType().getId());
        ttBookingSlot.setTableTypeName(ttda.getTableType().getName());

        ttBookingSlot.setTableTypeDayAvailability(ttda);

        if (ap.isOverrideDefaultPrice()) {
            ttBookingSlot.setSlotBasePrice(ap.getBasePrice());
            ttBookingSlot.setSlotPricePerHalfHour(ap.getPricePerHalfHour());
        } else {
            ttBookingSlot.setSlotBasePrice(ttda.getTableType().getBasePrice());
            ttBookingSlot.setSlotPricePerHalfHour(ttda.getTableType().getPricePerHalfHour());
        }


        return ttBookingSlot;
    }






}
