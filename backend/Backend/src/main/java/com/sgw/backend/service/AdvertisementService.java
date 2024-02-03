package com.sgw.backend.service;

import com.sgw.backend.entity.*;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.entity_venue.VenueStatusEnum;
import com.sgw.backend.exception.*;
import com.sgw.backend.repository.*;
import com.sgw.backend.utilities.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdvertisementService {
    private final AdvertisementRepository advertisementRepository;
    private final UserContext userContext;
    private final OwnerRepository ownerRepository;
    private final VenueRepository venueRepository;
    private final StudentRepository studentRepository;
    private final TransactionService transactionService;
    private final AdminRepository adminRepository;
    private final RefundRepository refundRepository;

    // TODO: There will not be updating an advert, only deeactivating, then any
    // balance will be given to their account, once disbaled unable to activate
    // again

    public boolean createAdvertisement(Advertisement ad) {
        return userContext.obtainRequesterIdentity((username) -> ownerRepository.getOwnerByUsername(username))
                .map(associateOwnerAndSave(ad))
                .orElse(false);
    }

    public Advertisement createAdvertisement2(Advertisement ad) {
        Owner owner = userContext.obtainRequesterIdentity((username) -> ownerRepository.getOwnerByUsername(username))
                .orElse(null);
        Admin admin = Optional.ofNullable(adminRepository.getAdminByUsername("FINANCE")).orElse(null);
        if (owner == null || admin == null) {
            throw new InvalidUserException("User not found");
        }

        // this ensure the owner wallet has more than how much he want to put the ad
        BigDecimal walletBalanceInDollars = owner.getWallet().getWalletBalance().divide(new BigDecimal(100), 2,
                RoundingMode.HALF_UP);
        if (walletBalanceInDollars.compareTo(ad.getBillablePrice()) < 0) {
            throw new NotEnoughMoneyInWalletException("INSUFFICIENT BALANCE");
        }

        LocalDate today = LocalDate.now();

        // Setting relationship
        ad.setOwner(owner);
        owner.getAdvertisements().add(ad);
        ad.setAdCreatorUsername(owner.getUsername());
        // TODO: IF NO APPROVAL NEEDED, AUTO SET BY DATE
        // if (ad.getStartDate().equals(today) || ad.getStartDate().isBefore(today)) {
        // ad.setAdvertisementStatus(AdvertisementStatusEnum.ACTIVATED);
        // } else {
        // ad.setAdvertisementStatus(AdvertisementStatusEnum.PENDING);
        // }

        // TODO: IF ADMIN APPROVAL NEEDED
        ad.setAdvertisementStatus(AdvertisementStatusEnum.PENDING);

        // the billableprice at the start will be the budgetleft
        ad.setBudgetLeft(ad.getBillablePrice());

        // setting up the number of impression left based on costPerImpression and
        // budget
        // this code below $1/ $0.3 = 3 round down
        BigDecimal result = ad.getBudgetLeft().divide(ad.getCostPerImpression(), 2, RoundingMode.HALF_UP);
        Long impression = result.longValue();
        ad.setImpressionsLeft(impression);

        ad.setImpressionCount(0l);
        ad.setReachCount(0l);
        ad.setReachIds(new HashMap<>());
        ad.setImpressionIds(new ArrayList<>());
        ad.setRejectionReason("");

        // this is to convert the billiable price from DOLLARS TO CENTS
        // this part only for transcation part
        BigDecimal correctBillablePrice = ad.getBillablePrice().multiply(new BigDecimal(100));
        ad.setBillablePrice(correctBillablePrice);

        advertisementRepository.save(ad);
        ownerRepository.save(owner);

        try {
            Transaction t = transactionService.createAndAddTransaction(ad, owner.getWallet(), admin.getWallet());
            transactionService.completeATransaction(t);
        } catch (PayerBalanceInsufficientException e) {
            throw new NotEnoughMoneyInWalletException("INSUFFICIENT BALANCE");
        } catch (BillableAlreadyHasTransactionException ex) {
            throw new UserHasSubscriptionException("SUBSCRIPTION ALREADY HAS TRANSACTION");
        } catch (TransactionNotPendingException e) {
            throw new RuntimeException("TRANSACTION STATUS NOT PENDING");
        }
        return ad;
    }

    // TODO: Need to add the transaction
    // flow: create add > set budget etc > hit confirm add advertisement > deduct
    // money from wallet make transaction
    private Function<Owner, Boolean> associateOwnerAndSave(Advertisement ad) {
        return owner -> {
            ad.setOwner(owner);
            owner.getAdvertisements().add(ad);
            ad.setAdCreatorUsername(owner.getUsername());
            ad.setAdvertisementStatus(AdvertisementStatusEnum.PENDING);

            // the billableprice at the start will be the budgetleft
            ad.setBudgetLeft(ad.getBillablePrice());

            // setting up the number of impression left based on costPerImpression and
            // budget
            Long impression = ad.getBudgetLeft().divide(ad.getCostPerImpression()).longValue();
            ad.setImpressionsLeft(impression);

            advertisementRepository.save(ad);
            return true;
        };
    }

    public List<Advertisement> getAssociatedAdvertisement() {
        return userContext.obtainRequesterIdentity((username) -> ownerRepository.getOwnerByUsername(username))
                .map(owner -> owner.getAdvertisements()).orElse(List.of());
    }

    public List<Advertisement> getAdvertisementsNearMe(Double latitude, Double longitude) {
        // get this student who is doing the near me
        Student currentStudent = userContext
                .obtainRequesterIdentity((username) -> studentRepository.getStudentByUsername(username)).orElse(null);
        Admin admin = Optional.ofNullable(adminRepository.getAdminByUsername("FINANCE")).orElse(null);
        List<Object[]> venuesDistances = venueRepository.findVenuesNearMeForAdvertTenKm(latitude, longitude);
        List<Venue> venues = new ArrayList<>();

        // get venues within 10km of user
        for (Object[] venueDistance : venuesDistances) {
            venues.add((Venue) venueDistance[0]);
        }

        // getting unique owners from the venue
        List<Owner> owners = venues.stream().map(Venue::getOwner).distinct().collect(Collectors.toList());

        // List<Owner> manageOwner = new ArrayList<Owner>();
        //
        // for (Owner owner : owners) {
        // manageOwner.add(ownerRepository.findById(owner.getUserId()).get());
        // }
        List<Advertisement> availableAdvertisements = new ArrayList<>();

        LocalDate today = LocalDate.now();

        for (Owner o : owners) {
            System.out.print("Owner " + o.getUserId());
            // TODO: from all owner, get the advertise
            List<Advertisement> ownersAdvert = o.getAdvertisements();
            if (ownersAdvert != null && !ownersAdvert.isEmpty()) {
                for (Advertisement a : ownersAdvert) {
                    // TODO: Whats happening here
                    // make sure advert is active && impressionleft >=1
                    // && balance >= costPerImpression
                    // && today >= start date && today <= enddate
                    if (a.getAdvertisementStatus().equals(AdvertisementStatusEnum.ACTIVATED)
                            && a.getImpressionsLeft() >= 1
                            && (a.getBudgetLeft().compareTo(a.getCostPerImpression()) >= 0)) {
                        if ((a.getStartDate().equals(today) || a.getStartDate().isBefore(today))
                                && (a.getEndDate().equals(today) || a.getEndDate().isAfter(today))) {
                            availableAdvertisements.add(a);
                        }
                    }
                }
            }
        }
        System.out.println(availableAdvertisements.size());
        // Now you got all the unique advertisment to be displayed
        // TODO: NEED TO ADD A SORTING ALGO WHICH AD TO CHOOSE FIRST

        List<Advertisement> top1 = new ArrayList<>();

        // BASED ON WHICH ONE USER HAS SEEN THE LEAST, THEN higher CPI
        Collections.sort(availableAdvertisements, new Comparator<Advertisement>() {
            @Override
            public int compare(Advertisement a1, Advertisement a2) {
                Long reachCount1 = a1.getReachIds().get(currentStudent.getUserId());
                Long reachCount2 = a2.getReachIds().get(currentStudent.getUserId());

                if (reachCount1 == null) {
                    reachCount1 = 0L;
                }

                if (reachCount2 == null) {
                    reachCount2 = 0L;
                }

                // First, compare by reachCount in ascending order
                int reachComparison = reachCount1.compareTo(reachCount2);

                System.out.println("reachComparison: " + reachComparison);

                // If reachCount comparison results in a tie, compare by costPerImpression
                if (reachComparison == 0) {
                    System.out.println("come inside here");
                    // return a1.getCostPerImpression().compareTo(a2.getCostPerImpression());
                    return a2.getCostPerImpression().compareTo(a1.getCostPerImpression());
                }

                return reachComparison;
            }
        });

        if (availableAdvertisements.size() > 1) {
            top1 = availableAdvertisements.subList(0, 1);
        } else {
            top1 = availableAdvertisements;
        }

        // BASICALLY CHOOSE THE HIGHEST CPI

        // TODO: Now you need to do all the updating FUCK MY LIFE OMG SO HARD :(((

        for (Advertisement advertisement : top1) {

            // calculate impression left - 1 for this impression
            advertisement.setImpressionsLeft(advertisement.getImpressionsLeft() - 1l);
            // calcualte budgetleft = budgeleft - cost per impression
            advertisement.setBudgetLeft(advertisement.getBudgetLeft().subtract(advertisement.getCostPerImpression()));

            // add the student ID, not unique + set Impression Count
            advertisement.getImpressionIds().add(currentStudent.getUserId());
            advertisement.setImpressionCount((long) advertisement.getImpressionIds().size());

            // add the reachId + set reachCount
            if (advertisement.getReachIds().containsKey(currentStudent.getUserId())) {
                Long numberOfViewsFromThisUserPlusOneForThisView = advertisement.getReachIds()
                        .get(currentStudent.getUserId()) + 1l;
                advertisement.getReachIds().put(currentStudent.getUserId(),
                        numberOfViewsFromThisUserPlusOneForThisView);
            } else {
                advertisement.getReachIds().put(currentStudent.getUserId(), 1l);
                advertisement.setReachCount(advertisement.getReachCount() + 1l);
            }

            // if the balance after this view not enough already set the thing to disable

            if (advertisement.getBudgetLeft().compareTo(advertisement.getCostPerImpression()) < 0
                    || advertisement.getImpressionsLeft() < 1) {
                advertisement.setAdvertisementStatus(AdvertisementStatusEnum.COMPLETED);

                if (advertisement.getBudgetLeft().compareTo(new BigDecimal("0")) > 0) {
                    Refund refund = new Refund();

                    Owner ownerOfThisAd = ownerRepository.findById(advertisement.getOwner().getUserId()).orElse(null);

                    refund.setBillablePrice(advertisement.getBudgetLeft().multiply(new BigDecimal(100)));
                    refund.setRefundReason("Advertisement complete");
                    refundRepository.save(refund);

                    try {
                        Transaction t = transactionService.createAndAddTransaction(refund, admin.getWallet(),
                                ownerOfThisAd.getWallet());
                        transactionService.completeATransaction(t);
                    } catch (PayerBalanceInsufficientException e) {
                        throw new NotEnoughMoneyInWalletException("INSUFFICIENT BALANCE");
                    } catch (BillableAlreadyHasTransactionException ex) {
                        throw new UserHasSubscriptionException("ADVERTISEMENT ALREADY HAS TRANSACTION");
                    } catch (TransactionNotPendingException e) {
                        throw new RuntimeException("TRANSACTION STATUS NOT PENDING");
                    }
                }
            }

            advertisementRepository.save(advertisement);
        }

        // THIS IS JUST TO SET THE OWNERS ADVERT UP TO DATE
        for (Advertisement a : top1) {
            Owner toUpdateOwner = ownerRepository.findById(a.getOwner().getUserId()).orElse(null);
            List<Advertisement> ownersAds = toUpdateOwner.getAdvertisements();

            for (int i = 0; i < ownersAds.size(); i++) {
                if (a.getBillableId() == ownersAds.get(i).getBillableId()) {
                    ownersAds.set(i, a);
                    break;
                }
            }
        }

        return top1;

    }

    public List<Advertisement> getAllPendingAdvertisement() {
        return advertisementRepository.findAllByAdvertisementStatus(AdvertisementStatusEnum.PENDING);
    }

    public List<Advertisement> everythingElseExceptPendingAdvertisement() {
        return advertisementRepository.findAllByAdvertisementStatusNot(AdvertisementStatusEnum.PENDING);
    }

    public List<Advertisement> getAllAdvertisement() {
        return advertisementRepository.findAll();
    }

    public Advertisement getAdvertisementById(Long id) {
        return advertisementRepository.findById(id).orElse(null);
    }

    // THIS METHOD IS USED BY ADMIN TO ACCEPT AND REJECT ADVERT
    public Advertisement updateAdvertisement(Long id, Advertisement advertisement)
            throws AdvertisementNotFoundException {
        Advertisement original = advertisementRepository.findById(id).orElse(null);
        Owner ownerOfThisAd = ownerRepository.findById(original.getOwner().getUserId()).orElse(null);
        Admin admin = Optional.ofNullable(adminRepository.getAdminByUsername("FINANCE")).orElse(null);

        if (original == null) {
            throw new AdvertisementNotFoundException("Advertisement not found");
        }

        if (ownerOfThisAd == null) {
            throw new AdvertisementNotFoundException("Owner not found");
        }

        if (admin == null) {
            throw new AdvertisementNotFoundException("Admin not found");
        }

        // if status == pending

        // TODO: WANT TO APPROVE --> JUST CHANGE APPROVE
        if (advertisement.getAdvertisementStatus().equals(AdvertisementStatusEnum.ACTIVATED)) {
            original.setAdvertisementStatus(AdvertisementStatusEnum.ACTIVATED);

            List<Advertisement> listFromOwner = ownerOfThisAd.getAdvertisements();

            for (Advertisement ad : listFromOwner) {
                if (ad.getBillableId() == id) {
                    ad.setAdvertisementStatus(AdvertisementStatusEnum.ACTIVATED);
                    break;
                }
            }

            ownerOfThisAd.setAdvertisements(listFromOwner);
            ownerRepository.save(ownerOfThisAd);
            advertisementRepository.save(original);
            return original;
        }

        // TODO: WANT TO REJECT --> REFUND MONEY TO OWNER AND SET STATUS TO REJECTED
        else if (advertisement.getAdvertisementStatus().equals(AdvertisementStatusEnum.REJECTED)) {
            original.setAdvertisementStatus(AdvertisementStatusEnum.REJECTED);
            original.setRejectionReason(advertisement.getRejectionReason());

            List<Advertisement> listFromOwner = ownerOfThisAd.getAdvertisements();

            for (Advertisement ad : listFromOwner) {
                if (ad.getBillableId() == id) {
                    ad.setAdvertisementStatus(AdvertisementStatusEnum.REJECTED);
                    ad.setRejectionReason(advertisement.getRejectionReason());
                    break;
                }
            }

            System.out.println(advertisement.getRejectionReason());

            ownerOfThisAd.setAdvertisements(listFromOwner);
            ownerRepository.save(ownerOfThisAd);
            advertisementRepository.save(original);

            // TODO: DO THE REFUND PROCESS HERE

            if (original.getBudgetLeft().compareTo(new BigDecimal("0")) > 0) {
                Refund refund = new Refund();

                refund.setBillablePrice(original.getBudgetLeft().multiply(new BigDecimal(100)));
                refund.setRefundReason("Rejected Advertisement");
                refundRepository.save(refund);

                try {
                    Transaction t = transactionService.createAndAddTransaction(refund, admin.getWallet(),
                            ownerOfThisAd.getWallet());
                    transactionService.completeATransaction(t);
                } catch (PayerBalanceInsufficientException e) {
                    throw new NotEnoughMoneyInWalletException("INSUFFICIENT BALANCE");
                } catch (BillableAlreadyHasTransactionException ex) {
                    throw new UserHasSubscriptionException("ADVERTISEMENT ALREADY HAS TRANSACTION");
                } catch (TransactionNotPendingException e) {
                    throw new RuntimeException("TRANSACTION STATUS NOT PENDING");
                }
                return original;
            }

            return original;
        }

        System.out.println("IF THIS COMES HERE BRO YOU FKED UP SOMEWHERE");
        return null;
    }

    public Advertisement markAdvertisementAsComplete(Long id) throws AdvertisementNotFoundException {
        Advertisement original = advertisementRepository.findById(id).orElse(null);
        Owner ownerOfThisAd = ownerRepository.findById(original.getOwner().getUserId()).orElse(null);
        Admin admin = Optional.ofNullable(adminRepository.getAdminByUsername("FINANCE")).orElse(null);

        if (original == null) {
            throw new AdvertisementNotFoundException("Advertisement not found");
        }

        if (ownerOfThisAd == null) {
            throw new AdvertisementNotFoundException("Owner not found");
        }

        if (admin == null) {
            throw new AdvertisementNotFoundException("Admin not found");
        }

        // TODO: SETTING STATUS TO COMPLETE
        original.setAdvertisementStatus(AdvertisementStatusEnum.COMPLETED);

        List<Advertisement> listFromOwner = ownerOfThisAd.getAdvertisements();

        for (Advertisement ad : listFromOwner) {
            if (ad.getBillableId() == id) {
                ad.setAdvertisementStatus(AdvertisementStatusEnum.COMPLETED);
                break;
            }
        }

        ownerOfThisAd.setAdvertisements(listFromOwner);
        ownerRepository.save(ownerOfThisAd);
        advertisementRepository.save(original);

        // TODO: DOING REDDDUFUND HERE

        if (original.getBudgetLeft().compareTo(new BigDecimal("0")) > 0) {
            Refund refund = new Refund();

            refund.setBillablePrice(original.getBudgetLeft().multiply(new BigDecimal(100)));
            refund.setRefundReason("Advertisement Marked as Completed");
            refundRepository.save(refund);

            try {
                Transaction t = transactionService.createAndAddTransaction(refund, admin.getWallet(),
                        ownerOfThisAd.getWallet());
                transactionService.completeATransaction(t);
            } catch (PayerBalanceInsufficientException e) {
                throw new NotEnoughMoneyInWalletException("INSUFFICIENT BALANCE");
            } catch (BillableAlreadyHasTransactionException ex) {
                throw new UserHasSubscriptionException("ADVERTISEMENT ALREADY HAS TRANSACTION");
            } catch (TransactionNotPendingException e) {
                throw new RuntimeException("TRANSACTION STATUS NOT PENDING");
            }
            return original;
        } else {
            return original;
        }
    }

    // TODO: THIS METHOD IS CALLED BY SCHEDULER ON 2359 t
    public void completeAllAdvertisementScheduler() {
        List<Advertisement> allAdvertisement = advertisementRepository
                .findAllByAdvertisementStatus(AdvertisementStatusEnum.ACTIVATED);

        Admin admin = Optional.ofNullable(adminRepository.getAdminByUsername("FINANCE")).orElse(null);

        for (Advertisement advertisement : allAdvertisement) {
            Owner ownerOfThisAd = ownerRepository.findById(advertisement.getOwner().getUserId()).orElse(null);

            // check if there is no active venue or not
            // if no active venue mark as complete and do transcation
            List<Venue> ownersVenue = ownerOfThisAd.getVenues();
            boolean hasActiveVenue = false;
            for (Venue v : ownersVenue) {
                if (v.getVenueStatus().equals(VenueStatusEnum.ACTIVATED)) {
                    hasActiveVenue = true;
                    break;
                }
            }

            // TODO: This checks if the end date is today or before today, as well as if
            // there is no active venue then set to complete and do transcation
            if (advertisement.getEndDate().equals(LocalDate.now())
                    || advertisement.getEndDate().isBefore(LocalDate.now()) || !hasActiveVenue) {
                advertisement.setAdvertisementStatus(AdvertisementStatusEnum.COMPLETED);
                advertisementRepository.save(advertisement);

                List<Advertisement> ownersAds = ownerOfThisAd.getAdvertisements();
                for (int i = 0; i < ownersAds.size(); i++) {
                    if (advertisement.getBillableId() == ownersAds.get(i).getBillableId()) {
                        ownersAds.set(i, advertisement);
                        break;
                    }
                }
                // TODO: ADDED LINE 499 23 OCT 1:12 AM // the setting part i think i forget to
                // do
                ownerOfThisAd.setAdvertisements(ownersAds);
                ownerRepository.save(ownerOfThisAd);

                if (advertisement.getBudgetLeft().compareTo(new BigDecimal("0")) > 0) {
                    Refund refund = new Refund();

                    refund.setBillablePrice(advertisement.getBudgetLeft());
                    refund.setRefundReason("Advertisement complete");
                    refundRepository.save(refund);

                    try {
                        Transaction t = transactionService.createAndAddTransaction(refund, admin.getWallet(),
                                ownerOfThisAd.getWallet());
                        transactionService.completeATransaction(t);
                    } catch (PayerBalanceInsufficientException e) {
                        throw new NotEnoughMoneyInWalletException("INSUFFICIENT BALANCE");
                    } catch (BillableAlreadyHasTransactionException ex) {
                        throw new UserHasSubscriptionException("ADVERTISEMENT ALREADY HAS TRANSACTION");
                    } catch (TransactionNotPendingException e) {
                        throw new RuntimeException("TRANSACTION STATUS NOT PENDING");
                    }
                }
            }
        }
    }

    public long getNearbyVenueByAdvertisementId(long advertisementId, double latitude, double longitude) {
        return venueRepository.findVenuesNearMeForAdvert(advertisementId, latitude, longitude);

    }

}
