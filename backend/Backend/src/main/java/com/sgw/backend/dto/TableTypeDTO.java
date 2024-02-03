package com.sgw.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TableTypeDTO {
    private long id;
    private String name;
    private String description;
    private BigDecimal basePrice = BigDecimal.ZERO;
    private BigDecimal pricePerHalfHour;
    private int seats;
    private boolean deleted = false;
}
