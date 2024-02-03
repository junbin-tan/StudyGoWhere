package com.sgw.backend.entity;

import jakarta.persistence.Entity;

import java.math.BigDecimal;

@Entity
public class AdminWallet extends Wallet {
    public AdminWallet() {
        super();
        super.setWalletBalance(BigDecimal.valueOf(Long.MAX_VALUE));
    }
    @Override
    public void setWalletBalance(BigDecimal walletBalance) {
    }
}
