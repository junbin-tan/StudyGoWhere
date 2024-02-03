package com.sgw.backend.repository;

import com.sgw.backend.entity_booking.TableTypeBookingSlot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableTypeBookingSlotRepository extends JpaRepository<TableTypeBookingSlot, Long> {
    // You can add custom query methods here if needed
}