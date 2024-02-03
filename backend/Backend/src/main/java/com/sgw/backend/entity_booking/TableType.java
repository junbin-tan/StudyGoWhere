package com.sgw.backend.entity_booking;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Data
public class TableType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    // base price is applied only once per booking
    // but for now we ignore base price, then if everything works we can just implement this
    // (thats also why the default i put ZERO)
    @Column(nullable = false)
    private BigDecimal basePrice = BigDecimal.ZERO;

    // this value will be divided and multiplied accordingly for smaller timeslots;
    // eg. if students books only 30 min slot we just take half of this
    // though tbh pricePerMin is much more convenient, but it's not very human-readable
    @Column(nullable = false)
    private BigDecimal pricePerHalfHour;

    @Column(nullable = false)
    private int seats;

    @Column(nullable = false)
    private boolean deleted = false;

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        TableType tableType = (TableType) obj;
        return this.getId() == tableType.getId();
    }

}