package com.sgw.backend.entity;

import java.math.BigDecimal;
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
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long menuItemId;

    private String menuItemName;

    private String menuItemDescription;

    private String imageURL;

    private BigDecimal sellingPrice;

    private BigDecimal costPrice;

    private boolean enabled;

    private boolean adminBanned;

    /*
     * This is to increase/decrease the price of each line item based on peak hour
     * price multiplier (e.g. 1.2x) OR vocher multiplier (e.g. 0.8x)
     */
    private double voucherMultiplier = 1.0;

    @ManyToOne
    @JsonIgnore
    private MenuSection menuSection;

    @JsonIgnore
    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL)
    List<MenuItemBillable> menuItemBillables;

}
