package com.sgw.backend.service;

import com.sgw.backend.controller.ReviewController;
import com.sgw.backend.dto.ReviewDTO;
import com.sgw.backend.dto.VenueInformationReviewDTO;
import com.sgw.backend.entity.*;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.exception.InvalidUserException;
import com.sgw.backend.repository.OwnerRepository;
import com.sgw.backend.repository.ReviewRepository;
import com.sgw.backend.repository.StudentRepository;
import com.sgw.backend.repository.VenueRepository;
import com.sgw.backend.utilities.UserContext;
import jakarta.persistence.criteria.Expression;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.function.Predicate;
import java.time.Instant;
import java.util.*;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.function.UnaryOperator;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {
    private static final String USERNAME = "username";
    private static final String STUDENT = "student";
    private static final int PAGE_SIZE = 5 ;
    private static final String RATING = "starRating";
    private static final String VENUE = "venue";
    private static final String VENUE_ID = "venueId";

    private final ReviewRepository reviewRepository;

    private final OwnerRepository ownerRepository;

    private final StudentRepository studentRepository;

    private final VenueRepository venueRepository;

    private final UserContext userContext;

    private final OwnerService ownerService;

    private final StudentService studentService;
    public Pair<List<ReviewDTO>, Long> getReviews(String keyword, String category, Integer page, Long venueId) {
        if (keyword.length() == 0) {
            return searchAndCount(UnaryOperator.identity(), page, venueId);
        }
        if (category.equals(RATING) && !validRating(keyword)) {
            return Pair.of(List.of(), 0L);
        } else {
            return searchAndCount(spec -> Specification.where(wildcardSearchSpecification(keyword, category)).and(spec),
                                          page, venueId);
        }
    }

    private Pair<List<ReviewDTO>, Long> searchAndCount(UnaryOperator<Specification<Review>> operator, Integer page, Long venueId) {
        //verifyUserIdentity(venueId);
        List<Review> reviews = reviewRepository.findAll(operator.apply(Specification.where(matchVenue(venueId))),
                                                         PageRequest.of(page - 1, PAGE_SIZE))
                                                         .getContent();
        Long count = reviewRepository.count(operator.apply(Specification.where(matchVenue(venueId))));
        return Pair.of(reviews.stream().map(ReviewDTO.getReviewDTOMapper()).collect(Collectors.toList()), count);
    }

    private void verifyUserIdentity(Long venueId) {
        userContext.obtainRequesterIdentity((username) -> ownerRepository.getOwnerByUsername(username))
                .filter(o -> o.getVenues().stream().map(v -> v.getVenueId()).anyMatch(id -> id.equals(venueId)))
                .orElseThrow(() -> new InvalidUserException("FORBIDDEN"));
    }

    private Specification<Review> wildcardSearchSpecification(String keyword, String field) {
        return (root, query, criteriaBuilder) -> {
            if (field.equals(STUDENT)) {
                return criteriaBuilder.like(criteriaBuilder.lower(root.get(STUDENT).get(USERNAME)), '%' + keyword.toLowerCase() + '%');
            } else if (field.equals(RATING) && validRating(keyword)) {
                return criteriaBuilder.equal(root.get(field), Integer.parseInt(keyword));
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get(field)), '%' + keyword.toLowerCase() + '%');
        };
    }

    private Specification<Review> matchVenue(Long venueId) {
        return (root, query, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get(VENUE).get(VENUE_ID), venueId);
        };
    }

    private boolean validRating(String rating) {
        return Set.of("1","2", "3", "4", "5").contains(rating.trim());
    }

    public boolean replyReview(String reviewReply, Long reviewId) {
        return userContext.obtainRequesterIdentity((username) -> ownerRepository.getOwnerByUsername(username))
                .map(owner -> {
                    Optional<Review> r = reviewRepository.findById(reviewId);
                    checkUserIdentity(r, owner);
                    r.ifPresent(managedR -> managedR.setOwnerReply(reviewReply));
                    return true;
                }).orElse(false);
    }

    public Review createReview(Review newReview, long venueId){
        Student student = userContext.obtainRequesterIdentity(studentRepository::getStudentByUsername).get();
        Venue venue = venueRepository.getReferenceById(venueId);
        newReview.setStudent(student);
        newReview.setVenue(venue);
        newReview.setCreatedAt(Instant.now());
        Review review = reviewRepository.saveAndFlush(newReview);
        venue.getReviews().add(newReview);
        student.getReviews().add(review);
        venueRepository.saveAndFlush(venue);
        studentRepository.saveAndFlush(student);
        return review;
    }

    public Review updateReview(Review updatedReview){
        Review oldReview = reviewRepository.getReferenceById(updatedReview.getReviewId());
        oldReview.setCreatedAt(Instant.now());
        oldReview.setSubject(updatedReview.getSubject());
        oldReview.setDescription(updatedReview.getDescription());
        oldReview.setStarRating(updatedReview.getStarRating());
        return reviewRepository.saveAndFlush(oldReview);
    }

    public boolean checkIfUserReviewed(long venueId) {
        return reviewRepository.countReviewsForUserInVenue(userContext.obtainRequesterIdentity(studentRepository::getStudentByUsername).get().getUserId(), venueId) > 0;
    }

    private void checkUserIdentity(Optional<Review> r, Owner owner) {
        r.map(r2 -> r2.getVenue())
                .map(v -> v.getOwner())
                .map(o -> o.getUserId())
                .filter(id -> id.equals(owner.getUserId()))
                .orElseThrow(() -> new InvalidUserException("INVALID USER"));
    }

    public List<ReviewUsernameDTO> retrieveVenueReviews(long venueId) {
        System.out.println("CALLING");
        List<Object[]> results = reviewRepository.getVenueReviews(venueId);
        List<ReviewUsernameDTO> venueReviews = new ArrayList<>();
        for (Object[] x : results) {
            ReviewUsernameDTO res = new ReviewUsernameDTO((Review) x[0], (String) x[1]);
            venueReviews.add(res);
        }
        return venueReviews;
    }

    public record ReviewUsernameDTO(Review review, String username) {};

    public void initializeReviews() throws Exception {
        Venue venue = null;
        Owner owner = null;
        if (venueRepository.count() == 0) {
            venue = new Venue();
        } else {
            venue = venueRepository.findById(1L).get();
        }
        if (ownerRepository.count() == 0) {
            owner = new Owner("owner", "password");
            owner.setEmail("leo.mike1356@gmail.com");
            ownerService.addOwner(owner);
        } else {
            owner = ownerRepository.getOwnerByUsername("owner");
        }

        Review review = new Review();
        Student student = new Student(UUID.randomUUID().toString(), "password");
        venue.setOwner(owner);
        owner.getVenues().add(venue);
        review.setVenue(venue);
        venue.getReviews().add(review);
        review.setStudent(student);
        review.setSubject("HERE");
        review.setDescription("DESCCCCCCCCCC");
        review.setStarRating(3);
        studentService.addStudent(student);
        venueRepository.save(venue);
        reviewRepository.save(review);
        ownerRepository.save(owner);
    }
    public void testMethod() {
        generateStatistics(1L);
    }
    public Optional<ReviewStatisticsDTO> generateStatistics(Long venueId) {
        return venueRepository.findById(venueId)
                .filter(authorizationVenueOwner())
                .map(retrieveAndMapStatistics());

    }

    private Function<Venue, ReviewStatisticsDTO> retrieveAndMapStatistics() {
        return v -> {
            double average = venueRepository.getAverageRating(v.getVenueId()).orElse(0.0);
            List<Object[]> objs= venueRepository.countRatings(v.getVenueId());
            HashMap<Integer, Long> starMap = new HashMap<>();
            objs.stream().forEach(x -> {
                if (x.length >= 2 && x[0] instanceof Integer && x[1] instanceof Long) {
                    starMap.put((Integer) x[0], (Long) x[1]);
                }
            });
            return new ReviewStatisticsDTO(average, starMap);
        };
    }

    private Predicate<Venue> authorizationVenueOwner() {
        return venue -> {
            String ownerUsername = venue.getOwner().getUsername();
            return userContext.obtainRequesterIdentity((un) -> ownerRepository.getOwnerByUsername(un))
                    .map(owner -> owner.getUsername().equals(ownerUsername))
                    .orElse(false);
        };
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public void deleteReview(Long reviewId) {
        reviewRepository.findById(reviewId).ifPresent(x -> {
            Venue v = x.getVenue();
            Student s = x.getStudent();
            v.getReviews().remove(x);
            s.getReviews().remove(x);
            reviewRepository.deleteById(x.getReviewId());
        });
    }

    public List<VenueInformationReviewDTO> getStudentReviews() {
        String username = userContext.obtainRequesterIdentity(studentRepository::getStudentByUsername).get().getUsername();
        List<Review> reviews = reviewRepository.getStudentReviews(username);
        List<VenueInformationReviewDTO> reviewStudentDTO = new ArrayList<>();
        for (Review r : reviews) {
            reviewStudentDTO.add(new VenueInformationReviewDTO(r, r.getVenue().getVenueId(), r.getVenue().getVenueName()));
        }
        return reviewStudentDTO;
    }

    public record ReviewStatisticsDTO(double average, HashMap<Integer, Long> count) {}
}
