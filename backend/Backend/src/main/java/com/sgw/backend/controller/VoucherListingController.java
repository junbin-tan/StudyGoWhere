package com.sgw.backend.controller;

import com.sgw.backend.entity.VoucherListing;
import com.sgw.backend.service.VoucherListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.sgw.backend.entity.Voucher;
import com.sgw.backend.entity.VoucherListing;
import com.sgw.backend.service.OwnerService;
import com.sgw.backend.service.VoucherListingService;
import com.sgw.backend.service.VoucherService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VoucherListingController {

    @Autowired
    private VoucherService voucherService;

    @Autowired
    private VoucherListingService voucherListingService;

    @Autowired
    private OwnerService ownerService;

    // Get all voucher listings
    @GetMapping("/student/getallvoucherlistings")
    public ResponseEntity<List<VoucherListing>> getAllVenueVoucherListing() {
        try {
            return ResponseEntity.ok(voucherListingService.getAllVenueVoucherListing());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all voucher listings for a specific owner (assuming owner owns multiple
    // same venues - starbucks)
    @GetMapping("/student/getallvoucherlistings/{ownerUsername}")
    public ResponseEntity<List<VoucherListing>> getAllVoucherListingsByOwnerId(@PathVariable String ownerUsername) {
        try {
            List<VoucherListing> voucherListings = voucherListingService
                    .getAllVoucherListingsByOwnerUsername(ownerUsername);

            if (voucherListings.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            // Check if voucher listings are enabled, not completed and not banned
            List<VoucherListing> filteredVoucherListings = voucherListings.stream()
                    .filter(voucherListing -> !voucherListing.isAdminBanned() && !voucherListing.isCompleted()
                            && voucherListing.isEnabled())
                    .toList();

            return ResponseEntity.ok(filteredVoucherListings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Buy a voucher
    // Example api call: http://localhost:5001/student/buyvoucher/1?studentId=1
    @PostMapping("/student/buyvoucher/{voucherListingId}")
    public ResponseEntity<Voucher> buyVoucher(@PathVariable Long voucherListingId, @RequestParam Long studentId) {
        try {
            Voucher voucher = voucherService.buyVoucher(voucherListingId, studentId);
            System.out.println("Voucher bought by student " + studentId + " successfully");
            return ResponseEntity.ok(voucher);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/admin/voucherlisting")
    public List<VoucherListing> getAllVoucherListings() {
        return voucherListingService.getAllVoucherListings();
    }

    @PutMapping("/admin/activateVoucherlisting/{id}")
    public void activateVoucherListing(@PathVariable Long id) {
        voucherListingService.activateVoucherListing(id);
    }

    @GetMapping("/admin/getVoucherlistingById/{id}")
    public VoucherListing getVoucherListingById(@PathVariable Long id) {
        return voucherListingService.getVoucherListingById(id);
    }

    @GetMapping("/public/vccleanup")
    public void vcSchedulder() {
        voucherListingService.voucherListingCleanUpTask();
    }



    // Use a voucher (mcdonalds) - abstract to vouchercontroller
}
