package com.sgw.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.sgw.backend.entity.*;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.exception.OperatorUsernameAlreadyTakenException;
import com.sgw.backend.exception.UsernameAlreadyExistsException;
import com.sgw.backend.exception.VenueDoesNotBelongToRequesterException;
import com.sgw.backend.exception.VenueNotFoundException;
import com.sgw.backend.service.*;
import com.sgw.backend.utilities.UserContext;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@Slf4j
//@RequestMapping(value = "/public/owner") // CHANGE THIS BACK TO OWNER WITHOUT THE PUBLIC EVENTUALLY
public class OwnerController {

    @Autowired
    private OwnerService ownerService;
    @Autowired
    private VenueService venueService;
    @Autowired
    private WalletService walletService;
    @Autowired
    private UserContext userContext;
    @Autowired
    private VoucherListingService voucherListingService;
    @Autowired
    private TransactionService transactionService;
    // needs to be final for annotations to use variables

    private PasswordEncoder passwordEncoder;
    /**
     * need to secure authorization, only admin can call this?
     * @return
     */
    @GetMapping("/owner")
    public List<Owner> getAllOwners() {
        return ownerService.getAllOwners();
    }

    @PostMapping("/owner")
    public ResponseEntity<?> postOwner(@RequestBody Owner owner) {
        try {
            ownerService.addOwner(owner);

            owner.setAdvertisements(null);
            owner.setVenues(null);
            owner.setWallet(null);
            owner.setTickets(null);
            owner.setSubscription(null);
            owner.setAutoRenewSubscription(true);

        } catch (UsernameAlreadyExistsException e) {
            System.out.println("username already exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        } catch (Exception e) {
            System.out.println("something happened");
            System.out.println(e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error in creating owner");
            // throw new RuntimeException(e);
        }
        return ResponseEntity.ok().body(owner);
    }

    @GetMapping(value = "/owner/{id}")
        // need to catch exception here? maybe if user doesnt exist
    public Owner getOwnerById(@PathVariable("id") Long id) {
        try {
            return ownerService.getOwnerById(id);
        } catch (Exception e) {
            // will make custom exception later
            System.out.println("User with id " + id + " does not exist");
            // return some error request to client
        }

        // placeholder
        return null;
    }

    @GetMapping("/owner/check-email")
    public ResponseEntity<Boolean> checkEmailExists(@RequestParam String email) {
        boolean emailExists = ownerService.existsByEmail(email);
        return ResponseEntity.ok(emailExists);
    }

    @GetMapping("/owner/get-owner")
    public Owner getOwnerByToken() {
        Owner ownerUser = (Owner) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        // the typecasted ownerUser won't have all the details, so have to find one again
        Owner realOwnerUserObject = ownerService.getOwnerByUsername(ownerUser.getUsername());
        return realOwnerUserObject;
    }

    @GetMapping(value = "/owner/all-venue")
    public List<Venue> getALlVenues() {
        List<Venue> listOfVenues = venueService.getAllVenues();
        List<Venue> listToReturn = new ArrayList<>();
        listOfVenues.forEach(venue -> {
            listToReturn.add(venueService.responseBodifyVenue(venue));
        });
        return listToReturn;
    }

    // no exception handling for now
    @GetMapping("/owner/get-venue")
    public List<Venue> getVenuesOfOwner() {
        Owner ownerUser = (Owner) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String ownerUsername = ownerUser.getUsername();
//        System.out.println("HELLOOO USER ID IS" + ownerUser.getUserId());
        List<Venue> listToReturn = venueService.getAllVenueByOwnerUsername(ownerUsername);
//        List<Venue> listToReturn = new ArrayList<>();
//        listOfVenues.forEach(venue -> {
//            listToReturn.add(venueService.responseBodifyVenue(venue));
//        });

        System.out.println(listToReturn);

        return listToReturn;
    }

    /**
     * Returns Venue object if owner of venue requested matches token's owner
     * @param venueId
     * @return
     */
    @GetMapping("/owner/get-venue/{venueId}")
    public ResponseEntity<?> getVenueById(@PathVariable("venueId") Long venueId) {
        Owner ownerUser = (Owner) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String ownerUsername = ownerUser.getUsername();

        Venue venueToReturn = venueService.getVenueByVenueId(venueId);
        System.out.println(venueToReturn);

        if (ownerUsername.equals(venueToReturn.getOwner().getUsername())) {
            return ResponseEntity.ok().body(venueToReturn);
        } else {
            return ResponseEntity.status(401).body("owner of venue requested (" +
                    venueToReturn.getOwner().getUsername() +
                    ") doesn't match token owner (" +
                    ownerUsername +
                    "), or sth else failed");
        }

    }
    @PostMapping("/owner/post-venue")
    public ResponseEntity<?> postVenue(@RequestBody Venue venue) {
        try {
            Venue addedVenue = venueService.addVenueV2(venue);
            return ResponseEntity.ok().body(addedVenue);
        } catch (OperatorUsernameAlreadyTakenException e) {
            return ResponseEntity.status(409).body("Operator username already taken");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body("Error with creating venue; check backend and this exception:" + e.getMessage());
        }
    }

    /**
     * this very very very likely needs to be changed
     * either that, we have separate endpoints for updating venue images, venue tables, etc.
     *
     * Issue is especially when we have nested entities like VoucherListing which also has a list of Vouchers
     * To what extent do we include this information when frontend is sending backend this data (and vice versa)
     * @param v
     * @return
     */
    @PutMapping("/owner/put-venue")
    public ResponseEntity<?> putVenue(@RequestBody Venue v) {
        try {
            Venue putVenue = venueService.updateVenue(v);
            return ResponseEntity.ok().body(putVenue);
        } catch (OperatorUsernameAlreadyTakenException e) {
            return ResponseEntity.status(409).body("Operator username already taken");
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body("Error with updating venue; check backend and this exception:" + e.getMessage());
        }
    }

    @PutMapping("/owner/put-venue/{venueId}/displayImagePath")
    public ResponseEntity<?> updateDisplayImagePath(@PathVariable("venueId") Long venueId, @RequestBody String relativePath) {
        try {
            Venue updatedVenue = venueService.updateVenueDisplayImagePath(venueId, relativePath);
            return ResponseEntity.ok().body(updatedVenue);
        } catch (VenueNotFoundException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(404).body("Error with updating venue; venue not found:" + e.getMessage());
        } catch (VenueDoesNotBelongToRequesterException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(403).body("Error with updating venue; venue requested does not belong to requester:" + e.getMessage());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(400).body("Error with updating venue; check backend and this exception:" + e.getMessage());
        }

    }

    /**
     * this is SOFT DELETE
     * @param venueId
     * @return
     */
    @DeleteMapping("/owner/delete-venue/{venueId}")
    public ResponseEntity<?> deleteVenueById(@PathVariable("venueId") Long venueId) {

        try {
            venueService.deleteVenue(venueId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * need to do additional check in next release to check subscription
     * @param venueId
     * @return
     */
    @GetMapping("/owner/toggle-venue-visible-status/{venueId}")
    public ResponseEntity<?> toggleVenueVisibleStatusById(@PathVariable("venueId") Long venueId) {
            venueService.toggleVenueVisibilityStatus(venueId);
            return ResponseEntity.ok().build();
    }
    @PutMapping("/owner/withdraw-balance/")
    public Owner withdrawBalance(@RequestBody JsonNode requestBody) {
        // maybe need an exception if someone is trolling and passes a string for "amount"??
        log.info("request");
        BigDecimal amount = BigDecimal.valueOf(requestBody.get("withdrawAmount").asDouble());
        userContext.obtainRequesterIdentity(username -> ownerService.getOwnerByUsername(username))
                .map(GeneralUser::getWallet)
                .ifPresent(wallet -> transactionService.withdrawBalance(wallet, amount));

        // returns updated owner
        return userContext.obtainRequesterIdentity(username -> ownerService.getOwnerByUsername((username))).get();
    }

    @PutMapping("/owner/update-venue-crowd-level/{venueId}")
    public ResponseEntity<?> updateVenueCrowdLevel(@PathVariable("venueId") Long venueId, @RequestBody Venue venue) {
        try {
            Venue original = venueService.getVenueByVenueId(venueId);
            original.setVenueCrowdLevel(venue.getVenueCrowdLevel());
            Venue updatedVenue = venueService.updateVenueCrowdLevel(original);
            return ResponseEntity.ok(updatedVenue);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }


    @PutMapping("/owner/update-venue-status/{venueId}")
    public ResponseEntity<?> updateVenueStatus(@PathVariable("venueId") Long venueId, @RequestBody Venue venue) {
        try {
            Venue original = venueService.getVenueByVenueId(venueId);
            Venue updatedVenue = venueService.updateVenueStatus(original, venue);
            return ResponseEntity.ok(updatedVenue);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }


    @PutMapping("/owner/updateOwner/{ownerId}")
    public ResponseEntity<?> updateOwner(@PathVariable Long ownerId, @RequestBody Owner owner) {
        try {
//            Owner existingOwner = ownerService.getOwnerById(ownerId);
//
//            if (existingOwner == null) {
//                return ResponseEntity.notFound().build();
//            }

            Owner updateOwner =ownerService.updateOwner(ownerId,owner);
            return ResponseEntity.ok(updateOwner);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/admin/owners")
    public List<Owner> getAllAdminOwners() {
        return ownerService.getAllOwners();
    }

    @PutMapping("admin/owner/activateowner/{id}")
    public ResponseEntity<Owner> activateOwner(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ownerService.activateOwner(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/admin/owner/{id}")
    public ResponseEntity<Owner> getOwnerByIdAdmin(@PathVariable("id") Long id) {
        Owner temp = ownerService.getOwnerById(id);
        if (temp == null)
        {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(temp);
    }


    @PutMapping("owner/updateAutoRenewSubscription/{id}")
    public ResponseEntity<Owner> activateAutoRenew(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ownerService.activateAutoRenewByOwnerId(id));
        } catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/owner/allvenuevoucherlisting")
    public ResponseEntity<List<VoucherListing>> getAllVenueVoucherListing() {
        try {
            return ResponseEntity.ok(voucherListingService.getAllVenueVoucherListing());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/owner/postVoucherListing-forOwner")
    public ResponseEntity<VoucherListing> addVoucherListing(@RequestBody VoucherListing voucherListing) {
        try {
            return ResponseEntity.ok(voucherListingService.addVoucherListing(voucherListing));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/owner/activateDeactivateVoucherListing/{id}")
    public ResponseEntity<VoucherListing> activateDeactivateVoucherListing(@PathVariable Long id){
        try {
            return ResponseEntity.ok(voucherListingService.activateDeactivateVoucherListing(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/owner/getVoucherListingById/{id}")
    public ResponseEntity<VoucherListing> getVoucherListingById(@PathVariable("id") Long id) {
        VoucherListing vc = voucherListingService.getVoucherListingById(id);
        if (vc == null)
        {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(vc);
    }

    @PutMapping("/owner/updateVoucherListing/{id}")
    public ResponseEntity<?> updateVoucherListing(@PathVariable Long id, @RequestBody VoucherListing voucherListing) {
        try {

            VoucherListing vc = voucherListingService.updateVoucherListing(id, voucherListing);
            return ResponseEntity.ok(voucherListing);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @DeleteMapping("/owner/deleteVoucherListing/{id}")
    public void deleteVoucherListing(@PathVariable Long id) {
        voucherListingService.deleteVoucherListing(id);
    }





}