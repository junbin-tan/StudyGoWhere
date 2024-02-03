package com.sgw.backend.dto;

import com.sgw.backend.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class VenueInformationReviewDTO {
    private Review review;
    private Long venueId;

    private String venueName;
}
