package com.sgw.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingCreationDTO {
    private List<Long> tableTypeBookingSlotIds;
    private Long venueId;
}
