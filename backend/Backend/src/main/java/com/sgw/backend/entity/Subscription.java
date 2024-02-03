package com.sgw.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription extends Billable {

    private String subscriptionName;

    private LocalDate dateCreated;

    private LocalDate subscriptionPeriodStart;

    private LocalDate subscriptionPeriodEnd;

    private Integer subscriptionDurationDays;

    private Integer venueListingLimit;

    // private BigDecimal subscriptionPrice;

    private String subscriptionDetails;

    private String ownerUsername;

    private Long originalSubscriptionTypeId;

    @JsonIgnore
    @ManyToOne
    private Owner purchasingOwner;

    @Override
    public String getLabel() {
        return subscriptionName + " Subscription";
    }
}
