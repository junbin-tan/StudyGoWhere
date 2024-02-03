package com.sgw.backend.controller;

import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.entity_venue.VenueStatusEnum;
import com.sgw.backend.service.VenueService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class VenueController {

    @Autowired
    private VenueService venueService;

    @GetMapping("venue")
    public List<Venue> getAllVenues() {
        return venueService.getAllVenues();
    }

    @PutMapping("venue/activateVenue/{id}")
    public ResponseEntity<Venue> activateVenue(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(venueService.activateVenue(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("venue/banVenue/{id}")
    public ResponseEntity<Venue> banVenue(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(venueService.banVenue(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping(value = { "venue/{id}", "/student/venue/{id}" })
    public ResponseEntity<Venue> getVenueById(@PathVariable("id") Long id) {

        Venue temp = venueService.getVenueById(id);
        if (temp == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(temp);
    }

    @DeleteMapping("venue/{id}")
    public ResponseEntity<Venue> deleteVenue(@PathVariable Long id) {
        try {
            venueService.deleteVenueAdmin(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("student/venue/getallactivatedvenues")
    public List<Map<String, ?>> getAllActivatedVenues(@RequestParam String latitude, @RequestParam String longitude) {
        List<Venue> venues = venueService.getAllVenues();
        Iterator<Venue> iterator = venues.iterator();
        // Remove deactivated venues
        while (iterator.hasNext()) {
            Venue venue = iterator.next();
            if (venue.getVenueStatus().equals(VenueStatusEnum.DEACTIVATED)) {
                iterator.remove();
            }
        }
        try {
            double myLat = Double.parseDouble(latitude);
            double myLong = Double.parseDouble(longitude);
            List<Map<String, ?>> res = venueService.getAllVenuesByDistance(myLat, myLong);
            System.out.println(res.get(0).get("distance"));
            return res;
        } catch (Exception e) {
            System.out.println("ERR - " + e.toString());
            return null;
        }

    }

    @GetMapping("student/venue/rating")
    public ResponseEntity getAverageVenueRatings(@PathVariable("venueId") long venueId) {
        return ResponseEntity.ok(venueService.getAverageVenueRatings(venueId));
    }

}
