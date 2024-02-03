package com.sgw.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Advertisement extends Billable {

//    @ElementCollection
//    private List<String> images;

    private String name;

    private String image;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    private String adCreatorUsername;

    // TODO: BILLABLE PRICE IS THE ADVERTISEMENT BUDGET

    // cost per view is set by owner to decide how much he want to pay per impression
    private BigDecimal costPerImpression;

    // this allows the us or users to see the number of max impression they can have left
    // TODO: HANDLE AND CALCULATE
    private Long impressionsLeft;

    // KIV THIS FEATURE
//    private BigDecimal costPerClick;

    // TODO: HANDLE AND CALCULATE
    private BigDecimal budgetLeft;

    // TODO: Reach and Impression IDS will store the ID of who viewed the add

    //impression total number of display not unique
    // TODO: HANDLE AND CALCULATE
    @ElementCollection
    private List<Long> impressionIds;

    private Long impressionCount;

    //reach is the total number of unique people who see your content
    // TODO: HANDLE AND CALCULATE
    @ElementCollection
    private Map<Long, Long> reachIds;

    private Long reachCount;

    private AdvertisementStatusEnum advertisementStatus;

    private String rejectionReason;

    @JsonIgnore
    @ManyToOne(optional = false)
    private Owner owner;


    @Override
    public String getLabel() {
        return name;
    }
//    public Advertisement() {
//        this.impressionIds = new ArrayList<>();
//        this.reachIds = new HashMap<>();
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
//    public String getDescription() {
//        return description;
//    }
//
//    public void setDescription(String description) {
//        this.description = description;
//    }
//
//    public LocalDate getStartDate() {
//        return startDate;
//    }
//
//    public void setStartDate(LocalDate startDate) {
//        this.startDate = startDate;
//    }
//
//    public LocalDate getEndDate() {
//        return endDate;
//    }
//
//    public void setEndDate(LocalDate endDate) {
//        this.endDate = endDate;
//    }
//
//    public String getRequestorEmail() {
//        return requestorEmail;
//    }
//
//    public void setRequestorEmail(String requestorEmail) {
//        this.requestorEmail = requestorEmail;
//    }
//
//    public String getRequestorName() {
//        return requestorName;
//    }
//
//    public void setRequestorName(String requestorName) {
//        this.requestorName = requestorName;
//    }
//
//    public String getRequestorPhoneNumber() {
//        return requestorPhoneNumber;
//    }
//
//    public void setRequestorPhoneNumber(String requestorPhoneNumber) {
//        this.requestorPhoneNumber = requestorPhoneNumber;
//    }
//
//    public BigDecimal getAmountCharge() {
//        return amountCharge;
//    }
//
//    public void setAmountCharge(BigDecimal amountCharge) {
//        this.amountCharge = amountCharge;
//    }
//
//    public AdvertisementStatusEnum getAdvertisementStatus() {
//        return advertisementStatus;
//    }
//
//    public void setAdvertisementStatus(AdvertisementStatusEnum advertisementStatus) {
//        this.advertisementStatus = advertisementStatus;
//    }
//
//    public Owner getOwner() {
//        return owner;
//    }
//
//    public void setOwner(Owner owner) {
//        this.owner = owner;
//    }
}
