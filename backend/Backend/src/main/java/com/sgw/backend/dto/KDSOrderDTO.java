package com.sgw.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class KDSOrderDTO {
    private List<MenuItemNameQuantityDTO> items;
    private Long transactionId;
    private String username;
}
