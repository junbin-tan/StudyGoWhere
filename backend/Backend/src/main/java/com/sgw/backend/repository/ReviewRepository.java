package com.sgw.backend.repository;

import com.sgw.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional(readOnly = true)
public interface ReviewRepository extends JpaRepository<Review, Long>, JpaSpecificationExecutor<Review> {
    @Query("SELECT COUNT(r) FROM Review r WHERE r.student.userId = :userId AND r.venue.venueId = :venueId")
    Long countReviewsForUserInVenue(@Param("userId") Long userId, @Param("venueId") Long venueId);

    @Query("SELECT r, r.student.username FROM Review r WHERE r.venue.venueId = :venueId ORDER BY r.createdAt DESC")
    List<Object[]> getVenueReviews(@Param("venueId") Long venueId);

    @Query("SELECT r FROM Review r WHERE r.student.username = :username ORDER BY r.createdAt DESC")
    List<Review> getStudentReviews(@Param("username") String username);
}
