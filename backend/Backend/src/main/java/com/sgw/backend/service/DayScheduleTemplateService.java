package com.sgw.backend.service;

import com.sgw.backend.entity_booking.*;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.repository.*;
import com.sgw.backend.utilities.UserContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DayScheduleTemplateService {

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
    private final DayScheduleTemplateRepository dayScheduleTemplateRepository;

    private final UserContext userContext;

    public DayScheduleTemplateService(VenueRepository venueRepository, OwnerRepository ownerRepository, OwnerService ownerService, BookingService bookingService, OperatorRepository operatorRepository, StudentRepository studentRepository, BookingRepository bookingRepository, DayScheduleRepository dayScheduleRepository, TableTypeDayAvailabilityRepository tableTypeDayAvailabilityRepository, AvailabilityPeriodRepository availabilityPeriodRepository, TableTypeRepository tableTypeRepository, TableTypeBookingSlotRepository tableTypeBookingSlotRepository, DayScheduleTemplateRepository dayScheduleTemplateRepository, UserContext userContext) {
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
        this.dayScheduleTemplateRepository = dayScheduleTemplateRepository;
        this.userContext = userContext;
    }

    public DayScheduleTemplate createDayScheduleTemplate(Long venueId) {
        Venue managedVenue = venueRepository.findById(venueId).orElseThrow(() -> new RuntimeException("Venue with id " + venueId + " not found"));

        DayScheduleTemplate dayScheduleTemplate = new DayScheduleTemplate();
        dayScheduleTemplate.setName("New Template");

        DayScheduleTemplate savedTemplate = dayScheduleTemplateRepository.save(dayScheduleTemplate);
        managedVenue.getVenueSchedule().getDayScheduleTemplates().add(savedTemplate);
        return savedTemplate;
    }
    @Transactional // this save doesn't cover persist/creation, only edit
    public DayScheduleTemplate saveDayScheduleTemplate(DayScheduleTemplate unmanDayScheduleTemplate, Long venueId) {

        Venue managedV = venueRepository.findById(venueId).orElseThrow(() -> new RuntimeException("Venue with id " + venueId + " not found"));
        DayScheduleTemplate managedTemplate = dayScheduleTemplateRepository.findById(unmanDayScheduleTemplate.getId()) // this is just detecting if the template exists
                .orElseThrow(() -> new RuntimeException("DayScheduleTemplate with id " + unmanDayScheduleTemplate.getId() + " not found"));

        return dayScheduleTemplateRepository.save(unmanDayScheduleTemplate);
    }

    public VenueSchedule deleteDayScheduleTemplate(Long dayScheduleTemplateId, Long venueId) {

        // there should only be 1 venueSchedule that contain the template, but there is no db restrictions regarding this

        Venue v = venueRepository.findById(venueId).orElseThrow(() -> new RuntimeException("Venue with id " + venueId + " not found"));
        VenueSchedule vs = v.getVenueSchedule();
        DayScheduleGenerator dsg = v.getVenueSchedule().getDayScheduleGenerator();

        vs.getDayScheduleTemplates().removeIf(t -> t.getId().equals(dayScheduleTemplateId));

        if (dsg.getMon() != null && dsg.getMon().getId() == dayScheduleTemplateId) {
            dsg.setMon(null);
        }
        if (dsg.getTue() != null && dsg.getTue().getId() == dayScheduleTemplateId) {
            dsg.setTue(null);
        }
        if (dsg.getWed() != null && dsg.getWed().getId() == dayScheduleTemplateId) {
            dsg.setWed(null);
        }
        if (dsg.getThu() != null && dsg.getThu().getId() == dayScheduleTemplateId) {
            dsg.setThu(null);
        }
        if (dsg.getFri() != null && dsg.getFri().getId() == dayScheduleTemplateId) {
            dsg.setFri(null);
        }
        if (dsg.getSat() != null && dsg.getSat().getId() == dayScheduleTemplateId) {
            dsg.setSat(null);
        }
        if (dsg.getSun() != null && dsg.getSun().getId() == dayScheduleTemplateId) {
            dsg.setSun(null);
        }

        dayScheduleTemplateRepository.deleteById(dayScheduleTemplateId);

        return vs;
}

    public List<DayScheduleTemplate> getAllDayScheduleTemplates() {
        return dayScheduleTemplateRepository.findAll();
    }

    public DayScheduleTemplate testSave(DayScheduleTemplate dayScheduleTemplate) {
        return dayScheduleTemplateRepository.save(dayScheduleTemplate);
    }
}
