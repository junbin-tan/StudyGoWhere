package com.sgw.backend.controller;

import com.sgw.backend.dto.ReviewDTO;
import com.sgw.backend.entity.Review;
import com.sgw.backend.entity.Ticket;
import com.sgw.backend.exception.InvalidUserException;
import com.sgw.backend.repository.ReviewRepository;
import com.sgw.backend.service.ReviewService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    @PostMapping("/owner/review/search")
    public ResponseEntity<Pair<List<ReviewDTO>, Long>> getReviews(@Valid @RequestBody SearchDTO searchDTO) {
        try {
            return ResponseEntity.ok(reviewService.getReviews(searchDTO.keyword,
                                        searchDTO.category, searchDTO.page, searchDTO.venueId));
        } catch (InvalidUserException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    public record SearchDTO(@NotNull Integer page, @NotNull String category,
                            @NotNull String keyword, @NotNull Long venueId) {};

    @PutMapping("/owner/review/reply")
    public ResponseEntity replyReview(@Valid @RequestBody ReplyDTO replyDTO) {
        try {
            if (reviewService.replyReview(replyDTO.reply(), replyDTO.reviewId())) {
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (InvalidUserException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }
    @GetMapping("/owner/venue/{venueId}/statistics")
    public ResponseEntity<ReviewService.ReviewStatisticsDTO> getStatistics(@PathVariable("venueId") Long venueId) {
        return reviewService.generateStatistics(venueId)
                .map(dto -> ResponseEntity.ok(dto))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    @GetMapping("/admin/reviews")
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews().stream()
                .map(ReviewDTO.getReviewDTOMapper()).collect(Collectors.toList()));
    }

    @DeleteMapping("/admin/reviews/{reviewId}")
    public ResponseEntity<List<ReviewDTO>> getAllReviews(@NotNull @PathVariable("reviewId") Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok().build();
    }



    @PostMapping("/student/review")
    public ResponseEntity createReview(@RequestBody ReviewStudentDTO newReview) {
        try {
            System.out.println(newReview);
            Review review = reviewService.createReview(newReview.review(), newReview.venueId());
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/student/review")
    public ResponseEntity updateReview(@RequestBody ReviewStudentDTO newReview) {
        try {
            System.out.println(newReview);
            Review review = reviewService.updateReview(newReview.review());
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/student/review/check")
    public ResponseEntity checkIfUserReviewed(@RequestParam long venueId) {
        try {
            return ResponseEntity.ok(reviewService.checkIfUserReviewed(venueId));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/student/my-review")
    public ResponseEntity getStudentReviews() {
        try {
            return ResponseEntity.ok(reviewService.getStudentReviews());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/student/venue/{venueId}/review")
    public ResponseEntity getVenueReviews(@PathVariable("venueId") long venueId) {
        try {
            return ResponseEntity.ok(reviewService.retrieveVenueReviews(venueId));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    public record ReplyDTO(@NotNull String reply, @NotNull Long reviewId) {};
    public record ReviewStudentDTO(Review review, Long venueId) {};
}
