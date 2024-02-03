package com.sgw.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class MenuItemQuantityDTO {
    private Long menuItemId;
    private Integer quantity;

    @Override
    public String toString() {
        return "MenuItemQuantityDTO(menuItemId=" + this.getMenuItemId() + ", quantity=" + this.getQuantity() + ")";
    }
}