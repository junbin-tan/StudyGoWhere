package com.sgw.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TableTypeBookingSlotDTO {
    private long id;
    private LocalDateTime fromDateTime;
    private LocalDateTime toDateTime;
    private Long tableTypeId;
    private String tableTypeName;
    private int tablesAvailable;
    private BigDecimal slotBasePrice;
    private BigDecimal slotPricePerHalfHour;
}
