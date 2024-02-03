package com.sgw.backend.misc;

import com.sgw.backend.entity.*;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.entity_venue.VenueStatusEnum;
import com.sgw.backend.repository.*;
import com.sgw.backend.service.*;
import com.sgw.backend.utilities.USER_CONSTANT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class StartupService {
    @Autowired
    private GeneralUserRepository generalUserRepository;

    @Autowired
    StudentService studentService;

    @Autowired
    VenueService venueService;

    @Autowired
    AdminService adminService;

    @Autowired
    private final SchedulerComponent schedulerComponent;

    private final PasswordEncoder passwordEncoder;

    private final OwnerRepository ownerRepository;

    private final WalletRepository walletRepository;

    private final VenueRepository venueRepository;

    private final SubscriptionTypeRepository subscriptionTypeRepository;

    private final SubscriptionService subscriptionService;

    private final UserDetailsService userDetailsService;

    private final SubscriptionRepository subscriptionRepository;

    private final OwnerService ownerService;

    private final ReviewService reviewService;

    private final ReviewRepository reviewRepository;

    private final StudentRepository studentRepository;

    private final AdvertisementRepository advertisementRepository;

    private final VoucherListingRepository voucherListingRepository;

    // Do not use PostConstruct, because this executes when the Service component is
    // ready,
    // not when the app is ready!!
    // @PostConstruct
    @EventListener(ApplicationReadyEvent.class)

    public void initialStuff() throws Exception {
        venueService.installEarthDistance();
        // reviewService.initializeReviews();
        // if (subscriptionRepository.count() == 0) {
        // SubscriptionType subscriptionType = new SubscriptionType();
        // subscriptionType.setSubscriptionTypeName("type with limit 3");
        // subscriptionType.setSubscriptionTypeVenueLimit(3);
        // subscriptionType.setSubscriptionTypePrice(BigDecimal.valueOf(100L));
        // subscriptionType.setSubscriptionTypeDuration(30);
        // subscriptionTypeRepository.saveAndFlush(subscriptionType);
        //
        // Subscription subscription =
        // subscriptionService.copyAttributes2(subscriptionType);
        //
        // // Perform database setup here
        // //TODO : GROUP 1
        // Owner wo = new Owner("ownerTest WITHOUT SUBSCRIPTION",
        // passwordEncoder.encode("password"));
        // Wallet walletWo = new Wallet();
        // wo.setWallet(walletWo);
        // walletWo.setGeneralUser(wo);
        // walletRepository.save(walletWo);
        // ownerRepository.save(wo);
        //
        // Venue specialVenue = new Venue();
        // specialVenue.setVenueStatus(VenueStatusEnum.ACTIVATED);
        // specialVenue.setVenueName("VENUE WITHOUT SUBSCRIPTION");
        // venueRepository.save(specialVenue);
        // wo.getVenues().add(specialVenue);
        // specialVenue.setOwner(wo);
        //
        //
        // //TODO : GROUP 2
        //
        // Owner owner = new Owner("ownerTest WITH SUBSCRIPTION",
        // passwordEncoder.encode("password"));
        // owner.getSubscription().add(subscription);
        // Wallet wallet = new Wallet();
        // owner.setWallet(wallet);
        // wallet.setGeneralUser(owner);
        // walletRepository.save(wallet);
        // ownerRepository.save(owner);
        //
        // subscription.setPurchasingOwner(owner);
        // owner.setNextMonthSubcriptionTypeId(subscriptionType.getSubscriptionTypeId());
        // subscriptionRepository.save(subscription);
        //
        // for (int j = 1; j <= 3; j++) {
        // Venue venue = new Venue();
        // venue.setVenueStatus(VenueStatusEnum.ACTIVATED);
        // venue.setVenueName("venue " + j + " " + owner.getUsername());
        // venueRepository.save(venue);
        // owner.getVenues().add(venue);
        // venue.setOwner(owner);
        // }
        //
        // }

        if (subscriptionTypeRepository.findAll().isEmpty()) {
            SubscriptionType subscriptionType = new SubscriptionType();
            subscriptionType.setSubscriptionTypeName("Free");
            subscriptionType.setSubscriptionTypeDetails("Free Tier");
            subscriptionType.setSubscriptionTypeVenueLimit(1);
            subscriptionType.setSubscriptionTypePrice(BigDecimal.ZERO);
            subscriptionType.setSubscriptionTypeDuration(30);
            subscriptionType.setSubscriptionTypeStatusEnum(SubscriptionTypeStatusEnum.ACTIVATED);
            subscriptionTypeRepository.saveAndFlush(subscriptionType);

            SubscriptionType subscriptionType1 = new SubscriptionType();
            subscriptionType1.setSubscriptionTypeName("Gold");
            subscriptionType1.setSubscriptionTypeDetails("Gold Tier");
            subscriptionType1.setSubscriptionTypeVenueLimit(20);
            subscriptionType1.setSubscriptionTypePrice(BigDecimal.valueOf(30l));
            subscriptionType1.setSubscriptionTypeDuration(30);
            subscriptionType1.setSubscriptionTypeStatusEnum(SubscriptionTypeStatusEnum.ACTIVATED);
            subscriptionTypeRepository.saveAndFlush(subscriptionType1);

            SubscriptionType subscriptionType2 = new SubscriptionType();
            subscriptionType2.setSubscriptionTypeName("Silver");
            subscriptionType2.setSubscriptionTypeDetails("Silver Tier");
            subscriptionType2.setSubscriptionTypeVenueLimit(10);
            subscriptionType2.setSubscriptionTypePrice(BigDecimal.valueOf(20l));
            subscriptionType2.setSubscriptionTypeDuration(30);
            subscriptionType2.setSubscriptionTypeStatusEnum(SubscriptionTypeStatusEnum.ACTIVATED);
            subscriptionTypeRepository.saveAndFlush(subscriptionType2);
        }

        // Create testing student user
        Student newStudent = new Student("test", "password");

        if (studentService.getStudentByUsername(newStudent.getUsername()) == null) {
            studentService.addStudent(newStudent);
            newStudent.getWallet().setWalletBalance(BigDecimal.valueOf(100000));
            studentRepository.save(newStudent);
            walletRepository.save(newStudent.getWallet());

            System.out.println(
                    "Created test student user: " + newStudent.getUsername() + " ID: " + newStudent.getUserId());
        } else {
            System.out.println("Test student user already exists");
        }

        // Create testing admin user
        Admin newAdmin = new Admin("admin", "password");
        newAdmin.setName("Admin");
        newAdmin.setEmail("test@email.com");
        newAdmin.setEnabled(true);

        Admin financeAdmin = new Admin(USER_CONSTANT.FINANCE_ADMIN, "password");
        financeAdmin.setName("financeAdmin");
        financeAdmin.setEmail("financeAdmin@email.com");
        financeAdmin.setEnabled(true);

        Admin paymentGateway = new Admin(USER_CONSTANT.PAYMENT_GATEWAY, UUID.randomUUID().toString());
        paymentGateway.setName("paymentGatewayAdmin");
        paymentGateway.setEmail("paymentGatewayAdmin@email.com");
        paymentGateway.setEnabled(false);

        if (adminService.getAdminByUsername(newAdmin.getUsername()) == null) {
            adminService.addAdminInternalUse(newAdmin);
            adminService.addAdminInternalUse(financeAdmin);
            adminService.addUnlimitedAdminInternalUse(paymentGateway);
            financeAdmin.getWallet().setWalletBalance(BigDecimal.valueOf(10000000));
            generalUserRepository.save(financeAdmin);
            walletRepository.save(financeAdmin.getWallet());
            System.out.println("Created test admin user: " + newAdmin.getUsername());
        } else {
            System.out.println("Test admin user already exists");
        }
        if (subscriptionRepository.count() == 0) {
            initTestCases();
        }
        System.out.println("hello world wassup dawg");
        // This method will be called on application startup
    }

    @Transactional
    public void initTestCases() {
        SubscriptionType subscriptionType = new SubscriptionType();
        subscriptionType.setSubscriptionTypeName("type with limit 2");
        subscriptionType.setSubscriptionTypeVenueLimit(2);
        subscriptionType.setSubscriptionTypePrice(BigDecimal.valueOf(50L));
        subscriptionType.setSubscriptionTypeDuration(30);
        subscriptionType.setSubscriptionTypeStatusEnum(SubscriptionTypeStatusEnum.ACTIVATED);
        subscriptionType.setSubscriptionTypeDetails("TEST");
        subscriptionTypeRepository.saveAndFlush(subscriptionType);

        try {
            Owner owner = new Owner("owner with no autorenew", "password");
            owner.setEmail("x@email.com");
            ownerService.addOwner(owner);
            owner.getWallet().setWalletBalance(BigDecimal.valueOf(10000));
            loadSecurityContext(owner);
            createSubscription(subscriptionType, owner);
            owner.setAutoRenewSubscription(false);
            ownerRepository.save(owner);
            walletRepository.save(owner.getWallet());
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            Owner ownerWithNoBalance = new Owner("owner with autorenew but insufficient balance", "password");
            ownerWithNoBalance.setEmail("y@email.com");
            ownerService.addOwner(ownerWithNoBalance);
            ownerWithNoBalance.setAutoRenewSubscription(true);
            ownerRepository.save(ownerWithNoBalance);
            loadSecurityContext(ownerWithNoBalance);
            createSubscription(subscriptionType, ownerWithNoBalance);
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            Owner ownerWithBalance = new Owner("owner with autorenew and sufficient balance", "password");
            ownerWithBalance.setEmail("z@email.com");
            ownerService.addOwner(ownerWithBalance);
            ownerWithBalance.getWallet().setWalletBalance(BigDecimal.valueOf(10000));
            ownerWithBalance.setAutoRenewSubscription(true);
            ownerRepository.saveAndFlush(ownerWithBalance);
            walletRepository.save(ownerWithBalance.getWallet());
            loadSecurityContext(ownerWithBalance);
            createSubscription(subscriptionType, ownerWithBalance);

        } catch (Exception e) {
            e.printStackTrace();
        }

        // for advertisements that ends today
        try {
            Owner advertEndToday = new Owner("Advertisement End Today", "password");
            advertEndToday.setEmail("end@email.com");
            ownerService.addOwner(advertEndToday);
            advertEndToday.getWallet().setWalletBalance(BigDecimal.valueOf(10000));
            advertEndToday.setAutoRenewSubscription(true);
            ownerRepository.saveAndFlush(advertEndToday);
            walletRepository.save(advertEndToday.getWallet());
            loadSecurityContext(advertEndToday);
            createSubscription(subscriptionType, advertEndToday);
            createAdvertisement(advertEndToday, AdvertisementStatusEnum.ACTIVATED, LocalDate.now());
        } catch (Exception e) {
            e.printStackTrace();
        }

        // for advertisement that does not end today
        try {
            Owner advertEndToday = new Owner("Advertisement Dont End Today", "password");
            advertEndToday.setEmail("notend@email.com");
            ownerService.addOwner(advertEndToday);
            advertEndToday.getWallet().setWalletBalance(BigDecimal.valueOf(10000));
            advertEndToday.setAutoRenewSubscription(true);
            ownerRepository.saveAndFlush(advertEndToday);
            walletRepository.save(advertEndToday.getWallet());
            loadSecurityContext(advertEndToday);
            createSubscription(subscriptionType, advertEndToday);
            createAdvertisement(advertEndToday, AdvertisementStatusEnum.ACTIVATED, LocalDate.now().plusDays(10));
        } catch (Exception e) {
            e.printStackTrace();
        }

        // voucher listing end today
        try {
            Owner advertEndToday = new Owner("VoucherListing End Today", "password");
            advertEndToday.setEmail("vcEnd@email.com");
            ownerService.addOwner(advertEndToday);
            advertEndToday.getWallet().setWalletBalance(BigDecimal.valueOf(10000));
            advertEndToday.setAutoRenewSubscription(true);
            ownerRepository.saveAndFlush(advertEndToday);
            walletRepository.save(advertEndToday.getWallet());
            loadSecurityContext(advertEndToday);
            createSubscription(subscriptionType, advertEndToday);
            createVoucherListing(advertEndToday, false, LocalDate.now());
        } catch (Exception e) {
            e.printStackTrace();
        }

        // voucher listing dont end today
        try {
            Owner advertEndToday = new Owner("VoucherListing NOT END Today", "password");
            advertEndToday.setEmail("vcNotEnd@email.com");
            ownerService.addOwner(advertEndToday);
            advertEndToday.getWallet().setWalletBalance(BigDecimal.valueOf(10000));
            advertEndToday.setAutoRenewSubscription(true);
            ownerRepository.saveAndFlush(advertEndToday);
            walletRepository.save(advertEndToday.getWallet());
            loadSecurityContext(advertEndToday);
            createSubscription(subscriptionType, advertEndToday);
            createVoucherListing(advertEndToday, false, LocalDate.now().plusDays(10));
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    private void loadSecurityContext(Owner owner) {
        UserDetails userDetails = this.userDetailsService.loadUserByUsername(owner.getUsername());
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);
    }

    private void createSubscription(SubscriptionType subscriptionType, Owner owner) {
        Subscription expiredSubscription = subscriptionService.copyAttributes4(subscriptionType); // expired
                                                                                                  // subscription
        expiredSubscription.setSubscriptionDetails("INITIAL SUBSCRIPTION");
        owner.setNextMonthSubcriptionTypeId(subscriptionType.getSubscriptionTypeId());
        owner.setCurrentSubscriptionEndDate(expiredSubscription.getSubscriptionPeriodEnd());
        owner.getSubscription().add(expiredSubscription);
        expiredSubscription.setPurchasingOwner(owner);
        expiredSubscription.setOwnerUsername(owner.getUsername());
        expiredSubscription.setOriginalSubscriptionTypeId(subscriptionType.getSubscriptionTypeId());
        subscriptionRepository.saveAndFlush(expiredSubscription);
        owner.setCurrentSubscriptionId(expiredSubscription.getBillableId());
        ownerRepository.save(owner);
        generateVenue(owner, VenueStatusEnum.ACTIVATED);
        generateVenue(owner, VenueStatusEnum.ACTIVATED);
    }

    private Venue generateVenue(Owner owner, VenueStatusEnum venueStatus) {
        Venue specialVenue = new Venue();
        specialVenue.setVenueName("VENUE " + UUID.randomUUID());
        specialVenue.setOwner(owner);
        owner.getVenues().add(specialVenue);
        specialVenue.setVenueStatus(venueStatus);
        venueRepository.save(specialVenue);
        return specialVenue;
    }

    private void createAdvertisement(Owner owner, AdvertisementStatusEnum advertisementStatus, LocalDate enddate){
        Advertisement advertisement = new Advertisement();
        advertisement.setName("Advertisement " + UUID.randomUUID());
        advertisement.setDescription("Advertisement Details");
        advertisement.setAdvertisementStatus(advertisementStatus);
        advertisement.setStartDate(LocalDate.now());
        advertisement.setEndDate(enddate);
        advertisement.setBudgetLeft(BigDecimal.valueOf(10000L));
        advertisement.setOwner(owner);
        advertisementRepository.save(advertisement);
        owner.setAdvertisements(new ArrayList<>());
        owner.getAdvertisements().add(advertisement);
        ownerRepository.save(owner);
    }

    private void createVoucherListing(Owner owner, boolean vocherCompleted, LocalDate enddate){
        VoucherListing voucherListing = new VoucherListing();
        voucherListing.setVoucherName("VoucherListing " + UUID.randomUUID());
        voucherListing.setVoucherListingDelistDate(enddate);
        voucherListing.setValidityPeriodInDays(0);
        voucherListing.setDescription("VoucherListing Details");
        voucherListing.setVoucherValue(BigDecimal.valueOf(1000L));
        voucherListing.setVoucherCost(BigDecimal.valueOf(1000L));
        voucherListing.setVoucherStock(1000L);
        voucherListing.setEnabled(true);
        voucherListing.setAdminBanned(false);
        voucherListing.setCompleted(vocherCompleted);
        voucherListing.setOwner(owner);
        voucherListingRepository.save(voucherListing);
        owner.setVoucherListings(new ArrayList<>());
        owner.getVoucherListings().add(voucherListing);
        ownerRepository.save(owner);
    }

}
