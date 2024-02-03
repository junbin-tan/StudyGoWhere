package com.sgw.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
public class MenuItemNameQuantityDTO {
    private String menuItemName;
    private Integer quantity;

    public static List<MenuItemNameQuantityDTO> fromMap(Map<String, Integer> map) {
        List<MenuItemNameQuantityDTO> result = new ArrayList<>();

        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            result.add(new MenuItemNameQuantityDTO(entry.getKey(), entry.getValue()));
        }

        return result;
    }
}
