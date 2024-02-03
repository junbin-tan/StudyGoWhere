package com.sgw.backend.entity_venue;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sgw.backend.entity.*;
import com.sgw.backend.entity_booking.TableType;
import com.sgw.backend.entity_booking.VenueSchedule;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.databind.ser.impl.SimpleBeanPropertyFilter;
import com.fasterxml.jackson.databind.ser.impl.SimpleFilterProvider;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(exclude = {"operator", "address", "venueSchedule", "menu"})
@Entity
@Data
// @JsonFilter("venueFilter")
// @JsonIdentityInfo(
// generator = ObjectIdGenerators.PropertyGenerator.class,
// property = "venueId")
@AllArgsConstructor
public class Venue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long venueId; // changed entity long to Long so we can have null value for id

    private String venueName;

    @Column(length = 510)
    private String description;

    //REMOVE THIS ONE IS NOT USED JB & RYAN 9 NOV
    @ElementCollection
    private List<String> venueMenu;

    @ElementCollection
    private List<String> amenities;

    @JsonIgnore // remove this if we want to use JsonIdentityInfo
    @ManyToOne
    private Owner owner;

    private String ownerUsername;

    private Integer averagePrice;

    private String phoneNumber;

    private VenueCrowdLevelEnum venueCrowdLevel;
    private VenueStatusEnum venueStatus;

    private boolean adminBanned;

    @ElementCollection
    private List<String> images;

    private String displayImagePath;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private BusinessHours businessHours;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private Operator operator;

    @OneToMany(mappedBy = "venue")
    private List<Review> reviews;

    @OneToOne(mappedBy = "venue", cascade = CascadeType.ALL, orphanRemoval = true)
    private Address address;

    @OneToOne
    private VenueSchedule venueSchedule;

//    @OneToMany(mappedBy = "venue")
    @OneToMany // not mapped by anyth, this is unidirectional
    private List<TableType> tableTypes;
    @OneToOne(mappedBy = "venue", cascade = CascadeType.ALL, orphanRemoval = true)
    private Menu menu;

    public Venue() {
        this.venueMenu = new ArrayList<>();
        this.amenities = new ArrayList<>();
        this.images = new ArrayList<>();
        this.reviews = new ArrayList<>();
        this.venueCrowdLevel = VenueCrowdLevelEnum.GREEN;
        this.venueStatus = VenueStatusEnum.DEACTIVATED;
        this.tableTypes = new ArrayList<>();
    }

    @Override
    public String toString() {
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            return objectMapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return super.toString();
        }
    }
}
