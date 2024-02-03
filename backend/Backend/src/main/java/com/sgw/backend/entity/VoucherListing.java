package com.sgw.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sgw.backend.entity_venue.Venue;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherListing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long voucherListingId;

    private LocalDate voucherListingDelistDate;

    private Integer validityPeriodInDays;

    private String description;

    private BigDecimal voucherValue;

    private BigDecimal voucherCost;

    private Long voucherStock;

    private boolean enabled;

    private String voucherName;

    private boolean adminBanned;

    private boolean completed;

    @JsonIgnore
    @ManyToOne(optional = false)
    private Owner owner;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Voucher> vouchers;
}
