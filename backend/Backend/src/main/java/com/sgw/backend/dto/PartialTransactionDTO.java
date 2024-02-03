package com.sgw.backend.dto;

import com.sgw.backend.entity.TransactionStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PartialTransactionDTO(
        Long transactionId,
        String payer,
        String receiver,
        BigDecimal totalAmount,
        LocalDateTime createdAt,

        TransactionStatusEnum transactionStatusEnum,
        Boolean refunded
) {
}
