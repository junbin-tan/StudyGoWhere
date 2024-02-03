package com.sgw.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sgw.backend.entity_venue.Venue;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long reviewId;

    private String subject;

    private Integer starRating;

    private String description;

    private String ownerReply;

    private Instant createdAt = Instant.now();

//    @ElementCollection
//    private List<String> images;

    @JsonIgnore
    @ManyToOne(optional = false)
    private Student student;

    @JsonIgnore
    @ManyToOne(optional = false)
    private Venue venue;

//    public Review() {
//        this.images = new ArrayList<>();
//    }
//
//    public long getReviewId() {
//        return reviewId;
//    }
//
//    public void setReviewId(long reviewId) {
//        this.reviewId = reviewId;
//    }
//
//    public String getSubject() {
//        return subject;
//    }
//
//    public void setSubject(String subject) {
//        this.subject = subject;
//    }
//
//    public Integer getStarRating() {
//        return starRating;
//    }
//
//    public void setStarRating(Integer starRating) {
//        this.starRating = starRating;
//    }
//
//    public String getDescription() {
//        return description;
//    }
//
//    public void setDescription(String description) {
//        this.description = description;
//    }
//
//    public List<String> getImages() {
//        return images;
//    }
//
//    public void setImages(List<String> images) {
//        this.images = images;
//    }
//
//    public String getOwnerReply() {
//        return ownerReply;
//    }
//
//    public void setOwnerReply(String ownerReply) {
//        this.ownerReply = ownerReply;
//    }
//
//    public Student getStudent() {
//        return student;
//    }
//
//    public void setStudent(Student student) {
//        this.student = student;
//    }
//
//    public Venue getVenue() {
//        return venue;
//    }
//
//    public void setVenue(Venue venue) {
//        this.venue = venue;
//    }
}
