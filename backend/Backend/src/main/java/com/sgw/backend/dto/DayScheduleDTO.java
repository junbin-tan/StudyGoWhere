package com.sgw.backend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
public class DayScheduleDTO {

    private Long id;
    private LocalDate date;
    private boolean published;
    private List<TableTypeDayAvailabilityDTO> tableTypeDayAvailabilities;

    // Constructors, getters, and setters

}
