package com.sgw.backend.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import com.sgw.backend.entity.MenuItem;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    @Query("SELECT DISTINCT mi.menuSection.menu.venue.venueId FROM MenuItem mi WHERE mi.menuItemId = :menuItemId")
    Long findVenueIdByMenuItemId(Long menuItemId);
}
