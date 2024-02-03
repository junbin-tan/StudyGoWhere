package com.sgw.backend.repository;

import com.sgw.backend.entity.Billable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillableRepository extends JpaRepository<Billable, Long> {
}
