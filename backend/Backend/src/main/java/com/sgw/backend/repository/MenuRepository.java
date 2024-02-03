package com.sgw.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sgw.backend.entity.Menu;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByOwnerUserId(long ownerId);

    Menu findByVenueVenueId(long venueId);
}