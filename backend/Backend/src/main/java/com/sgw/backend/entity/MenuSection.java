package com.sgw.backend.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long menuSectionId;

    private String menuSectionName;

    private String menuSectionDescription;

    @ManyToOne
    @JsonIgnore
    private Menu menu;

    @OneToMany(mappedBy = "menuSection", cascade = CascadeType.ALL)
    private List<MenuItem> menuItems = new ArrayList<>();
}
