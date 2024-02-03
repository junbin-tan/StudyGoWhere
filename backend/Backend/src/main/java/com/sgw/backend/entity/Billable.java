package com.sgw.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "billable_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Billable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long billableId;

    private String billableName;

    @JsonIgnore
    @OneToOne
    private Transaction transaction;

    private BigDecimal billablePrice;

    @ManyToOne // do we really need this bidirectional lol
    @JsonIgnore
    @JoinColumn(name = "transaction_detail_id")
    private TransactionDetail transactionDetail;

    abstract public String getLabel();
}
