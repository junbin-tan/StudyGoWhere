package com.sgw.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long walletId;

    private BigDecimal walletBalance;

    @OneToOne(mappedBy = "wallet", optional = false, cascade = CascadeType.PERSIST)
    @JsonIgnore
    private GeneralUser generalUser;

    // TEMPORARY WE NEED TO CHANGE THIS TO CUSTOM SERIALISE OR SOMETHING CAUSE 
    @JsonIgnore
    @OneToMany(mappedBy = "payerWallet")
    private List<Transaction> outgoingTransactions;
    @JsonIgnore
    @OneToMany(mappedBy = "receiverWallet")
    private List<Transaction> incomingTransactions;

    @OneToMany(mappedBy = "voucherWallet")
    private List<Voucher> vouchers;

    public Wallet() {
        this.outgoingTransactions = new ArrayList<>();
        this.incomingTransactions = new ArrayList<>();
        this.vouchers = new ArrayList<>();
        this.walletBalance = BigDecimal.ZERO;
    }
}
