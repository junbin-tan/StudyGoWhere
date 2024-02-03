package com.sgw.backend.repository;

import com.sgw.backend.entity.Owner;
import com.sgw.backend.entity.Voucher;
import com.sgw.backend.entity_venue.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

public interface VenueRepository extends JpaRepository<Venue, Long> {

        List<Venue> findByOwnerUserId(Long ownerId);

        List<Venue> findByOwnerUsername(String username);

        @Query("SELECT v, FUNCTION('earth_distance', " +
                "                   FUNCTION('ll_to_earth', :latitude, :longitude), " +
                "                   FUNCTION('ll_to_earth', v.address.latitude, v.address.longitude)) AS distance " +
                "FROM Venue v " +
                "WHERE v.venueStatus = ACTIVATED " +
                "ORDER BY distance")
        public List<Object[]> findAllVenuesAndDistance(@Param("latitude") Double latitude, @Param("longitude") Double longitude);


        List<Venue> findAllByOwnerUsername(String ownerUsername);

        @Query("SELECT v, FUNCTION('earth_distance', " +
                        "                   FUNCTION('ll_to_earth', :latitude, :longitude), " +
                        "                   FUNCTION('ll_to_earth', v.address.latitude, v.address.longitude)) AS distance "
                        +
                        "FROM Venue v " +
                        "WHERE FUNCTION('earth_distance', " +
                        "                 FUNCTION('ll_to_earth', :latitude, :longitude), " +
                        "                 FUNCTION('ll_to_earth', v.address.latitude, v.address.longitude)) <= 2000 " +
                        "AND v.venueStatus = ACTIVATED AND v.adminBanned = FALSE " +
                        "ORDER BY distance")
        public List<Object[]> findVenuesNearMe(@Param("latitude") Double latitude,
                        @Param("longitude") Double longitude);

        @Query("SELECT v, FUNCTION('earth_distance', " +
                "                   FUNCTION('ll_to_earth', :latitude, :longitude), " +
                "                   FUNCTION('ll_to_earth', v.address.latitude, v.address.longitude)) AS distance "
                +
                "FROM Venue v " +
                "WHERE FUNCTION('earth_distance', " +
                "                 FUNCTION('ll_to_earth', :latitude, :longitude), " +
                "                 FUNCTION('ll_to_earth', v.address.latitude, v.address.longitude)) <= 10000 " +
                "AND v.venueStatus = ACTIVATED AND v.adminBanned = FALSE " +
                "ORDER BY distance")
        public List<Object[]> findVenuesNearMeForAdvertTenKm(@Param("latitude") Double latitude,
                                               @Param("longitude") Double longitude);

        @Query("SELECT v.venueId " +
                "FROM Venue v " +
                "INNER JOIN v.owner o " +
                "INNER JOIN o.advertisements a " +
                "WHERE v.venueStatus = ACTIVATED AND v.adminBanned = FALSE " +
                "AND a.billableId = :advertisementId " +  // Filter by advertisement ID
                "ORDER BY FUNCTION('earth_distance', " +
                "FUNCTION('ll_to_earth', :latitude, :longitude), " +
                "FUNCTION('ll_to_earth', v.address.latitude, v.address.longitude)) " +
                "LIMIT 1")
        public Long findVenuesNearMeForAdvert(@Param("advertisementId") long advertisementId,
                                              @Param("latitude") Double latitude,
                                              @Param("longitude") Double longitude);

        @Modifying
        @Transactional
        @Query(value = "CREATE EXTENSION IF NOT EXISTS cube;" +
                        "CREATE EXTENSION IF NOT EXISTS earthdistance", nativeQuery = true)
        public void installEarthDistanceExtension();
        @Query(value = "SELECT AVG(r.starRating) FROM Review r WHERE r.venue.venueId = :venueId")
        public Optional<Double> getAverageRating(@Param("venueId") Long venueId);

        @Query(value = "SELECT r.starRating, COUNT(r.starRating) FROM Review r " +
                "               WHERE r.venue.venueId = :venueId GROUP BY r.starRating")
        public List<Object[]> countRatings(@Param("venueId") Long venueId);

        @Query("SELECT AVG(r.starRating) FROM Venue v LEFT JOIN v.reviews r WHERE v.venueId = :venueId")
        public Double getAverageVenueRating (@Param("venueId") Long venueId);
}
