package com.sgw.backend.repository;

import com.sgw.backend.entity_booking.TableType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableTypeRepository extends JpaRepository<TableType, Long> {
    // You can add custom query methods here if needed
}
