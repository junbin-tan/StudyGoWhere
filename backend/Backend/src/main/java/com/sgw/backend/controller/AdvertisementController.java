package com.sgw.backend.controller;

import com.sgw.backend.entity.Advertisement;
import com.sgw.backend.entity.Ticket;
import com.sgw.backend.service.AdvertisementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AdvertisementController {

    private final AdvertisementService advertisementService;

    @GetMapping("/owner/advertisement/retrieve")
    public List<Advertisement> getAllAdsByOwner() {
        return advertisementService.getAssociatedAdvertisement();
    }

    @PostMapping("/owner/advertisement/create")
    public ResponseEntity createAdvertisement(@Valid @RequestBody Advertisement ad) {
        try {
            System.out.println("called");
            Advertisement a = advertisementService.createAdvertisement2(ad);
            return ResponseEntity.ok(a);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/admin/advertisement/getAllPendingAdvertisement")
    public List<Advertisement> getAllPendingAdvertisement() {
        return advertisementService.getAllPendingAdvertisement();
    }

    @GetMapping("/admin/advertisement/everythingElseExceptPendingAdvertisement")
    public ResponseEntity everythingElseExceptPendingAdvertisement() {
        try {
            List<Advertisement> advertisements = advertisementService.everythingElseExceptPendingAdvertisement();
            return ResponseEntity.ok(advertisements);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/admin/advertisement/getAllAdvertisement")
    public List<Advertisement> getAllAdvertisement() {
        return advertisementService.getAllAdvertisement();
    }

    @GetMapping("/admin/advertisement/getAdvert/{id}")
    public Advertisement getAdvertisementById(@PathVariable("id") Long id) {
        return advertisementService.getAdvertisementById(id);
    }

    @GetMapping("/owner/advertisement/getAdvert/{id}")
    public Advertisement getAdvertisementByIdForOwner(@PathVariable("id") Long id) {
        return advertisementService.getAdvertisementById(id);
    }

    // UPDATE ADVERTISEMENT ALLOW ADMIN TO APPROVE AND REJECT
    @PutMapping("/admin/advertisement/update/{id}")
    public ResponseEntity updateAdvertisement(@PathVariable Long id, @RequestBody Advertisement advertisement) {
        try {
            return ResponseEntity.ok(advertisementService.updateAdvertisement(id, advertisement));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @PutMapping("/owner/advertisement/markAsComplete/{id}")
    public ResponseEntity markAdvertisementAsComplete(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(advertisementService.markAdvertisementAsComplete(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    @GetMapping("/student/advertisement")
    public List<Advertisement> getNearbyStudentAdvertisement(@RequestParam String latitude,
            @RequestParam String longitude) {
        try {
            double myLat = Double.parseDouble(latitude);
            double myLong = Double.parseDouble(longitude);
            System.out.println("OK - Lat: " + myLat + " Long: " + myLong);
            return advertisementService.getAdvertisementsNearMe(myLat, myLong);

        } catch (Exception e) {
            System.out.println("ERR - " + e.toString());
            return null;
        }
    }

    @GetMapping("/student/advertisement/nearestVenue")
    public long getNearbyVenueByAdvertisementId(@RequestParam long advertisementId, @RequestParam String latitude,
            @RequestParam String longitude) {
        try {
            double myLat = Double.parseDouble(latitude);
            double myLong = Double.parseDouble(longitude);
            return advertisementService.getNearbyVenueByAdvertisementId(advertisementId, myLat, myLong);
        } catch (Exception e) {
            System.out.print(e.getMessage());
            return -1L;
        }

    }

    @GetMapping("/public/advertisementcleanup")
    public void advertisementCleanUpTask() {
        advertisementService.completeAllAdvertisementScheduler();
    }

    // @GetMapping("/student/advertisement")
    // public List<Advertisement> getNearbyStudentAdvertisement() {
    // try {
    // // THIS LAT LONG IS ANG MO KIO HUB
    // double myLat = 1.369115;
    // double myLong = 103.845436;
    // System.out.println("OK - Lat: " + myLat + " Long: " + myLong);
    // return advertisementService.getAdvertisementsNearMe(myLat, myLong);
    //
    // } catch (Exception e) {
    // System.out.println("ERR - " + e.toString());
    // return null;
    // }
    // }
}
