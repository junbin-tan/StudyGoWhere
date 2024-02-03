package com.sgw.backend.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sgw.backend.entity_venue.Venue;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long menuId;

    private String menuName;

    private String menuDescription;

    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL)
    private List<MenuSection> menuSections = new ArrayList<>();

    @JsonIgnore
    @ManyToOne(optional = false)
    private Owner owner;

    // No venue means its a template menu, if menu is associated with a venue, it is
    // the menu of that venue
    @JsonIgnore
    @OneToOne(optional = true)
    private Venue venue;
}
