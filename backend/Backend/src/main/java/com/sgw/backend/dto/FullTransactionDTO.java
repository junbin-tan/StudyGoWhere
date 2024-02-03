package com.sgw.backend.dto;

import com.sgw.backend.entity.TransactionStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record FullTransactionDTO (
        Long transactionId,
        String payer,
        String receiver,
        BigDecimal totalAmount,
        LocalDateTime createdAt,
        List<BillableDTO> billableDTOList,
        TransactionStatusEnum transactionStatusEnum,
        Boolean refunded) {

}


