package com.sgw.backend.entity_venue;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDate;

@Embeddable
@Data
public class FromToHolidayDate {

    private LocalDate fromDate; // no need to mark Temporal, JPA does for us
    private LocalDate toDate;
}
