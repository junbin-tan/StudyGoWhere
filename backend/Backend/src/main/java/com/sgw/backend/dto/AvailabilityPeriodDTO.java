package com.sgw.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalTime;

@Data
public class AvailabilityPeriodDTO {
    private long id;
    private int numAvailable;
    private LocalTime fromTime;
    private LocalTime toTime;
    private boolean overrideDefaultPrice = false;
    private BigDecimal basePrice = BigDecimal.ZERO;
    private BigDecimal pricePerHalfHour;
}
