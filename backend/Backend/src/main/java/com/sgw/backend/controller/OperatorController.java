package com.sgw.backend.controller;


import com.sgw.backend.entity.Owner;
import com.sgw.backend.entity_venue.Operator;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.service.OperatorService;
import com.sgw.backend.service.VenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/owner") // we still set request mapping to owner, for simplicity's sake (security config reasons)
public class OperatorController {

    @Autowired
    private OperatorService operatorService;


    @GetMapping("/get-operator")
    public ResponseEntity<?> getOperatorByToken() {
        // the typecasted operatorUser won't have all the operator info, so have to find one again
//            ObjectMapper mapper = new ObjectMapper();
//            String json = mapper.writeValueAsString(responseDTO);
        Object operatorWithVenueDTO = operatorService.getOperatorByToken();
        if (operatorWithVenueDTO != null) {
            return ResponseEntity.ok(operatorWithVenueDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


}

