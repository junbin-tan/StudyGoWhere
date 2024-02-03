package com.sgw.backend.service;

import com.sgw.backend.entity_booking.*;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.repository.*;
import com.sgw.backend.utilities.UserContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class TableTypeDayAvailabilityService {

    private final VenueRepository venueRepository;

    private final OwnerRepository ownerRepository;

    private final OwnerService ownerService;

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

    public TableTypeDayAvailabilityService(VenueRepository venueRepository, OwnerRepository ownerRepository, OwnerService ownerService, OperatorRepository operatorRepository, StudentRepository studentRepository, BookingRepository bookingRepository, DayScheduleRepository dayScheduleRepository, TableTypeDayAvailabilityRepository tableTypeDayAvailabilityRepository, AvailabilityPeriodRepository availabilityPeriodRepository, TableTypeRepository tableTypeRepository, TableTypeBookingSlotRepository tableTypeBookingSlotRepository, UserContext userContext) {
        this.venueRepository = venueRepository;
        this.ownerRepository = ownerRepository;
        this.ownerService = ownerService;
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



    public TableTypeDayAvailability createTTDA(TableType tableType, DaySchedule daySchedule) {
        TableTypeDayAvailability ttda = new TableTypeDayAvailability();
        ttda.setTableType(tableType);
        daySchedule.getTableTypeDayAvailabilities().add(ttda);

        return tableTypeDayAvailabilityRepository.save(ttda);
    }
    public TableTypeDayAvailability createTTDA(Long tableTypeId, Long dayScheduleId) {
        TableType tableType = tableTypeRepository.findById(tableTypeId).orElseThrow(() -> new RuntimeException("TableType not found"));
        DaySchedule daySchedule = dayScheduleRepository.findById(dayScheduleId).orElseThrow(() -> new RuntimeException("DaySchedule not found"));
        return createTTDA(tableType, daySchedule);
    }


    public AvailabilityPeriod createAvailabilityPeriod(AvailabilityPeriod availabilityPeriod, TableTypeDayAvailability ttda) {
//        availabilityPeriod.setTableTypeDayAvailability(ttda); if we want to set it bidirectional; for now its ttda -> availabilityPeriod
        ttda.getAvailabilityPeriods().add(availabilityPeriod);
        return availabilityPeriodRepository.save(availabilityPeriod);
    }
    public AvailabilityPeriod createAvailabilityPeriod(AvailabilityPeriod availabilityPeriod, Long ttdaId) {
        TableTypeDayAvailability ttda = tableTypeDayAvailabilityRepository.findById(ttdaId).orElseThrow(() -> new RuntimeException("TableTypeDayAvailability not found"));
        return createAvailabilityPeriod(availabilityPeriod, ttda);
    }

    // since we already send in the ttda Id in the previous few anyway, we might as well just send in here as well.
    // because we can technically query the DB to see who has this specific availabilityPeriod, and then remove it from that ttda's collection
    public TableTypeDayAvailability deleteAvailabilityPeriod(AvailabilityPeriod availabilityPeriod, TableTypeDayAvailability ttda) {
        ttda.getAvailabilityPeriods().remove(availabilityPeriod); // TEST THIS? maybe need to override equals() and hashcode() in AvailabilityPeriod if lombok cocks up
        availabilityPeriodRepository.delete(availabilityPeriod);
        return ttda;
    }

    // actually we can pass in the ID only also, but for consistency's sake we pass in the whole availabilityperiod object
    // because while we don't need any AvailabilityPeriod details here, just the id, the createAvailabilityPeriod will require the whole object
    public TableTypeDayAvailability deleteAvailabilityPeriod(AvailabilityPeriod availabilityPeriod, Long ttdaId) {
        TableTypeDayAvailability ttda = tableTypeDayAvailabilityRepository.findById(ttdaId).orElseThrow(() -> new RuntimeException("TableTypeDayAvailability not found"));
        AvailabilityPeriod managedAvailabilityPeriod = availabilityPeriodRepository.findById(availabilityPeriod.getId())
                .orElseThrow(() -> new RuntimeException("AvailabilityPeriod not found"));

        return deleteAvailabilityPeriod(managedAvailabilityPeriod, ttda);
    }

}
