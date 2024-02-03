package com.sgw.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.sgw.backend.entity.GeneralUser;
import com.sgw.backend.entity.Owner;
import com.sgw.backend.entity.VoucherListing;
import com.sgw.backend.entity_booking.DayScheduleTemplate;
import com.sgw.backend.entity_booking.TableType;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.exception.*;
import com.sgw.backend.service.*;
import com.sgw.backend.utilities.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping(value = {"/owner", "/public"}) // same as owner controller
public class OwnerBookingController {

    @Autowired
    private OwnerService ownerService;
    @Autowired
    private VenueService venueService;
    @Autowired
    private WalletService walletService;
    @Autowired
    private UserContext userContext;
    @Autowired
    private VoucherListingService voucherListingService;
    // needs to be final for annotations to use variables
    @Autowired
    private TableTypeService tableTypeService;
    private PasswordEncoder passwordEncoder;

    // Though technically the OwnerBookingController, I suppose for simplicity's sake Operator should also be able to access these
    @PutMapping("/create-table-type/{venueId}")
    public ResponseEntity<?> createTableType(@PathVariable("venueId") long venueId, @RequestBody TableType tableType) {
        try {
            TableType createdTableType = tableTypeService.createTableType(tableType, venueId);
            return ResponseEntity.ok(createdTableType);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/delete-table-type")
    public ResponseEntity<?> deleteTableType(@RequestParam long tableTypeId) {
        try {
            TableType toDelete = tableTypeService.getTableTypeById(tableTypeId);
            if (toDelete == null) {
                return new ResponseEntity<>("Table type with id " + tableTypeId + " not found", HttpStatus.BAD_REQUEST);
            }
            tableTypeService.deleteTableType(toDelete);
            return ResponseEntity.ok("Table type with id " + tableTypeId + " deleted");
        } catch (TableTypeCurrentlyUsedException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/edit-table-type")
    public ResponseEntity<?> editTableType(@RequestBody TableType tableType) {
        try {
            TableType editedTableType = tableTypeService.updateTableType(tableType);
            return ResponseEntity.ok(editedTableType);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/get-table-type-by-id")
    public ResponseEntity<?> getTableTypeById(@RequestParam Long id) {
        try {
            TableType tableType = tableTypeService.getTableTypeById(id);
            return ResponseEntity.ok(tableType);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping(value = "/get-day-schedules-templates-by-table-type-id")
    public ResponseEntity<?> getDayScheduleTemplatesByTableTypeId(@RequestParam Long tableTypeId) {
        try {
            List<DayScheduleTemplate> dayScheduleTemplates = tableTypeService.getDayScheduleTemplatesByTableTypeId(tableTypeId);
            return ResponseEntity.ok(dayScheduleTemplates);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}