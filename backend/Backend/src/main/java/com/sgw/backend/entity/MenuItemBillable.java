package com.sgw.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@DiscriminatorValue("menu_item_billable")
public class MenuItemBillable extends Billable {

    private String menuItemBillableName;

    private String menuItemDescription;

    private String imageURL;

    // Status of order delivery?
    private String status;

    private LocalDateTime purchaseTime;

    private BigDecimal costPrice;

    @ManyToOne
    private MenuItem menuItem;

    @JsonIgnore
    @ManyToOne(optional = false)
    private Student menuItemBillableStudent;

    @Override
    public String getLabel() {
        return menuItemBillableName;
    }
}
