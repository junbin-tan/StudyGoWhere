package com.sgw.backend.entity_booking;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Data
public class TableTypeBookingSlot {

    // although the entity name is TableTypeBookingSlot, in actuality its linked to TableTypeDayAvailability rather than the TableType
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @JsonIgnore
    @ManyToMany(mappedBy = "tableTypeBookingSlots")
    private List<Booking> bookings = new ArrayList<>();

    @JsonIgnore
    @ManyToOne
    private TableTypeDayAvailability tableTypeDayAvailability;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime fromDateTime;
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime toDateTime;

    // !! IMPT !! We copy over the TableType name here;
    // because if we have a pointer to TableType, the owner will be unable to delete a TableType.
    private Long tableTypeId;
    private String tableTypeName;

    private int tablesAvailable;

    // we might save slotBasePrice and slotPricePerHalfHour to detach them from AvailabilityPeriod and TableType
    private BigDecimal slotBasePrice;
    private BigDecimal slotPricePerHalfHour;
//    private BigDecimal slotFinalPrice;


    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        TableTypeBookingSlot ttbs = (TableTypeBookingSlot) obj;
        return this.getId() == ttbs.getId();
    }
}