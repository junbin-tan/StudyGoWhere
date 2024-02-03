package com.sgw.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import com.sgw.backend.entity.TransactionStatusEnum;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {

    private long transactionId;
    private Long payerWalletId;
    private Long receiverWalletId;
    private LocalDateTime createdTime;
    private TransactionStatusEnum transactionStatus;
    private BigDecimal totalPrice;
    private List<TransactionDetailDTO> transactionDetails;
}
