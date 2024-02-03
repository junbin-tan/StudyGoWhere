package com.sgw.backend.service;

import com.sgw.backend.entity.*;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.entity_venue.VenueStatusEnum;
import com.sgw.backend.exception.*;
import com.sgw.backend.repository.*;
import com.sgw.backend.utilities.USER_CONSTANT;
import com.sgw.backend.utilities.UserContext;
import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.function.Predicate;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;

    private final SubscriptionTypeRepository subscriptionTypeRepository;

    private final UserContext userContext;

    private final OwnerRepository ownerRepository;

    private final AdminRepository adminRepository;

    private final TransactionService transactionService;

    private final VenueRepository venueRepository;

    public Subscription createSubscription(SubscriptionType subscriptionType) {
        Owner o = userContext.obtainRequesterIdentity((username) -> ownerRepository.getOwnerByUsername(username))
                .orElse(null);
        Admin admin = Optional.ofNullable(adminRepository.getAdminByUsername(USER_CONSTANT.FINANCE_ADMIN)).orElse(null);
        if (o == null || admin == null) {
            throw new InvalidUserException("User not found");
        }

        LocalDate currDate = LocalDate.now();

        o.setNextMonthSubcriptionTypeId(subscriptionType.getSubscriptionTypeId());
        ownerRepository.save(o);

        // check that if a subscription is present, but the end date is not day, throw
        // user has an active subscription (UNLESS IT IS FREE)
        if (!o.getSubscription().isEmpty()) {

            List<Subscription> userlist = o.getSubscription();

            // check what is the latest subscription, but never check what is the type? FML
            // I want to cry
            // TODO: NEED A WAY TO LIKE CHECK WHICH TYPE IS THE ONE WE SHOULD KEEP, LIKE IF
            // GOT GOLD AND FREE WE TAKE GOLD

            List<Subscription> ifMultipleSubscriptionDifferentTierSameEndDate = new ArrayList<>();

            // if sub End is after current date
            // same as if currentdate is before end date, will check that this is a valid
            // subscription

            for (Subscription s : userlist) {
                if (currDate.isBefore(s.getSubscriptionPeriodEnd())) {
                    ifMultipleSubscriptionDifferentTierSameEndDate.add(s);
                }
            }

            // if only got > 1 in this list
            Subscription latestSubscription = ifMultipleSubscriptionDifferentTierSameEndDate.get(0);

            if (ifMultipleSubscriptionDifferentTierSameEndDate.size() > 1) {
                for (Subscription s : ifMultipleSubscriptionDifferentTierSameEndDate) {
                    if (s.getBillablePrice().compareTo(latestSubscription.getBillablePrice()) > 0) {
                        latestSubscription = s;
                    }
                }
            } else {
                latestSubscription = ifMultipleSubscriptionDifferentTierSameEndDate.get(0);
            }

            SubscriptionType theirOldSubscriptionType = subscriptionTypeRepository
                    .findById(latestSubscription.getOriginalSubscriptionTypeId()).orElseThrow();
            SubscriptionType newSubscriptionType = subscriptionTypeRepository
                    .findById(subscriptionType.getSubscriptionTypeId()).orElseThrow();

            // if
            // (theirOldSubscriptionType.getSubscriptionTypePrice().compareTo(newSubscriptionType.getSubscriptionTypePrice())
            // >0) {
            // throw new UserHasSubscriptionException("User has a subscription");
            // }

            // check if curr date != subscription end date (meaning its a valid
            // subscription)
            if (!currDate.equals(latestSubscription.getSubscriptionPeriodEnd())
                    && currDate.isBefore(latestSubscription.getSubscriptionPeriodEnd())
                    && (theirOldSubscriptionType.getSubscriptionTypePrice()
                            .compareTo(newSubscriptionType.getSubscriptionTypePrice()) > 0
                            || theirOldSubscriptionType.getSubscriptionTypePrice()
                                    .compareTo(newSubscriptionType.getSubscriptionTypePrice()) == 0)) {
                throw new UserHasSubscriptionException("User has a subscription");
            }
        }
        // this means that, the user either
        // has a subscription but expire or dont have before
        Subscription subscription = createSubscriptionBasedOnType(subscriptionType, o);

        try {
            Transaction t = transactionService.createAndAddTransaction(subscription, o.getWallet(), admin.getWallet());
            transactionService.completeATransaction(t);
        } catch (PayerBalanceInsufficientException e) {
            throw new NotEnoughMoneyInWalletException("INSUFFICIENT BALANCE");
        } catch (BillableAlreadyHasTransactionException ex) {
            throw new UserHasSubscriptionException("SUBSCRIPTION ALREADY HAS TRANSACTION");
        } catch (TransactionNotPendingException e) {
            throw new RuntimeException("TRANSACTION STATUS NOT PENDING");
        }
        return subscription;
    }

    public Subscription createSubscriptionForInternal(SubscriptionType subscriptionType) {
        Owner o = userContext.obtainRequesterIdentity((username) -> ownerRepository.getOwnerByUsername(username))
                .orElse(null);
        Admin admin = Optional.ofNullable(adminRepository.getAdminByUsername(USER_CONSTANT.FINANCE_ADMIN)).orElse(null);

        if (o == null || admin == null) {
            throw new InvalidUserException("User not found");
        }

        LocalDate currDate = LocalDate.now();

        o.setNextMonthSubcriptionTypeId(subscriptionType.getSubscriptionTypeId());
        ownerRepository.save(o);

        // check that if a subscription is present, but the end date is not day, throw
        // user has an active subscription (UNLESS IT IS FREE)
        if (!o.getSubscription().isEmpty()) {

            List<Subscription> userlist = o.getSubscription();

            // check what is the latest subscription, but never check what is the type? FML
            // I want to cry
            // TODO: NEED A WAY TO LIKE CHECK WHICH TYPE IS THE ONE WE SHOULD KEEP, LIKE IF
            // GOT GOLD AND FREE WE TAKE GOLD

            List<Subscription> ifMultipleSubscriptionDifferentTierSameEndDate = new ArrayList<>();

            // if sub End is after current date
            // same as if currentdate is before end date, will check that this is a valid
            // subscription

            for (Subscription s : userlist) {
                if (currDate.isBefore(s.getSubscriptionPeriodEnd())) {
                    ifMultipleSubscriptionDifferentTierSameEndDate.add(s);
                }
            }

            // if only got > 1 in this list
            Subscription latestSubscription = ifMultipleSubscriptionDifferentTierSameEndDate.get(0);

            if (ifMultipleSubscriptionDifferentTierSameEndDate.size() > 1) {
                for (Subscription s : ifMultipleSubscriptionDifferentTierSameEndDate) {
                    if (s.getBillablePrice().compareTo(latestSubscription.getBillablePrice()) > 0) {
                        latestSubscription = s;
                    }
                }
            } else {
                latestSubscription = ifMultipleSubscriptionDifferentTierSameEndDate.get(0);
            }

            SubscriptionType theirOldSubscriptionType = subscriptionTypeRepository
                    .findById(latestSubscription.getOriginalSubscriptionTypeId()).orElseThrow();
            SubscriptionType newSubscriptionType = subscriptionTypeRepository
                    .findById(subscriptionType.getSubscriptionTypeId()).orElseThrow();

            // if
            // (theirOldSubscriptionType.getSubscriptionTypePrice().compareTo(newSubscriptionType.getSubscriptionTypePrice())
            // >0) {
            // throw new UserHasSubscriptionException("User has a subscription");
            // }

            // check if curr date != subscription end date (meaning its a valid
            // subscription)
            // this also check if this the subscription they are selecting is more expensive
            // than their current one then this throw and queeue
            if (!currDate.equals(latestSubscription.getSubscriptionPeriodEnd())
                    && currDate.isBefore(latestSubscription.getSubscriptionPeriodEnd())
                    && (theirOldSubscriptionType.getSubscriptionTypePrice()
                            .compareTo(newSubscriptionType.getSubscriptionTypePrice()) > 0
                            || theirOldSubscriptionType.getSubscriptionTypePrice()
                                    .compareTo(newSubscriptionType.getSubscriptionTypePrice()) == 0)) {
                throw new UserHasSubscriptionException("User has a subscription");
            }
        }
        // Subscription subscription = createSubscriptionBasedOnType(subscriptionType,
        // o);
        Subscription subscription = new Subscription();
        // this means that, the user either
        // has a subscription but expire or dont have before
        // or buying a more expensive one
        // so here i need check fml check if the date

        // TODO: If the current subscription has balance until end date or not

        Subscription currentSubscription = subscriptionRepository.findById(o.getCurrentSubscriptionId()).orElse(null);
        if (currentSubscription != null) {
            LocalDate currentSubscriptionEndDate = currentSubscription.getSubscriptionPeriodEnd();
            LocalDate sec_NOV = LocalDate.of(2023, 11, 2);

            int daysLeftOfSubscription = (int) ChronoUnit.DAYS.between(LocalDate.now(), currentSubscriptionEndDate);

            // int daysLeftOfSubscription = (int) ChronoUnit.DAYS.between(sec_NOV,
            // currentSubscriptionEndDate);
            System.out.println("number of day: " + daysLeftOfSubscription);

            // if days more than 1 then we give some discount im crying
            if (daysLeftOfSubscription >= 0) {
                subscription = createSubscriptionBasedOnTypeDiscount(subscriptionType, o, daysLeftOfSubscription);

            } else {
                subscription = createSubscriptionBasedOnType(subscriptionType, o);
            }
        } else {
            subscription = createSubscriptionBasedOnType(subscriptionType, o);
        }

        try {
            Transaction t = transactionService.createAndAddTransaction(subscription, o.getWallet(), admin.getWallet());
            transactionService.completeATransaction(t);
        } catch (PayerBalanceInsufficientException e) {
            throw new NotEnoughMoneyInWalletException("INSUFFICIENT BALANCE");
        } catch (BillableAlreadyHasTransactionException ex) {
            throw new UserHasSubscriptionException("SUBSCRIPTION ALREADY HAS TRANSACTION");
        } catch (TransactionNotPendingException e) {
            throw new RuntimeException("TRANSACTION STATUS NOT PENDING");
        }
        return subscription;
    }

    public Subscription createSubscriptionBasedOnType(SubscriptionType subscriptionType, Owner o) {
        SubscriptionType subType = subscriptionTypeRepository.findById(subscriptionType.getSubscriptionTypeId())
                .orElse(null);
        Owner owner = ownerRepository.findById(o.getUserId()).orElse(null);
        if (subType == null) {
            throw new RuntimeException("Subscription Type not found");
        }
        if (owner == null) {
            throw new RuntimeException("Owner not found");
        }

        Subscription newSubscription = copyAttributes(subType);

        owner.getSubscription().add(newSubscription);
        owner.setAutoRenewSubscription(true);
        owner.setCurrentSubscriptionId(newSubscription.getBillableId());
        owner.setCurrentSubscriptionEndDate(newSubscription.getSubscriptionPeriodEnd());
        newSubscription.setPurchasingOwner(owner);
        newSubscription.setOwnerUsername(owner.getUsername());
        newSubscription.setOriginalSubscriptionTypeId(subscriptionType.getSubscriptionTypeId());
        subscriptionRepository.save(newSubscription);
        owner.setCurrentSubscriptionId(newSubscription.getBillableId());
        ownerRepository.save(owner);
        ownerRepository.flush();
        subscriptionTypeRepository.flush();

        return newSubscription;
    }

    private Subscription createSubscriptionBasedOnTypeDiscount(SubscriptionType subscriptionType, Owner o,
            int daysLeftOfSubscription) {
        SubscriptionType subType = subscriptionTypeRepository.findById(subscriptionType.getSubscriptionTypeId())
                .orElse(null);
        Owner owner = ownerRepository.findById(o.getUserId()).orElse(null);

        if (subType == null) {
            throw new RuntimeException("Subscription Type not found");
        }
        if (owner == null) {
            throw new RuntimeException("Owner not found");
        }

        Subscription currentSubscription = subscriptionRepository.findById(o.getCurrentSubscriptionId()).orElse(null);
        BigDecimal currentSubscriptionPrice = currentSubscription.getBillablePrice();

        BigDecimal discount1 = currentSubscriptionPrice.divide(new BigDecimal(30), 2, RoundingMode.HALF_UP);
        BigDecimal discount2 = discount1.multiply(new BigDecimal(daysLeftOfSubscription));

        BigDecimal discount3 = new BigDecimal(discount2.toBigInteger());
        BigDecimal discount4 = discount3.divide(new BigDecimal(100));
        BigDecimal discount5 = new BigDecimal(discount4.toBigInteger());
        BigDecimal discount6 = discount5.multiply(new BigDecimal(100));

        System.out.println("discount6: " + discount6.toString());

        Subscription newSubscription = copyAttributes(subType);
        BigDecimal newSubcriptionOriginalPrice = newSubscription.getBillablePrice();

        System.out.println("price: " + newSubcriptionOriginalPrice.toString());

        if (newSubcriptionOriginalPrice.compareTo(discount6) > 0) {
            newSubscription.setBillablePrice(newSubcriptionOriginalPrice.subtract(discount6));
            System.out.println("BILLABLE PRICE: " + newSubscription.getBillablePrice().toString());
        }

        owner.getSubscription().add(newSubscription);
        owner.setAutoRenewSubscription(true);
        owner.setCurrentSubscriptionId(newSubscription.getBillableId());
        owner.setCurrentSubscriptionEndDate(newSubscription.getSubscriptionPeriodEnd());
        newSubscription.setPurchasingOwner(owner);
        newSubscription.setOwnerUsername(owner.getUsername());
        newSubscription.setOriginalSubscriptionTypeId(subscriptionType.getSubscriptionTypeId());
        subscriptionRepository.save(newSubscription);
        owner.setCurrentSubscriptionId(newSubscription.getBillableId());
        ownerRepository.save(owner);
        ownerRepository.flush();
        subscriptionTypeRepository.flush();

        return newSubscription;
    }

    public Subscription copyAttributesDiscount(SubscriptionType subscriptionType, BigDecimal discount4) {
        Subscription subscription = new Subscription();
        LocalDate currDate = LocalDate.now();

        subscription.setSubscriptionDetails(subscriptionType.getSubscriptionTypeDetails());
        subscription.setSubscriptionPeriodStart(currDate);
        subscription.setSubscriptionPeriodEnd(currDate.plusDays(subscriptionType.getSubscriptionTypeDuration()));

        // TODO : make sure the duration is correct

        subscription.setSubscriptionDurationDays(subscriptionType.getSubscriptionTypeDuration());
        subscription.setDateCreated(currDate);
        subscription.setVenueListingLimit(subscriptionType.getSubscriptionTypeVenueLimit());
        // setting this cause backend is in cents rn
        subscription.setBillablePrice(subscriptionType.getSubscriptionTypePrice().multiply(new BigDecimal(100)));

        subscription.setSubscriptionName(subscriptionType.getSubscriptionTypeName());
        return subscription;
    }

    public Subscription copyAttributes(SubscriptionType subscriptionType) {
        Subscription subscription = new Subscription();
        LocalDate currDate = LocalDate.now();

        subscription.setSubscriptionDetails(subscriptionType.getSubscriptionTypeDetails());
        subscription.setSubscriptionPeriodStart(currDate);
        subscription.setSubscriptionPeriodEnd(currDate.plusDays(subscriptionType.getSubscriptionTypeDuration()));

        // TODO : make sure the duration is correct

        subscription.setSubscriptionDurationDays(subscriptionType.getSubscriptionTypeDuration());
        subscription.setDateCreated(currDate);
        subscription.setVenueListingLimit(subscriptionType.getSubscriptionTypeVenueLimit());
        // setting this cause backend is in cents rn
        subscription.setBillablePrice(subscriptionType.getSubscriptionTypePrice().multiply(new BigDecimal(100)));
        subscription.setSubscriptionName(subscriptionType.getSubscriptionTypeName());
        return subscription;
    }

    public Subscription copyAttributes2(SubscriptionType subscriptionType) {
        Subscription subscription = new Subscription();
        LocalDate currDate = LocalDate.now();

        subscription.setSubscriptionDetails(subscriptionType.getSubscriptionTypeDetails());
        subscription.setSubscriptionPeriodStart(currDate);
        subscription.setSubscriptionPeriodEnd(currDate.minusDays(1));

        // TODO : make sure the duration is correct

        subscription.setSubscriptionDurationDays(subscriptionType.getSubscriptionTypeDuration());
        subscription.setDateCreated(currDate);
        subscription.setVenueListingLimit(subscriptionType.getSubscriptionTypeVenueLimit());
        // setting this cause backend is in cents rn
        subscription.setBillablePrice(subscriptionType.getSubscriptionTypePrice().multiply(new BigDecimal(100)));
        subscription.setSubscriptionName(subscriptionType.getSubscriptionTypeName());
        return subscription;
    }

    public Subscription copyAttributes4(SubscriptionType subscriptionType) {
        Subscription subscription = new Subscription();
        LocalDate currDate = LocalDate.now();

        subscription.setSubscriptionDetails(subscriptionType.getSubscriptionTypeDetails());
        subscription.setSubscriptionPeriodStart(currDate.minusDays(30));
        subscription.setSubscriptionPeriodEnd(currDate.minusDays(0));
        subscription.setDateCreated(currDate.minusDays(30));

        // TODO : make sure the duration is correct

        subscription.setSubscriptionDurationDays(subscriptionType.getSubscriptionTypeDuration());
        subscription.setDateCreated(currDate.minusDays(30));
        subscription.setVenueListingLimit(subscriptionType.getSubscriptionTypeVenueLimit());
        // setting this cause backend is in cents rn
        subscription.setBillablePrice(subscriptionType.getSubscriptionTypePrice().multiply(new BigDecimal(100)));
        subscription.setSubscriptionName(subscriptionType.getSubscriptionTypeName());
        return subscription;
    }

    public Subscription copyAttributes3(SubscriptionType subscriptionType) {
        Subscription subscription = new Subscription();
        LocalDate currDate = LocalDate.now();

        subscription.setSubscriptionDetails(subscriptionType.getSubscriptionTypeDetails());
        subscription.setSubscriptionPeriodStart(currDate);
        subscription.setSubscriptionPeriodEnd(currDate.plusDays(1));

        // TODO : make sure the duration is correct

        subscription.setSubscriptionDurationDays(subscriptionType.getSubscriptionTypeDuration());
        subscription.setDateCreated(currDate);
        subscription.setVenueListingLimit(subscriptionType.getSubscriptionTypeVenueLimit());
        // setting this cause backend is in cents rn
        subscription.setBillablePrice(subscriptionType.getSubscriptionTypePrice().multiply(new BigDecimal(100)));
        subscription.setSubscriptionName(subscriptionType.getSubscriptionTypeName());
        return subscription;
    }

    public Optional<Subscription> findAssociatedSubscription() {
        Owner owner = userContext.obtainRequesterIdentity((username) -> ownerRepository.getOwnerByUsername(username))
                .orElse(null);

        if (owner == null) {
            throw new InvalidUserException("User not found");
        }

        if (owner.getSubscription().isEmpty()) {
            return Optional.empty();
        }
        //
        // List<Subscription> userlist = owner.getSubscription();
        //
        // Subscription latestSubscription = userlist.get(0);
        // for (Subscription s : userlist) {
        // if
        // (s.getSubscriptionPeriodEnd().isAfter(latestSubscription.getSubscriptionPeriodEnd()))
        // {
        // latestSubscription = s;
        // }
        // }

        Subscription latestSubscription = subscriptionRepository.findById(owner.getCurrentSubscriptionId())
                .orElse(null);

        return Optional.of(latestSubscription);
    }

    public boolean queueNextSubscription(SubscriptionType type) {
        Optional<SubscriptionType> optType = subscriptionTypeRepository.findById(type.getSubscriptionTypeId());
        Owner owner = userContext.obtainRequesterIdentity((username) -> ownerRepository.getOwnerByUsername(username))
                .orElse(null);

        if (owner == null || optType.isEmpty()) {
            return false;
        }

        owner.setNextMonthSubcriptionTypeId(optType.get().getSubscriptionTypeId());
        ownerRepository.save(owner);
        return true;

    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Subscription createSubscriptionAutoRenew2(Owner current, SubscriptionType subscriptionType) {
        Owner o = ownerRepository.getOwnerByUsername(current.getUsername());
        Admin admin = Optional.ofNullable(adminRepository.getAdminByUsername(USER_CONSTANT.FINANCE_ADMIN)).orElse(null);
        SubscriptionType theSubscriptionType = subscriptionTypeRepository
                .findById(subscriptionType.getSubscriptionTypeId()).orElse(null);
        if (o == null || admin == null || theSubscriptionType == null) {
            throw new InvalidUserException("WTF MAN, createSubcriptionAutoRenew NOT WORKING");
        }
        LocalDate currDate = LocalDate.now();
        Subscription subscription = createSubscriptionBasedOnType(theSubscriptionType, o);
        try {
            Transaction t = transactionService.createAndAddTransaction(subscription, o.getWallet(), admin.getWallet());
            transactionService.completeATransaction(t);
        } catch (PayerBalanceInsufficientException e) {
            throw new NotEnoughMoneyInWalletException("INSUFFICIENT BALANCE");
        } catch (BillableAlreadyHasTransactionException ex) {
            throw new UserHasSubscriptionException("SUBSCRIPTION ALREADY HAS TRANSACTION");
        } catch (TransactionNotPendingException e) {
            throw new RuntimeException("TRANSACTION STATUS NOT PENDING");
        }
        return subscription;
    }

}
