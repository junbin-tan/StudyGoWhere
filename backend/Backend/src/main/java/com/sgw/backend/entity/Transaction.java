package com.sgw.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long transactionId;

    // the handling of the totalPrice should be handled by TransactionService i
    // think
    // private BigDecimal transactionTotalPrice;

    @OneToOne(mappedBy = "transaction", optional = true)
    private Billable billable;

    @ManyToOne(optional = false)
    private Wallet payerWallet;

    @ManyToOne(optional = false)
    private Wallet receiverWallet;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdTime;

    private TransactionStatusEnum transactionStatus;

    private Boolean refunded = false;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL)
    private List<TransactionDetail> transactionDetails = new ArrayList<>();

    public Transaction(Wallet payerWallet, Wallet receiverWallet) {
        this.payerWallet = payerWallet;
        this.receiverWallet = receiverWallet;
        this.createdTime = LocalDateTime.now();
    }

    public Transaction(Billable billable, Wallet payerWallet, Wallet receiverWallet) {
        this.billable = billable;
        this.payerWallet = payerWallet;
        this.receiverWallet = receiverWallet;
        this.createdTime = LocalDateTime.now();
    }

    public void addTransactionDetail(TransactionDetail detail) {
        this.transactionDetails.add(detail);
        detail.setTransaction(this);
    }

}
