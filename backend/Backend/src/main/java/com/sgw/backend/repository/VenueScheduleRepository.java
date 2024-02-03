package com.sgw.backend.repository;

import com.sgw.backend.entity_booking.VenueSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueScheduleRepository extends JpaRepository<VenueSchedule, Long> {
}
