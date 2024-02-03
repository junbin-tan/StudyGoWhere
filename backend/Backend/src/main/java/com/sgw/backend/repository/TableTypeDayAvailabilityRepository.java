package com.sgw.backend.repository;

import com.sgw.backend.entity_booking.TableTypeDayAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableTypeDayAvailabilityRepository extends JpaRepository<TableTypeDayAvailability, Long> {
    // You can add custom query methods here if needed
}
