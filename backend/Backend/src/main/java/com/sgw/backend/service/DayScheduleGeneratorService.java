package com.sgw.backend.service;

import com.sgw.backend.entity_booking.*;
import com.sgw.backend.repository.*;
import com.sgw.backend.utilities.UserContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class DayScheduleGeneratorService {


    private final DayScheduleService dayScheduleService;
    private final VenueRepository venueRepository;

    private final OwnerRepository ownerRepository;

    private final OwnerService ownerService;

    // REPOSITORIES
    private final OperatorRepository operatorRepository;

    private final StudentRepository studentRepository;
    private final DayScheduleRepository dayScheduleRepository;
    private final TableTypeDayAvailabilityRepository tableTypeDayAvailabilityRepository;
    private final AvailabilityPeriodRepository availabilityPeriodRepository;
    private final TableTypeRepository tableTypeRepository;
    private final TableTypeBookingSlotRepository tableTypeBookingSlotRepository;
    private final DayScheduleGeneratorRepository dayScheduleGeneratorRepository;
    private final DayScheduleTemplateRepository dayScheduleTemplateRepository;

    private final UserContext userContext;

    public DayScheduleGeneratorService(DayScheduleService dayScheduleService, VenueRepository venueRepository, OwnerRepository ownerRepository, OwnerService ownerService, OperatorRepository operatorRepository, StudentRepository studentRepository, DayScheduleRepository dayScheduleRepository, TableTypeDayAvailabilityRepository tableTypeDayAvailabilityRepository, AvailabilityPeriodRepository availabilityPeriodRepository, TableTypeRepository tableTypeRepository, TableTypeBookingSlotRepository tableTypeBookingSlotRepository, DayScheduleGeneratorRepository dayScheduleGeneratorRepository, DayScheduleTemplateRepository dayScheduleTemplateRepository, UserContext userContext) {
        this.dayScheduleService = dayScheduleService;
        this.venueRepository = venueRepository;
        this.ownerRepository = ownerRepository;
        this.ownerService = ownerService;
        this.operatorRepository = operatorRepository;
        this.studentRepository = studentRepository;
        this.dayScheduleRepository = dayScheduleRepository;
        this.tableTypeDayAvailabilityRepository = tableTypeDayAvailabilityRepository;
        this.availabilityPeriodRepository = availabilityPeriodRepository;
        this.tableTypeRepository = tableTypeRepository;
        this.tableTypeBookingSlotRepository = tableTypeBookingSlotRepository;
        this.dayScheduleGeneratorRepository = dayScheduleGeneratorRepository;
        this.dayScheduleTemplateRepository = dayScheduleTemplateRepository;
        this.userContext = userContext;
    }

    public List<DayScheduleGenerator> getAllDayScheduleGenerators() {
        return dayScheduleGeneratorRepository.findAll();
    }

    public DayScheduleGenerator saveDayScheduleGenerator(DayScheduleGenerator dayScheduleGenerator) {
        return dayScheduleGeneratorRepository.save(dayScheduleGenerator);
    }

    // maybe don't need this also, if we do the "put" way
    public DayScheduleGenerator assignDayScheduleTemplateToDaysOfWeek(Long dayScheduleGeneratorId, Long dayScheduleTemplateId, List<String> daysOfWeek) {
        DayScheduleGenerator dayScheduleGenerator = dayScheduleGeneratorRepository.findById(dayScheduleGeneratorId)
                .orElseThrow(() -> new RuntimeException("DayScheduleGenerator with id " + dayScheduleGeneratorId + " not found"));

        DayScheduleTemplate dayScheduleTemplate = dayScheduleTemplateRepository.findById(dayScheduleTemplateId)
                .orElseThrow(() -> new RuntimeException("DayScheduleTemplate with id " + dayScheduleTemplateId + " not found"));

        return assignDayScheduleTemplateToDaysOfWeek(dayScheduleGenerator, dayScheduleTemplate, daysOfWeek);
    }
    public DayScheduleGenerator assignDayScheduleTemplateToDaysOfWeek(DayScheduleGenerator dayScheduleGenerator, DayScheduleTemplate dayScheduleTemplate, List<String> daysOfWeek) {

        daysOfWeek.stream().map((dayOfWeek) -> dayOfWeek.toUpperCase())
                .forEach((dayOfWeek) -> {
                    switch (dayOfWeek) { // enhanced switch statement
                        case "MON" -> dayScheduleGenerator.setMon(dayScheduleTemplate);
                        case "TUE" -> dayScheduleGenerator.setTue(dayScheduleTemplate);
                        case "WED" -> dayScheduleGenerator.setWed(dayScheduleTemplate);
                        case "THU" -> dayScheduleGenerator.setThu(dayScheduleTemplate);
                        case "FRI" -> dayScheduleGenerator.setFri(dayScheduleTemplate);
                        case "SAT" -> dayScheduleGenerator.setSat(dayScheduleTemplate);
                        case "SUN" -> dayScheduleGenerator.setSun(dayScheduleTemplate);
                        default -> throw new RuntimeException("Invalid day of week");
                    }
                });

        return dayScheduleGeneratorRepository.save(dayScheduleGenerator);
    }

    public List<DaySchedule> generateDaySchedules(Long dayScheduleGeneratorId) {
        DayScheduleGenerator dayScheduleGenerator = dayScheduleGeneratorRepository.findById(dayScheduleGeneratorId)
                .orElseThrow(() -> new RuntimeException("DayScheduleGenerator with id " + dayScheduleGeneratorId + " not found"));
        return generateDaySchedules(dayScheduleGenerator);
    }
    // we can also add a flag for override, but since theres no time im not doing it now
    public List<DaySchedule> generateDaySchedules(DayScheduleGenerator dayScheduleGenerator) {
        int daysLeft = dayScheduleGenerator.getDaysInAdvance();
        VenueSchedule venueSchedule = dayScheduleGenerator.getVenueSchedule();
        List<DaySchedule> generatedSchedules = new ArrayList<>();

        LocalDate currentDay = LocalDate.now();
        while (daysLeft > 0) {
            // potentially adding flag for overriding existing schedules, but not doing it now
            boolean doesVenueAlreadyHaveDayScheduleForDate = false;
            for (DaySchedule ds : venueSchedule.getDaySchedules()) {
                if (ds.getDate().equals(currentDay)) {
                    doesVenueAlreadyHaveDayScheduleForDate = true;
                    break;
                }
            }
            if (doesVenueAlreadyHaveDayScheduleForDate) {
                currentDay = currentDay.plusDays(1);
                daysLeft--;
                continue;
            }

            DayOfWeek currentDayOfWeek = currentDay.getDayOfWeek();

            switch (currentDayOfWeek) {
                case MONDAY -> {
                    if (dayScheduleGenerator.getMon() != null) {
                        generatedSchedules.add(dayScheduleService.createDayScheduleFromTemplate(dayScheduleGenerator.getMon(), currentDay, venueSchedule));
                    }
                }
                case TUESDAY -> {
                    if (dayScheduleGenerator.getTue() != null) {
                        generatedSchedules.add(dayScheduleService.createDayScheduleFromTemplate(dayScheduleGenerator.getTue(), currentDay, venueSchedule));
                    }
                }
                case WEDNESDAY -> {
                    if (dayScheduleGenerator.getWed() != null) {
                        generatedSchedules.add(dayScheduleService.createDayScheduleFromTemplate(dayScheduleGenerator.getWed(), currentDay, venueSchedule));
                    }
                }
                case THURSDAY -> {
                    if (dayScheduleGenerator.getThu() != null) {
                        generatedSchedules.add(dayScheduleService.createDayScheduleFromTemplate(dayScheduleGenerator.getThu(), currentDay, venueSchedule));
                    }
                }
                case FRIDAY -> {
                    if (dayScheduleGenerator.getFri() != null) {
                        generatedSchedules.add(dayScheduleService.createDayScheduleFromTemplate(dayScheduleGenerator.getFri(), currentDay, venueSchedule));
                    }
                }
                case SATURDAY -> {
                    if (dayScheduleGenerator.getSat() != null) {
                        generatedSchedules.add(dayScheduleService.createDayScheduleFromTemplate(dayScheduleGenerator.getSat(), currentDay, venueSchedule));
                    }
                }
                case SUNDAY -> {
                    if (dayScheduleGenerator.getSun() != null) {
                        generatedSchedules.add(dayScheduleService.createDayScheduleFromTemplate(dayScheduleGenerator.getSun(), currentDay, venueSchedule));
                    }
                }
            }

            currentDay = currentDay.plusDays(1);
            daysLeft--;
        }

        // generatedSchedules have all fields empty except dates.
//        generatedSchedules.forEach(emptyDs -> {
//            DayOfWeek dayOfWeek = emptyDs.getDate().getDayOfWeek();
//            switch(dayOfWeek) {
//                case MONDAY -> {
//                    dayScheduleService.copyDayScheduleTemplatePropsIntoDaySchedule(emptyDs, dayScheduleGenerator.getMon());
//                }
//                case TUESDAY -> {
//                    dayScheduleService.copyDayScheduleTemplatePropsIntoDaySchedule(emptyDs, dayScheduleGenerator.getTue());
//                }
//                case WEDNESDAY -> {
//                    dayScheduleService.copyDayScheduleTemplatePropsIntoDaySchedule(emptyDs, dayScheduleGenerator.getWed());
//                }
//                case THURSDAY -> {
//                    dayScheduleService.copyDayScheduleTemplatePropsIntoDaySchedule(emptyDs, dayScheduleGenerator.getThu());
//                }
//                case FRIDAY -> {
//                    dayScheduleService.copyDayScheduleTemplatePropsIntoDaySchedule(emptyDs, dayScheduleGenerator.getFri());
//                }
//                case SATURDAY -> {
//                    dayScheduleService.copyDayScheduleTemplatePropsIntoDaySchedule(emptyDs, dayScheduleGenerator.getSat());
//                }
//                case SUNDAY -> {
//                    dayScheduleService.copyDayScheduleTemplatePropsIntoDaySchedule(emptyDs, dayScheduleGenerator.getSun());
//                }
//            }
//        });


        return generatedSchedules;

    }

}
