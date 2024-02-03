package com.sgw.backend.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sgw.backend.entity_booking.DayScheduleGenerator;
import com.sgw.backend.entity_booking.VenueSchedule;
import com.sgw.backend.entity_venue.*;
import com.sgw.backend.exception.*;
import com.sgw.backend.repository.*;
import com.sgw.backend.utilities.UserContext;
import org.springframework.data.util.Pair;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.sgw.backend.entity.Owner;
import com.sgw.backend.entity.Subscription;
import com.sgw.backend.exception.UserHasNoValidSubscription;
import com.sgw.backend.repository.AddressRepository;
import com.sgw.backend.repository.OperatingHourRepository;
import com.sgw.backend.repository.OperatorRepository;
import com.sgw.backend.repository.OwnerRepository;
import com.sgw.backend.repository.SubscriptionRepository;
import com.sgw.backend.repository.VenueRepository;

import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class VenueService {

    private final VenueRepository venueRepository;
    private final OwnerRepository ownerRepository;
    private final OwnerService ownerService;
    private final OperatorRepository operatorRepository;
    private final WalletService walletService;

    private final PasswordEncoder passwordEncoder;

    private final UserContext userContext;

    private final SubscriptionRepository subscriptionRepository;
    private final VenueScheduleRepository venueScheduleRepository;
    private final AddressRepository addressRepository;

    public VenueService(VenueRepository venueRepository, OwnerRepository ownerRepository,
                        AddressRepository addressRepository, OwnerService ownerService, OperatorRepository operatorRepository,
                        UserContext userContext, OperatingHourRepository operatingHourRepository, WalletService walletService,
                        PasswordEncoder passwordEncoder, SubscriptionRepository subscriptionRepository, VenueScheduleRepository venueScheduleRepository, AddressRepository addressRepository1) {
        this.venueRepository = venueRepository;
        this.ownerRepository = ownerRepository;
        this.ownerService = ownerService;
        this.operatorRepository = operatorRepository;
        this.userContext = userContext;
        this.subscriptionRepository  = subscriptionRepository;
        this.walletService = walletService;
        this.passwordEncoder = passwordEncoder;
        this.venueScheduleRepository = venueScheduleRepository;
        this.addressRepository = addressRepository1;
    }

    public List<Map<String, ?>> getAllVenuesByDistance(Double latitude, Double longitude) {
        List<Object[]> venuesDistances = venueRepository.findAllVenuesAndDistance(latitude, longitude);

        List<Map<String, ?>> result = new ArrayList<>();

        for (Object[] venueDistance : venuesDistances) {
            Map<String, Object> x = new HashMap<>();
            x.put("venue", venueDistance[0]);
            x.put("distance", venueDistance[1]);
            result.add(x);
        }
        return result;
    }
    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    public List<Venue> getAllVenuesByOwnerId(Long ownerId) {
        return venueRepository.findByOwnerUserId(ownerId);
    }

    public List<Venue> getAllVenueByOwnerUsername(String username) {
        return venueRepository.findByOwnerUsername(username);
    }

    public Venue getVenueByVenueId(Long venueId) {
        return venueRepository.findById(venueId).get();
    }

    private VenueSchedule createVenueSchedule(Venue v) {
        VenueSchedule vs = new VenueSchedule();
        // maxBookingSlots of VenueSchedule is set to max integer value by default
        DayScheduleGenerator dayScheduleGenerator = new DayScheduleGenerator();
        dayScheduleGenerator.setVenueSchedule(vs);

        vs.setDayScheduleGenerator(dayScheduleGenerator);

        // i set cascade on the bookingSlotGenerator to be all, so it should save the bookingSlotGenerator as well
        return venueScheduleRepository.save(vs);
    }

    public Venue addVenueV2(Venue v) throws Exception, OperatorUsernameAlreadyTakenException {
        // make sure venue is new?

        if (v.getVenueId() != null) { // changed entity long to Long so we can have null value for id
            throw new Exception("venue id is not null, can't create venue with id");
        }
        Owner owner = userContext.obtainRequesterIdentity(ownerService::getOwnerByUsername).orElseThrow(() -> new Exception("Owner not found"));

        v.setAdminBanned(false);
        v.setOwner(owner);
        v.setOwnerUsername(owner.getUsername());
        owner.getVenues().add(v);

        v.getAddress().setVenue(v); // because address is bidirectional

        v.setVenueSchedule(createVenueSchedule(v));



        // -- this is just in case when copying/duplicating venues, the frontend forgets to remove id --
        // -- however, this means we have to change the id type to Long instead of the long primitive, --
        // -- as primitives do not allow for null values --
//        v.getAddress().setAddressId(null);
//        v.getBusinessHours().setBusinessHoursId(null);

        // CREATING OPERATOR (or not, if its null)
        // need to properly create a new Operator object with all the wallet and stuff
        Operator op = v.getOperator();

        // check if username is null, that means owner has decided not to create an operator
        if (op == null || op.getUsername() == null || op.getUsername() == "") {
            // ^^ this is because of the way we are doing the frontend, do not touch this
            v.setOperator(null); // remove the operator object from the venue
            return venueRepository.save(v);
        }

        // check if operator username already exists
        if (operatorRepository.getOperatorByUsername(op.getUsername()) != null) {
            throw new OperatorUsernameAlreadyTakenException("Operator username already exists");
        }

        op.setVenue(v);
        op.setPassword(passwordEncoder.encode(op.getPassword()));
        walletService.addNewWalletToUser(v.getOperator());

        return venueRepository.save(v);
    }

    public Venue updateVenueDisplayImagePath(Long venueId, String displayImagePath)
            throws VenueNotFoundException, VenueDoesNotBelongToRequesterException {
        Venue fetchedVenue = venueRepository.findById(venueId).get();
        if (fetchedVenue == null) throw new VenueNotFoundException("Venue not found");
        if (!checkIfVenueBelongsToTokenOwner(fetchedVenue)) {
            throw new VenueDoesNotBelongToRequesterException("Venue does not belong to requester");
        }

        fetchedVenue.setDisplayImagePath(displayImagePath);
        return venueRepository.save(fetchedVenue);
    }

    /**
     * updates venue's details
     * DOES NOT INCLUDE BOOKING STUFF (VenueSchedule, DaySchedule, TableType, etc.)
     *
     * @param v
     * @return
     */
    public Venue updateVenue(Venue v) throws OperatorUsernameAlreadyTakenException {
        System.out.println(v.getVenueId());
        Venue fetchedVenue = venueRepository.findById(v.getVenueId()).get();
        if (!checkIfVenueBelongsToTokenOwner(fetchedVenue))
            return null;


        // setting of operator details
        Operator op = v.getOperator();
        Operator fetchedOp = fetchedVenue.getOperator(); // this is from the fetched venue

        // this is the one we want to attach to fetchedVenue after all the processing
        Operator finalOperator = null;

        // processing the Operator form that's sent up
        if (op == null) { // idk when this case actually happens but i'm leaving this here
            finalOperator = fetchedOp;
        } else if (fetchedOp == null) { // this is the case where the venue has no operator, and the user submits without touching the operator form

            if (!op.getUsername().equalsIgnoreCase("")) {
                throw new RuntimeException("Somehow it reached here 1");
            }
            if (!op.getPassword().equalsIgnoreCase("")) { // if password field is empty, ssince there is no fetchedOp, can't "leave empty to not change"
                throw new RuntimeException("Somehow it reached here 2");
            }

//            op.setVenue(fetchedVenue);
//            op.setPassword(passwordEncoder.encode(op.getPassword()));
//            walletService.addNewWalletToUser(op);
            // DO NOTHING HERE, because we don't want to create a new operator
        } else if (op.isEnabled()) {
            // check if operator username already exists
            Operator checkOp = operatorRepository.getOperatorByUsername(op.getUsername()); // this is directly checking with repo

            if (checkOp != null && !checkOp.getUsername().equals(fetchedOp.getUsername())) {
                // if username already exists, and the username is not the same as the fetchedOp username
                throw new OperatorUsernameAlreadyTakenException("Operator username already exists");
            }

            fetchedOp.setVenue(v); // this shouldn't be needed, but just incase
            if (!op.getUsername().equalsIgnoreCase("")) {
                System.out.println("Receiving and setting new username: " + op.getUsername());
                fetchedOp.setUsername(op.getUsername());
            }
            if (!op.getPassword().equalsIgnoreCase("")) { // if pw field is not empty, means the person wants to change pw
                System.out.println("receiving new password : " + op.getPassword());
                fetchedOp.setPassword(passwordEncoder.encode(op.getPassword()));
                System.out.println("encoded hash: " + fetchedOp.getPassword());
            }
//            fetchedOp.setCreatedAt(op.getCreatedAt()); // do we need this?
            fetchedOp.setEnabled(true);
            finalOperator = fetchedOp;
        } else { // operator that is sent by frontend exists, and is disabled
            fetchedOp.setEnabled(false);
            finalOperator = fetchedOp;
        }

        fetchedVenue.setOperator(finalOperator);


        // Other simpler fields: copying received values into fetchedVenue
        fetchedVenue.setVenueName(v.getVenueName());

        Address fetchedAddress = fetchedVenue.getAddress();
        fetchedAddress.setAddress(v.getAddress().getAddress());
        fetchedAddress.setPostalCode(v.getAddress().getPostalCode());
        fetchedAddress.setLatitude(v.getAddress().getLatitude());
        fetchedAddress.setLongitude(v.getAddress().getLongitude());
//        addressRepository.save(fetchedVenue.getAddress()); // also no need?

        fetchedVenue.setDescription(v.getDescription());
        fetchedVenue.setPhoneNumber(v.getPhoneNumber());
        fetchedVenue.setAveragePrice(v.getAveragePrice());
        fetchedVenue.setAmenities(v.getAmenities());

        fetchedVenue.setImages(v.getImages());
        fetchedVenue.setDisplayImagePath(v.getDisplayImagePath());

        BusinessHours fetchedBusinessHours = fetchedVenue.getBusinessHours();
        fetchedBusinessHours.setMon(v.getBusinessHours().getMon());
        fetchedBusinessHours.setTue(v.getBusinessHours().getTue());
        fetchedBusinessHours.setWed(v.getBusinessHours().getWed());
        fetchedBusinessHours.setThu(v.getBusinessHours().getThu());
        fetchedBusinessHours.setFri(v.getBusinessHours().getFri());
        fetchedBusinessHours.setSat(v.getBusinessHours().getSat());
        fetchedBusinessHours.setSun(v.getBusinessHours().getSun());
        fetchedBusinessHours.setHolidays(v.getBusinessHours().getHolidays());


        return venueRepository.save(fetchedVenue); // again, technically don't need to do so, but good for clarity
    }

    public Venue toggleVenueVisibilityStatus(Long venueId) {
        Venue fetchedVenue = venueRepository.findById(venueId).get();
        if (!checkIfVenueBelongsToTokenOwner(fetchedVenue))
            return null;

        VenueStatusEnum currentStatus = fetchedVenue.getVenueStatus();
        if (currentStatus == VenueStatusEnum.ACTIVATED) {
            fetchedVenue.setVenueStatus(VenueStatusEnum.DEACTIVATED);
        } else {
            fetchedVenue.setVenueStatus(VenueStatusEnum.ACTIVATED);
        }

        venueRepository.save(fetchedVenue);
        return fetchedVenue;

    }

    public boolean checkIfVenueBelongsToTokenOwner(Venue v) {
        return userContext.obtainRequesterIdentity(ownerService::getOwnerByUsername)
                .map(owner -> {
                    return owner.getUsername().equals(v.getOwner().getUsername());
                })
                .get();
    }

    /**
     * THIS IS SOFT DELETE
     *
     * @param venueId
     */
    public void deleteVenue(Long venueId) {
        Venue fetchedVenue = venueRepository.findById(venueId).get();
        if (!checkIfVenueBelongsToTokenOwner(fetchedVenue))
            return; // actually should do error catching for this

        fetchedVenue.setVenueStatus(VenueStatusEnum.DELETED);

        venueRepository.save(fetchedVenue);
    }

    public void deleteVenueAdmin(Long id) throws Exception {
        Venue temp = venueRepository.findById(id).orElse(null);
        if (temp == null) {
            throw new Exception("venue not found");
        }

        temp.setVenueStatus(VenueStatusEnum.DELETED);
        venueRepository.save(temp);

        Owner venueOwner = ownerRepository.getOwnerByUsername(temp.getOwnerUsername());
        if (venueOwner == null) {
            throw new Exception("owner not found");
        }

        List<Venue> venues = venueOwner.getVenues();

        for (Venue v : venues) {
            if (v.getVenueId() == id) {
                v.setVenueStatus(VenueStatusEnum.DELETED);
                break;
            }
        }

        venueOwner.setVenues(venues);
        ownerRepository.save(venueOwner);
    }

    public Venue responseBodifyVenue(Venue v) {
        Venue newVenue = new Venue();
        newVenue.setVenueId(v.getVenueId());
        newVenue.setVenueName(v.getVenueName());
        newVenue.setDescription(v.getDescription());
        newVenue.setAveragePrice(v.getAveragePrice());
        newVenue.setImages(v.getImages());
        newVenue.setReviews(v.getReviews());
        newVenue.setVenueStatus(v.getVenueStatus());

        return newVenue;
    }

    public Venue updateVenueCrowdLevel(Venue v) throws Exception {
        Venue oldVenue = venueRepository.findById(v.getVenueId()).get();
        if (oldVenue == null) {
            throw new Exception("venue not found");
        } else {
            oldVenue.setVenueCrowdLevel(v.getVenueCrowdLevel());
            venueRepository.save(oldVenue);
            return oldVenue;
        }
    }

    // just want to test if can update first, later will add checker
    public Venue updateVenueStatus(Venue v, Venue updatedDetails) throws Exception {
        Owner o = userContext.obtainRequesterIdentity((username) -> ownerRepository.getOwnerByUsername(username))
                .orElse(null);
        Venue oldVenue = venueRepository.findById(v.getVenueId()).get();
        Long currentSubscriptionId = o.getCurrentSubscriptionId();

        // check if venue exist or not
        if (oldVenue == null) {
            throw new Exception("venue not found");
        }

        // check if user has a subscription or not
        if (currentSubscriptionId == null) {
            throw new UserHasNoValidSubscription("user has no valid subscription");
        }

        LocalDate today = LocalDate.now();
        Subscription currentSubscription = subscriptionRepository.findById(currentSubscriptionId).orElse(null);
        // check if their subscription exist and if expired already or not, if
        // subscription end date before today means expired
        if (currentSubscription == null || currentSubscription.getSubscriptionPeriodEnd().isBefore(today)) {
            throw new UserHasNoValidSubscription("user has no valid subscription");
        }

        // get all the venue, check if the total number of venue active == subscription
        // venue limit
        int maxVenueActive = currentSubscription.getVenueListingLimit();
        List<Venue> allOwnerVenue = o.getVenues();
        int currentlyActiveVenue = 0;

        for (Venue ve : allOwnerVenue) {
            if (ve.getVenueStatus().equals(VenueStatusEnum.ACTIVATED)) {
                currentlyActiveVenue++;
            }
        }

        if (currentlyActiveVenue < maxVenueActive
                || updatedDetails.getVenueStatus().equals(VenueStatusEnum.DEACTIVATED)) {
            oldVenue.setVenueStatus(updatedDetails.getVenueStatus());
            venueRepository.save(oldVenue);

            if (updatedDetails.getVenueStatus().equals(VenueStatusEnum.DEACTIVATED)) {
                for (Venue ve : allOwnerVenue) {
                    if (ve.getVenueId() == oldVenue.getVenueId()) {
                        ve.setVenueStatus(VenueStatusEnum.DEACTIVATED);
                    }
                }
            } else if (updatedDetails.getVenueStatus().equals(VenueStatusEnum.ACTIVATED)) {
                for (Venue ve : allOwnerVenue) {
                    if (ve.getVenueId() == oldVenue.getVenueId()) {
                        ve.setVenueStatus(VenueStatusEnum.ACTIVATED);
                    }
                }
            }

            o.setVenues(allOwnerVenue);
            ownerRepository.save(o);

            return oldVenue;
        } else {
            throw new UserHasNoValidSubscription("user has no valid subscription");
        }
    }

    public Venue activateVenue(Long id) throws Exception {
        Venue temp = venueRepository.findById(id).orElse(null);
        if (temp == null) {
            throw new Exception("venue not found");
        }

        if (temp.getVenueStatus().equals(VenueStatusEnum.ACTIVATED)) {
            temp.setVenueStatus(VenueStatusEnum.DEACTIVATED);
        } else if (temp.getVenueStatus().equals(VenueStatusEnum.DEACTIVATED)) {
            temp.setVenueStatus(VenueStatusEnum.ACTIVATED);
        } else if (temp.getVenueStatus().equals(VenueStatusEnum.DELETED)) {
            temp.setVenueStatus(VenueStatusEnum.ACTIVATED);
        }

        venueRepository.save(temp);
        return temp;
    }

    public Venue banVenue(Long id) throws Exception {
        Venue temp = venueRepository.findById(id).orElse(null);
        if (temp == null) {
            throw new Exception("venue not found");
        }

        if (temp.isAdminBanned()) {
            temp.setAdminBanned(false);
        } else {
            temp.setAdminBanned(true);
        }
        // not sure if we need to set the owner
        venueRepository.save(temp);
        return temp;
    }

    public Venue getVenueById(Long id) {
        return venueRepository.findById(id).orElse(null);
    }

    public List<Map<String, ?>> getNearbyVenues(Double latitude, Double longitude) {
        List<Object[]> venuesDistances = venueRepository.findVenuesNearMe(latitude, longitude);
        List<Map<String, ?>> result = new ArrayList<>();

        for (Object[] venueDistance : venuesDistances) {
            Map<String, Object> x = new HashMap<>();
            Venue venue = (Venue) venueDistance[0];
            x.put("venue", venue);
            x.put("distance", venueDistance[1]);
            x.put("ratings", venueRepository.getAverageVenueRating(venue.getVenueId()));
            result.add(x);
        }

        return result;
    }

    public List<Map<String, ?>> getVenues(Double latitude, Double longitude) {
        List<Object[]> venuesDistances = venueRepository.findVenuesNearMe(latitude, longitude);
        List<Map<String, ?>> result = new ArrayList<>();

        for (Object[] venueDistance : venuesDistances) {
            Map<String, Object> x = new HashMap<>();
            x.put("venue", venueDistance[0]);
            result.add(x);
        }

        return result;
    }
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void disableVenues(LocalDate curr) {
        disableVenuesForOwnersWithoutSubscription(curr);
        disableVenuesForOwnersExceedingVenueLimit();
    }

    private void disableVenuesForOwnersExceedingVenueLimit() {
        ownerRepository.findAll().stream()
                .map(mapVenuesToPartiallyDisable())
                .filter(optPair -> optPair.isPresent())
                .map(optPair -> optPair.get())
                .forEach(disableVenuesExceedingLimit());
    }

    private Function<Owner, ? extends Optional<Pair<Owner, Subscription>>> mapVenuesToPartiallyDisable() {
        return o -> {
            return Optional.ofNullable(o.getCurrentSubscriptionId())
                    .flatMap(findVenueOwnersToPartiallyDisable(o));
        };
    }

    private Function<Long, Optional<Pair<Owner, Subscription>>> findVenueOwnersToPartiallyDisable(Owner o) {
        return sId -> {
            return subscriptionRepository.findById(sId)
                    .flatMap(s -> {
                        if (!s.getSubscriptionPeriodEnd().isBefore(LocalDate.now())
                                && s.getVenueListingLimit() < o.getVenues().size()) {
                            return Optional.ofNullable(Pair.of(o, s)); //valid subscription but venue limit too much
                        }
                        return Optional.empty(); // either totally valid subscription / invalid subscription
                    });
        };
    }

    private Consumer<? super Pair<Owner, Subscription>> disableVenuesExceedingLimit() {
        return pair -> {
            List<Venue> activeVenues = pair.getFirst().getVenues().stream()
                    .filter(v -> v.getVenueStatus().equals(VenueStatusEnum.ACTIVATED))
                    .collect(Collectors.toList());
            if (activeVenues.size() > pair.getSecond().getVenueListingLimit()) {
                activeVenues.stream().limit(activeVenues.size() - pair.getSecond().getVenueListingLimit())
                        .forEach(venueToDisable -> venueToDisable.setVenueStatus(VenueStatusEnum.DEACTIVATED));
            }
        };
    }


    private void disableVenuesForOwnersWithoutSubscription(LocalDate curr) {
        List<Owner> allOwners = ownerRepository.findAll();

        allOwners.stream().map(o -> {
            if (o.getCurrentSubscriptionId() != null && o.getCurrentSubscriptionEndDate().isAfter(curr)) {
                return Pair.of(o, subscriptionRepository.findById(o.getCurrentSubscriptionId()));
            }
            return Pair.of(o, Optional.<Subscription>empty());
        }).forEach(pair -> {
            if (pair.getSecond().isEmpty() || isInvalid(pair.getSecond().get())) {
                pair.getFirst().getVenues().forEach(v -> {
                    if (v.getVenueStatus().equals(VenueStatusEnum.ACTIVATED)) {
                        v.setVenueStatus(VenueStatusEnum.DEACTIVATED);
                    }
                });
            }
        });
    }

    private boolean isInvalid(Subscription subscription) {
        return subscription.getSubscriptionPeriodEnd().isBefore(LocalDate.now());
    }


    public void installEarthDistance() {
        venueRepository.installEarthDistanceExtension();
    }

    public double getAverageVenueRatings(long venueId) {
        return venueRepository.getAverageVenueRating(venueId);
    }

}
