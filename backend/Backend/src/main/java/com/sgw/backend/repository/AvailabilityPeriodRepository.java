package com.sgw.backend.repository;

import com.sgw.backend.entity_booking.AvailabilityPeriod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AvailabilityPeriodRepository extends JpaRepository<AvailabilityPeriod, Long> {
    // You can add custom query methods here if needed
}