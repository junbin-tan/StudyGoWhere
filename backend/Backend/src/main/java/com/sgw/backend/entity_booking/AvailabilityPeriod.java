package com.sgw.backend.entity_booking;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Data
public class AvailabilityPeriod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private int numAvailable;

    @Column(nullable = false)
    @Temporal(TemporalType.TIME)
    private LocalTime fromTime;
    @Column(nullable = false)
    @Temporal(TemporalType.TIME)
    private LocalTime toTime;

    // if they want to override the TableType price. small feature tho, can remove if it doesn't work out
    @Column(nullable = false)
    private boolean overrideDefaultPrice = false;

    @Column(nullable = false)
    private BigDecimal basePrice = BigDecimal.ZERO;
    @Column(nullable = false)
    private BigDecimal pricePerHalfHour;

}