package com.sgw.backend.repository;

import com.sgw.backend.entity_venue.Address;
import com.sgw.backend.entity_venue.Venue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Venue> findByVenueVenueId(Long venueId);

}
