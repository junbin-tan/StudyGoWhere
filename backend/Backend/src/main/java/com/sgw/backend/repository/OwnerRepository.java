package com.sgw.backend.repository;

import com.sgw.backend.entity.Owner;
import com.sgw.backend.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional(readOnly = true)
public interface OwnerRepository extends JpaRepository<Owner, Long> {
    Owner getOwnerByUserId(Long userId);
    public Owner getOwnerByUsername(String username);

    public Owner findByEmail(String email);

    public Boolean existsByEmail(String email);

    @Query(value = "SELECT DISTINCT o FROM Owner o LEFT JOIN FETCH o.venues WHERE o NOT IN " +
            "(SELECT o FROM Owner o INNER JOIN o.subscription s " +
            "WHERE :currDate BETWEEN s.subscriptionPeriodStart AND s.subscriptionPeriodEnd) " +
            "AND o.venues IS NOT EMPTY")
    public List<Owner> findVenuesToCompletelyDisable(@Param("currDate") LocalDate currDate);

    @Query(value = "SELECT DISTINCT o, s FROM Owner o " +
                    "JOIN FETCH o.subscription s " +
                    "WHERE (:currDate BETWEEN s.subscriptionPeriodStart AND s.subscriptionPeriodEnd) " +
                    "AND s.venueListingLimit < SIZE(o.venues)")
    public List<Object[]> findVenuesToPartiallyDisable(@Param("currDate") LocalDate currDate);

}

