package com.sgw.backend.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("voucher")
public class Voucher extends Billable {

    private String voucherName;

    private BigDecimal voucherValue;

    private String voucherCode;

    private LocalDate voucherExpiryDate;

    private VoucherStatusEnum voucherStatusEnum;

    private String voucherApplicableVenue;

    // Mcdonalds voucher implementation variables
    // Activate then usable (15min)
    private boolean isActive;

    private LocalDateTime activationTime;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "voucher_student_id")
    private Student voucherStudent;

    @JsonIgnore // adding this just in case... i foresee many problems
    @ManyToOne
    private Wallet voucherWallet;

    @Override
    public String getLabel() {
        return voucherName;
    }
}
