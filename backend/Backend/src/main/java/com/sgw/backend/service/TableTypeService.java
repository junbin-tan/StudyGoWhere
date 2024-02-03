package com.sgw.backend.service;

import com.sgw.backend.entity_booking.*;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.exception.TableTypeCurrentlyUsedException;
import com.sgw.backend.repository.*;
import com.sgw.backend.utilities.UserContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TableTypeService {

    private final VenueRepository venueRepository;

    private final OwnerRepository ownerRepository;

    private final OwnerService ownerService;

    // REPOSITORIES
    private final OperatorRepository operatorRepository;

    private final DayScheduleRepository dayScheduleRepository;
    private final DayScheduleTemplateRepository dayScheduleTemplateRepository;
    private final TableTypeDayAvailabilityRepository tableTypeDayAvailabilityRepository;
    private final AvailabilityPeriodRepository availabilityPeriodRepository;
    private final TableTypeRepository tableTypeRepository;
    private final TableTypeBookingSlotRepository tableTypeBookingSlotRepository;

    private final UserContext userContext;

    public TableTypeService(VenueRepository venueRepository, OwnerRepository ownerRepository, OwnerService ownerService, OperatorRepository operatorRepository, DayScheduleRepository dayScheduleRepository, DayScheduleTemplateRepository dayScheduleTemplateRepository, TableTypeDayAvailabilityRepository tableTypeDayAvailabilityRepository, AvailabilityPeriodRepository availabilityPeriodRepository, TableTypeRepository tableTypeRepository, TableTypeBookingSlotRepository tableTypeBookingSlotRepository, UserContext userContext) {
        this.venueRepository = venueRepository;
        this.ownerRepository = ownerRepository;
        this.ownerService = ownerService;
        this.operatorRepository = operatorRepository;
        this.dayScheduleRepository = dayScheduleRepository;
        this.dayScheduleTemplateRepository = dayScheduleTemplateRepository;
        this.tableTypeDayAvailabilityRepository = tableTypeDayAvailabilityRepository;
        this.availabilityPeriodRepository = availabilityPeriodRepository;
        this.tableTypeRepository = tableTypeRepository;
        this.tableTypeBookingSlotRepository = tableTypeBookingSlotRepository;
        this.userContext = userContext;
    }


    // Not called by REST API. Called by booking generator; will consider moving this to other service

    public TableType createTableType(TableType tableType, Venue venue) {
        // because its unidirectional from Venue -> TableType, no need to link the tableType to the venue
        // and the venue shouldn't need to be saved also because it should be a managed entity in all cases
        venue.getTableTypes().add(tableType);
        return tableTypeRepository.save(tableType);
    }
    public TableType createTableType(TableType tableType, Long venueId) {
        Venue venue = venueRepository.findById(venueId).orElseThrow(() -> new RuntimeException("Venue not found"));
        return createTableType(tableType, venue);
    }

    public TableType updateTableType(TableType tableType) {
        // need to warn that this will update all unpublished DaySchedules/DayScheduleTemplates
        // and that this will not update published DaySchedules/DayScheduleTemplates
        // however if the owner wants to override the published DaySchedules/DayScheduleTemplates, there should be an option to do so
        return tableTypeRepository.save(tableType);
    }

    public List<DayScheduleTemplate> getDayScheduleTemplatesByTableTypeId(Long id) {
        TableType managedTableType = tableTypeRepository.findById(id).orElseThrow(() -> new RuntimeException("TableType with id " + id + " not found"));

        return dayScheduleTemplateRepository.findByTableType(managedTableType);
    }

    // soft delete
    public TableType deleteTableType(TableType tableType) {

        // Search for unpublished DaySchedules, and DayScheduleTemplates that are linked to this tableType
        // if there is any, ask the owner to change
        // if there is none, then we can proceed to delete the tableType

        List<DaySchedule> unpublishedDaySchedules = dayScheduleRepository.findByTableTypeAndIsNotPublished(tableType);
        List<DayScheduleTemplate> dayScheduleTemplates = dayScheduleTemplateRepository.findByTableType(tableType);

        if (unpublishedDaySchedules.size() > 0 || dayScheduleTemplates.size() > 0) {

            // Generate a custom exception that has the list of all the ids of the unpublished DaySchedules and DayScheduleTemplates
            List<Long> unpublishedDayScheduleIds = unpublishedDaySchedules.stream().map(DaySchedule::getId).toList();
            List<Long> dayScheduleTemplateIds = dayScheduleTemplates.stream().map(DayScheduleTemplate::getId).toList();
            // note: we use .toList() instead of .collect(Collectors.toList()) here because the former is faster and generates immutable list
            // doesn't matter if its immutable since we're packaging it into the exception anyway
            throw new TableTypeCurrentlyUsedException(
                    "Cannot delete tableType because there are unpublished DaySchedules/DayScheduleTemplates linked to it",
                    unpublishedDayScheduleIds,
                    dayScheduleTemplateIds
                    );
        }

        // TableType should still be linked to venue, just that it's "deleted" and not visible
        tableType.setDeleted(true);
        return tableTypeRepository.save(tableType);
    }

    public TableType getTableTypeById(Long id) {
        return tableTypeRepository.findById(id).orElseThrow(() -> new RuntimeException("TableType with id " + id + " not found"));
    }




}
