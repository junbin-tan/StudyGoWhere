package com.sgw.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long subscriptionTypeId;

    private String subscriptionTypeName;

    private Integer subscriptionTypeVenueLimit;

    private BigDecimal subscriptionTypePrice;

    private Integer subscriptionTypeDuration;

    private String subscriptionTypeDetails;

    private SubscriptionTypeStatusEnum subscriptionTypeStatusEnum;

    @JsonIgnore
    @ManyToOne
    private Admin admin;

}
