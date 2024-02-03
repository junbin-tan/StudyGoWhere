package com.sgw.backend.dto;
import com.sgw.backend.entity.BookStatusEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDTO {
    private long billableId;
    private String billableName;
    private BigDecimal billablePrice;
    private BookStatusEnum bookStatus;
    private LocalDateTime fromDateTime;
    private LocalDateTime toDateTime;
    private List<TableTypeBookingSlotDTO> tableTypeBookingSlots;
}

