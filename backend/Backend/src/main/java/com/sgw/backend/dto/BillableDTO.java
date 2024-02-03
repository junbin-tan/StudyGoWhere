package com.sgw.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillableDTO {

    private long billableId;
    private String billableName;
    private BigDecimal billablePrice;
}
