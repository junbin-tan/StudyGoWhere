package com.sgw.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sgw.backend.entity.Review;
import com.sgw.backend.entity.Student;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.util.Pair;

import java.time.Instant;
import java.util.List;
import java.util.function.Function;

@Getter
@Setter
@AllArgsConstructor
public class ReviewDTO {

    private Long reviewId;

    private String subject;

    private Integer starRating;

    private String description;

    private String ownerReply;

    private String student;

    private String venue;

    private Instant createdAt;

    public static Function<Review, ReviewDTO> getReviewDTOMapper() {
        return review -> {
            return new ReviewDTO(
                    review.getReviewId(),
                    review.getSubject(),
                    review.getStarRating(),
                    review.getDescription(),
                    review.getOwnerReply(),
                    review.getStudent().getUsername(),
                    review.getVenue().getVenueName(),
                    review.getCreatedAt()
            );
        };
    }
}
