package com.sgw.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public record AdminWalletDTO (
        BigDecimal walletBalance
){

}
