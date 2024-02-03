package com.sgw.backend.misc;

import com.sgw.backend.entity.Owner;
import com.sgw.backend.entity.Subscription;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.entity_venue.VenueStatusEnum;
import com.sgw.backend.exception.WalletNotFoundException;
import com.sgw.backend.repository.*;
import com.sgw.backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.Pair;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;
import java.util.function.Function;
import com.sgw.backend.entity.*;
import com.sgw.backend.exception.UserHasSubscriptionException;
import com.sgw.backend.repository.OwnerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.sound.midi.SysexMessage;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class SchedulerComponent {

    private final OwnerRepository ownerRepository;

    private final WalletRepository walletRepository;

    private final SubscriptionService subscriptionService;

    private final SubscriptionTypeRepository subscriptionTypeRepository;

    private final SubscriptionRepository subscriptionRepository;

    private final VenueRepository venueRepository;

    private final OwnerService ownerService;

    private final VenueService venueService;

    private final AdvertisementService advertisementService;

    private final VoucherListingService voucherListingService;

    private final DayScheduleGeneratorService dayScheduleGeneratorService;

    @Scheduled(cron = "0 0 0 * * ?")
    public void triggerDayScheduleGenerators() {
        System.out.println("12:00 AM: Generating configured day schedules for all venues...");
        dayScheduleGeneratorService.getAllDayScheduleGenerators().forEach(
                dayScheduleGenerator -> dayScheduleGeneratorService.generateDaySchedules(dayScheduleGenerator)
        );
        System.out.println("Generating done");
    }
    @Scheduled(cron = "0 59 23 * * ?")
    public void helloWorldEveryNight() {
        System.out.println("Scheduled task executed at 11:59 PM!");
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Scheduled(cron = "0 59 23 * * ?")
    public void subscriptionCleaningServiceAtNight() {
        renewSubscription();
        venueService.disableVenues(LocalDate.now());
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Scheduled(cron = "0 59 23 * * ?")
    public void advertisementCleanUpServiceAtNight() {
        advertisementService.completeAllAdvertisementScheduler();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Scheduled(cron = "0 59 23 * * ?")
    public void voucherListingCleanUpServiceAtNight() {
        voucherListingService.voucherListingCleanUpTask();
    }

    public void disableVenues() {
        System.out.println("DISABLE");
        disableVenuesForOwnersWithoutSubscription();
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
                            return Optional.ofNullable(Pair.of(o, s)); // valid subscription but venue limit too much
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

    private void disableVenuesForOwnersWithoutSubscription() {
        List<Owner> allOwners = ownerRepository.findAll();

        allOwners.stream().map(o -> {
            if (o.getCurrentSubscriptionId() != null) {
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

    public void renewSubscription() {

        // all active owners with auto renew on
        List<Owner> activeAndAutoRenewOwners = ownerRepository.findAll()
                .stream()
                .filter(o -> o.isEnabled() && o.isAutoRenewSubscription())
                .collect(Collectors.toList());

        // TODO: 14 OCT NEED TO GET THOSE WHO DIABLED FOR THE FREE ONE

        List<Owner> deactiveAndAutoRenewOwner = ownerRepository.findAll()
                .stream()
                .filter(o -> o.isEnabled() && !o.isAutoRenewSubscription())
                .collect(Collectors.toList());

        for (Owner owner : deactiveAndAutoRenewOwner) {
            Optional<SubscriptionType> free = subscriptionTypeRepository.findById(1l);
            subscriptionService.createSubscriptionAutoRenew2(owner, free.get());
        }

        LocalDate currDate = LocalDate.now();

        for (Owner owner : activeAndAutoRenewOwners) {

            // check if owner has owner has a subscription type for next month
            Optional<Long> whatIsNextMonthSubscriptionType = Optional.ofNullable(owner.getNextMonthSubcriptionTypeId());
            // if it is empty means they never buy anything before, even if active still
            // dont do anything
            // current subscription end date < today || current subscription end date ==
            // today
            if (!whatIsNextMonthSubscriptionType.isEmpty() && (owner.getCurrentSubscriptionEndDate().isBefore(currDate)
                    || owner.getCurrentSubscriptionEndDate().isEqual(currDate))) {
                try {
                    // basically once you enter here, you have
                    // - activated auto buy
                    // - bought a subscription before cuase next month subscription will be empty if
                    // never buy before
                    // - your current subscription end date is either expired or expires today
                    // enter here means you buy a subscription

                    // TODO: ADDED 14 OCT: basically buy free sub plan for those who no money
                    Optional<SubscriptionType> currentSubType = subscriptionTypeRepository
                            .findById(owner.getNextMonthSubcriptionTypeId());

                    // What we doing here: is to check the wallet balance enough or not if not
                    // enough YOU GET A FUCKING FREE PLAN
                    BigDecimal currentSubTypePrice = currentSubType.get().getSubscriptionTypePrice()
                            .multiply(new BigDecimal(100));
                    Wallet currentOwnerWallet = walletRepository.findById(owner.getWallet().getWalletId()).orElse(null);

                    if (currentOwnerWallet == null) {
                        throw new WalletNotFoundException("WTF WHY WALLET NOT FOUND");
                    }
                    System.out.println(currentOwnerWallet.getWalletBalance());
                    System.out.println(owner.getUsername());
                    System.out.println(currentSubTypePrice);
                    // if the balance more than the price OR balance == price then get the
                    // subscription if else FREE
                    if (currentOwnerWallet.getWalletBalance().compareTo(currentSubTypePrice) > 0
                            || currentOwnerWallet.getWalletBalance().compareTo(currentSubTypePrice) == 0) {
                        subscriptionService.createSubscriptionAutoRenew2(owner, currentSubType.get());
                    } else {
                        Optional<SubscriptionType> free = subscriptionTypeRepository.findById(1l);
                        subscriptionService.createSubscriptionAutoRenew2(owner, free.get());
                    }

                } catch (RuntimeException r) {
                    System.out.print(r.toString());
                }
            }
        }
    }

    // just seeing if this works

    public void disableVenueIfNoSubscription() {
        List<Owner> activeAndAutoRenewOwners = ownerRepository.findAll()
                .stream()
                .filter(o -> o.isEnabled())
                .collect(Collectors.toList());

        for (Owner owner : activeAndAutoRenewOwners) {
            List<Subscription> userlist = owner.getSubscription();
            try {
                // if never buy before dont do anything by right all venue should be inactive
                if (userlist.isEmpty()) {
                    throw new RuntimeException("User never bought a subscription type");
                }

                Subscription latestSubscription = userlist.get(0);
                for (Subscription s : userlist) {
                    if (s.getSubscriptionPeriodEnd().isAfter(latestSubscription.getSubscriptionPeriodEnd())) {
                        latestSubscription = s;
                    }
                }

                LocalDate currDate = LocalDate.now();
                // check if subscription is valid
                if (!currDate.equals(latestSubscription.getSubscriptionPeriodEnd())
                        && currDate.isBefore(latestSubscription.getSubscriptionPeriodEnd())) {
                    // valid subscription enter here

                    // first check to see if the venue active more than subscription
                    // check that active venue == venue lisitng limit
                    if (owner.getVenues().size() > latestSubscription.getVenueListingLimit()) {
                        int maxVenueActive = latestSubscription.getVenueListingLimit();
                        List<Venue> unmanagedVenue = owner.getVenues();
                        for (Venue v : unmanagedVenue) {
                            if (maxVenueActive > 0) {
                                v.setVenueStatus(VenueStatusEnum.ACTIVATED);
                                venueRepository.save(v);
                                maxVenueActive--;
                            } else {
                                v.setVenueStatus(VenueStatusEnum.DEACTIVATED);
                                venueRepository.save(v);
                            }
                        }
                        owner.setVenues(unmanagedVenue);
                        ownerRepository.save(owner);
                    }
                } else {
                    // enter here means no valid subscription
                    // set all venue to deactivated
                    List<Venue> unmanagedVenue = owner.getVenues();
                    for (Venue v : unmanagedVenue) {
                        v.setVenueStatus(VenueStatusEnum.DEACTIVATED);
                        venueRepository.save(v);
                    }
                    owner.setVenues(unmanagedVenue);
                    ownerRepository.save(owner);
                }
            } catch (RuntimeException r) {
                System.out.print(r.toString());
            }
        }
    }
}
