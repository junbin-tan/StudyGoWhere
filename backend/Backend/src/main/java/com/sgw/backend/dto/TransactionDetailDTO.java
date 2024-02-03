package com.sgw.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDetailDTO {

    private long transactionDetailId;
    private List<BillableDTO> billables;
    private BigDecimal subtotal;
}
