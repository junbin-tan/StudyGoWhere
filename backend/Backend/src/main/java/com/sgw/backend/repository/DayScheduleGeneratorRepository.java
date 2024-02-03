package com.sgw.backend.repository;

import com.sgw.backend.entity_booking.DayScheduleGenerator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DayScheduleGeneratorRepository extends JpaRepository<DayScheduleGenerator, Long> {
}
