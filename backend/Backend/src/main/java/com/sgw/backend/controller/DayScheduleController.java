package com.sgw.backend.controller;

import com.sgw.backend.entity_booking.*;
import com.sgw.backend.exception.ConflictingBookingsFoundException;
import com.sgw.backend.repository.DayScheduleRepository;
import com.sgw.backend.service.BookingService;
import com.sgw.backend.service.DayScheduleGeneratorService;
import com.sgw.backend.service.DayScheduleService;
import com.sgw.backend.service.DayScheduleTemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
//@RequestMapping("/day-schedule")
@RequiredArgsConstructor
public class DayScheduleController {
    @Autowired
    BookingService bookingService;

    @Autowired
    DayScheduleService dayScheduleService;

    @Autowired
    DayScheduleTemplateService dayScheduleTemplateService;

    @Autowired
    DayScheduleRepository dayScheduleRepository;

    @Autowired
    DayScheduleGeneratorService dayScheduleGeneratorService;

    // we can use this if u don't want to pass in all tableType objects, the bookingCreationDTO has venueId and List<Long> of tableTypeBookingSlots
//    @PostMapping("/student/booking")
//    public ResponseEntity<?> createBooking(@RequestBody BookingCreationDTO bookingCreationDTO) {
//        bookingService.createBooking()
//    }

    @DeleteMapping(value = { "/public/delete-day-schedule", "/owner/delete-day-schedule" })
    public ResponseEntity<?> deleteDaySchedule(@RequestParam long dayScheduleId) {
        try {
            System.out.println("deleting day schedule of id: " + dayScheduleId);
            dayScheduleService.deleteDaySchedule(dayScheduleId);
            return ResponseEntity.ok("Deletion of day schedule with id " + dayScheduleId + " successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping(value = { "/public/create-day-schedule-today", "/owner/create-day-schedule-today" })
    public ResponseEntity<?> createDayScheduleToday(@RequestParam long venueId) {
        try {
            System.out.println("creating day schedule today for venue of id: " + venueId);
            return ResponseEntity.ok(dayScheduleService.createDaySchedule(venueId, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(value = { "/public/create-day-schedule", "/owner/create-day-schedule" })
    public ResponseEntity<?> createDaySchedule(@RequestParam long venueId, @RequestBody LocalDate date) {
        try {
            System.out.println("creating day schedule for venue of id: " + venueId);
            return ResponseEntity.ok(dayScheduleService.createDaySchedule(venueId, date));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // for testing and fooling around
//    @GetMapping(value = { "/public/testParams" })
//    public void testParams(@RequestParam Optional<String> saveOption) {
//        System.out.println("saveOption: " + saveOption.orElse("string doesnt exist"));
//    }

    @PostMapping(value = { "/public/save-day-schedule", "/owner/save-day-schedule" })
    public ResponseEntity<?> saveDaySchedule(@RequestBody DaySchedule daySchedule, @RequestParam Long venueId) {
        try {
            System.out.println("Saving day schedule of id: " + daySchedule.getId());
            DaySchedule updatedDaySchedule = dayScheduleService.putDaySchedule(daySchedule, venueId);
//            if (updatedDaySchedule.isPublished()) {
//                updatedDaySchedule = dayScheduleService.publishDaySchedule(updatedDaySchedule.getId());
//            }
//            DaySchedule testFetchSchedule = dayScheduleRepository.findById(updatedDaySchedule.getId()).orElseThrow(() -> new RuntimeException("DaySchedule with id " + updatedDaySchedule.getId() + " not found"));
            return ResponseEntity.ok().body(updatedDaySchedule);
        } catch (ConflictingBookingsFoundException e) { // returns list of conflicting bookings
            return ResponseEntity.status(409).body(e.getBookings());
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
        }
    }

    @PostMapping(value = { "/public/publish-day-schedule", "/owner/publish-day-schedule" })
    public ResponseEntity<?> publishDaySchedule(@RequestParam long dayScheduleId) {
        try {
            System.out.println("publishing day schedule of id: " + dayScheduleId);
            DaySchedule publishedDaySchedule = dayScheduleService.publishDaySchedule(dayScheduleId);
            return ResponseEntity.ok(publishedDaySchedule);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping(value = { "/public/get-all-day-schedule-template", "/owner/get-all-day-schedule-template" })
    public ResponseEntity<?> getAllDayScheduleTemplates() {
        List<DayScheduleTemplate> managedDayScheduleTemplates = dayScheduleTemplateService.getAllDayScheduleTemplates();
        return ResponseEntity.ok(managedDayScheduleTemplates);
    }

    @PostMapping(value = { "/public/create-day-schedule-template", "/owner/create-day-schedule-template" })
    public ResponseEntity<?> createDayScheduleTemplate(@RequestParam Long venueId) {
        System.out.println("trying to create empty day schedule template for venue of id: " + venueId);
        DayScheduleTemplate managedDayScheduleTemplate = dayScheduleTemplateService.createDayScheduleTemplate(venueId);
        System.out.println("saving success..?" + venueId);
        return ResponseEntity.ok(managedDayScheduleTemplate);
    }
    @PostMapping(value = { "/public/save-day-schedule-template", "/owner/save-day-schedule-template" })
    public ResponseEntity<?> saveDayScheduleTemplate(@RequestParam Long venueId, @RequestBody DayScheduleTemplate dayScheduleTemplateDTO) {
            System.out.println("trying to save day schedule template for venue of id: " + venueId);
            DayScheduleTemplate managedDayScheduleTemplate = dayScheduleTemplateService.saveDayScheduleTemplate(dayScheduleTemplateDTO, venueId);
            System.out.println("saving success..?" + venueId);
            return ResponseEntity.ok(managedDayScheduleTemplate);
    }
    @PostMapping(value = { "/public/save-day-schedule-templates", "/owner/save-day-schedule-templates" })
    public ResponseEntity<?> saveDayScheduleTemplates(@RequestParam Long venueId, @RequestBody List<DayScheduleTemplate> dayScheduleTemplates) {
        System.out.println("trying to save day schedule template for venue of id: " + venueId);
        List<DayScheduleTemplate> savedDayScheduleTemplates = new ArrayList<>();
        for (DayScheduleTemplate dayScheduleTemplate : dayScheduleTemplates) {
            DayScheduleTemplate managedDayScheduleTemplate = dayScheduleTemplateService.saveDayScheduleTemplate(dayScheduleTemplate, venueId);
            savedDayScheduleTemplates.add(managedDayScheduleTemplate);
        }
        return ResponseEntity.ok(savedDayScheduleTemplates);
    }

    @DeleteMapping(value = { "/public/delete-day-schedule-template", "/owner/delete-day-schedule-template" })
    public ResponseEntity<?> deleteDayScheduleTemplate(@RequestParam Long dayScheduleTemplateId, @RequestParam Long venueId) {
        try {
            System.out.println("deleting day schedule template with id: " + dayScheduleTemplateId);
            VenueSchedule modifiedVenueSchedule = dayScheduleTemplateService.deleteDayScheduleTemplate(dayScheduleTemplateId, venueId);
            return ResponseEntity.ok(modifiedVenueSchedule);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping(value = { "/public/get-all-day-schedule-generator", "/owner/get-all-day-schedule-generator" })
    public ResponseEntity<?> getAllDayScheduleGenerators() {
        return ResponseEntity.ok(dayScheduleGeneratorService.getAllDayScheduleGenerators());
    }
    @PostMapping(value = { "/public/save-day-schedule-generator", "/owner/save-day-schedule-generator" })
    public ResponseEntity<?> saveDayScheduleGenerator(@RequestBody DayScheduleGenerator dayScheduleGenerator) {
        return ResponseEntity.ok(dayScheduleGeneratorService.saveDayScheduleGenerator(dayScheduleGenerator));
    }

    @GetMapping(value = { "/public/generate-day-schedules", "/owner/generate-day-schedules" })
    public ResponseEntity<?> generateDaySchedules(@RequestParam Long dayScheduleGeneratorId) {
        return ResponseEntity.ok(dayScheduleGeneratorService.generateDaySchedules(dayScheduleGeneratorId));
    }

    @PostMapping(value = { "/public/test-time-string", "/owner/test-time-string" })
    public ResponseEntity<?> testReceivingTimeString(@RequestBody LocalTime localTime) {
        try {
            System.out.println("received localtime as " + localTime);
            return ResponseEntity.ok(localTime);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
