package com.sgw.backend.repository;

import com.sgw.backend.entity_venue.BusinessHours;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperatingHourRepository extends JpaRepository<BusinessHours, Long> {
}
