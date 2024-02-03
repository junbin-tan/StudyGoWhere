package com.sgw.backend.entity_venue;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Embeddable
@Data
public class FromToTime {

    private LocalTime fromTime;
    private LocalTime toTime;
}
