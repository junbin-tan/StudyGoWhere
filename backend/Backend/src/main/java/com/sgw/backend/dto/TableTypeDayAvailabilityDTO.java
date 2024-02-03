package com.sgw.backend.dto;
import lombok.Data;
import java.util.List;

@Data
public class TableTypeDayAvailabilityDTO {
    private long id;
    private List<AvailabilityPeriodDTO> availabilityPeriods;
    private TableTypeDTO tableType;
    private List<BookingDTO> bookings;
    private List<TableTypeBookingSlotDTO> tableTypeBookingSlots;
}
