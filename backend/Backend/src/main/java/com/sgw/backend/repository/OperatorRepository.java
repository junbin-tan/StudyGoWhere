package com.sgw.backend.repository;

import com.sgw.backend.entity_venue.Operator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperatorRepository extends JpaRepository<Operator, Long> {
    Operator getOperatorByUserId(Long userId);
    Operator getOperatorByUsername(String username);

}

