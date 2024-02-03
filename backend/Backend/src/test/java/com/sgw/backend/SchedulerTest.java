package com.sgw.backend;

import com.sgw.backend.entity.*;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.entity_venue.VenueStatusEnum;
import com.sgw.backend.misc.SchedulerComponent;
import com.sgw.backend.repository.*;
import com.sgw.backend.service.SubscriptionService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionCallbackWithoutResult;
import org.springframework.transaction.support.TransactionTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestPropertySource(locations = "classpath:application-test.properties")
public class SchedulerTest {
        private final SubscriptionRepository subscriptionRepository;
        private final SubscriptionService subscriptionService;
        private final PasswordEncoder passwordEncoder;
        private final VenueRepository venueRepository;
        private final SchedulerComponent schedulerComponent;
        private final WalletRepository walletRepository;
        private final OwnerRepository ownerRepository;
        private final SubscriptionTypeRepository subscriptionTypeRepository;

        private final TransactionTemplate transactionTemplate;

        @Autowired
        public SchedulerTest(
                        SubscriptionRepository subscriptionRepository,
                        SubscriptionService subscriptionService,
                        PasswordEncoder passwordEncoder,
                        VenueRepository venueRepository,
                        SchedulerComponent schedulerComponent,
                        WalletRepository walletRepository,
                        OwnerRepository ownerRepository,
                        SubscriptionTypeRepository subscriptionTypeRepository,
                        PlatformTransactionManager transactionManager) {
                this.subscriptionRepository = subscriptionRepository;
                this.subscriptionService = subscriptionService;
                this.passwordEncoder = passwordEncoder;
                this.venueRepository = venueRepository;
                this.schedulerComponent = schedulerComponent;
                this.walletRepository = walletRepository;
                this.ownerRepository = ownerRepository;
                this.subscriptionTypeRepository = subscriptionTypeRepository;
                this.transactionTemplate = new TransactionTemplate(transactionManager);
                this.transactionTemplate.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
        }

        private static Owner group1;

        private static Owner group2;

        @BeforeAll
        public void testInit() {
                SubscriptionType subscriptionType = new SubscriptionType();
                subscriptionType.setSubscriptionTypeName("type with limit 3");
                subscriptionType.setSubscriptionTypeVenueLimit(3);
                subscriptionType.setSubscriptionTypePrice(BigDecimal.valueOf(100L));
                subscriptionType.setSubscriptionTypeDuration(30);
                subscriptionTypeRepository.saveAndFlush(subscriptionType);

                // TODO : GROUP 1 owner with no subscription
                Owner ownerNoSubscription = new Owner("ownerTestt WITHOUT SUBSCRIPTION",
                                passwordEncoder.encode("password"));
                ownerNoSubscription.setAutoRenewSubscription(true);
                Wallet walletWo = new Wallet();
                ownerNoSubscription.setWallet(walletWo);
                walletWo.setGeneralUser(ownerNoSubscription);
                walletRepository.save(walletWo);
                ownerRepository.save(ownerNoSubscription);

                generateVenue(ownerNoSubscription, VenueStatusEnum.DELETED);
                generateVenue(ownerNoSubscription, VenueStatusEnum.ACTIVATED);
                generateVenue(ownerNoSubscription, VenueStatusEnum.DEACTIVATED);

                // TODO : GROUP 2 owner with expired subscription

                Subscription expiredSubscription = subscriptionService.copyAttributes4(subscriptionType); // expired
                                                                                                          // subscription

                Owner ownerWithExpiredSubscription = new Owner("ownerTestt WITH EXPIRED SUBSCRIPTION NO BALANCE",
                                passwordEncoder.encode("password"));
                ownerWithExpiredSubscription.getSubscription().add(expiredSubscription);
                ownerWithExpiredSubscription.setAutoRenewSubscription(true);
                Wallet wallet = new Wallet();
                wallet.setWalletBalance(BigDecimal.ZERO);
                ownerWithExpiredSubscription.setWallet(wallet);
                wallet.setGeneralUser(ownerWithExpiredSubscription);
                walletRepository.save(wallet);
                expiredSubscription.setPurchasingOwner(ownerWithExpiredSubscription);
                subscriptionRepository.saveAndFlush(expiredSubscription);

                ownerWithExpiredSubscription.setNextMonthSubcriptionTypeId(subscriptionType.getSubscriptionTypeId());
                ownerWithExpiredSubscription
                                .setCurrentSubscriptionEndDate(expiredSubscription.getSubscriptionPeriodEnd());
                ownerWithExpiredSubscription.setCurrentSubscriptionId(expiredSubscription.getBillableId());
                ownerRepository.save(ownerWithExpiredSubscription);

                generateVenue(ownerWithExpiredSubscription, VenueStatusEnum.DELETED);
                generateVenue(ownerWithExpiredSubscription, VenueStatusEnum.ACTIVATED);
                generateVenue(ownerWithExpiredSubscription, VenueStatusEnum.DEACTIVATED);

                // TODO : GROUP 3 owner with expired subscription and sufficient
                Subscription subscriptionExpired = subscriptionService.copyAttributes4(subscriptionType); // expired
                                                                                                          // subscription

                Owner ownerExpiredSubscriptionWithBalance = new Owner(
                                "ownerTestt WITH EXPIRED SUBSCRIPTION WITH BALANCE",
                                passwordEncoder.encode("password"));
                ownerExpiredSubscriptionWithBalance.getSubscription().add(subscriptionExpired);
                ownerExpiredSubscriptionWithBalance.setAutoRenewSubscription(true);
                Wallet walletWithBalance = new Wallet();
                walletWithBalance.setWalletBalance(BigDecimal.valueOf(10000000));
                ownerExpiredSubscriptionWithBalance.setWallet(walletWithBalance);
                walletWithBalance.setGeneralUser(ownerExpiredSubscriptionWithBalance);
                walletRepository.save(walletWithBalance);
                subscriptionExpired.setPurchasingOwner(ownerExpiredSubscriptionWithBalance);
                subscriptionRepository.saveAndFlush(subscriptionExpired);

                ownerExpiredSubscriptionWithBalance
                                .setNextMonthSubcriptionTypeId(subscriptionType.getSubscriptionTypeId());
                ownerExpiredSubscriptionWithBalance
                                .setCurrentSubscriptionEndDate(subscriptionExpired.getSubscriptionPeriodEnd());
                ownerExpiredSubscriptionWithBalance.setCurrentSubscriptionId(subscriptionExpired.getBillableId());
                ownerRepository.save(ownerExpiredSubscriptionWithBalance);

                generateVenue(ownerExpiredSubscriptionWithBalance, VenueStatusEnum.DELETED);
                generateVenue(ownerExpiredSubscriptionWithBalance, VenueStatusEnum.ACTIVATED);
                generateVenue(ownerExpiredSubscriptionWithBalance, VenueStatusEnum.DEACTIVATED);

                // TODO : GROUP 4 owner with valid subscription

                Subscription validSubscription = subscriptionService.copyAttributes3(subscriptionType);

                Owner ownerValidSubscription = new Owner("ownerTestt WITH VALID SUBSCRIPTION",
                                passwordEncoder.encode("password"));
                ownerValidSubscription.getSubscription().add(validSubscription);
                ownerValidSubscription.setAutoRenewSubscription(true);
                Wallet wallet2 = new Wallet();
                ownerValidSubscription.setWallet(wallet2);
                wallet2.setGeneralUser(ownerValidSubscription);
                walletRepository.save(wallet2);

                validSubscription.setPurchasingOwner(ownerValidSubscription);
                subscriptionRepository.saveAndFlush(validSubscription);

                ownerValidSubscription.setNextMonthSubcriptionTypeId(subscriptionType.getSubscriptionTypeId());
                ownerValidSubscription.setCurrentSubscriptionEndDate(validSubscription.getSubscriptionPeriodEnd());
                ownerValidSubscription.setCurrentSubscriptionId(validSubscription.getBillableId());
                ownerRepository.save(ownerValidSubscription);

                generateVenue(ownerValidSubscription, VenueStatusEnum.DELETED);
                generateVenue(ownerValidSubscription, VenueStatusEnum.ACTIVATED);
                generateVenue(ownerValidSubscription, VenueStatusEnum.DEACTIVATED);

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

        @Test
        public void testAll() {
                schedulerComponent.subscriptionCleaningServiceAtNight();

                transactionTemplate.execute(new TransactionCallbackWithoutResult() {
                        public void doInTransactionWithoutResult(TransactionStatus status) {
                                Owner ownerNoSubscription = ownerRepository
                                                .getOwnerByUsername("ownerTestt WITHOUT SUBSCRIPTION");
                                Owner ownerExpiredSubscriptionNoBalance = ownerRepository
                                                .getOwnerByUsername("ownerTestt WITH EXPIRED SUBSCRIPTION NO BALANCE");
                                Owner ownerExpiredSubscriptionWithBalance = ownerRepository
                                                .getOwnerByUsername(
                                                                "ownerTestt WITH EXPIRED SUBSCRIPTION WITH BALANCE");
                                Owner ownerValidSubscription = ownerRepository
                                                .getOwnerByUsername("ownerTestt WITH VALID SUBSCRIPTION");

                                // TODO : GROUP 1 owner without subscription at ALL
                                assertTrue(checkVenueStatusCount(ownerNoSubscription, VenueStatusEnum.ACTIVATED, 0L));
                                assertTrue(checkVenueStatusCount(ownerNoSubscription, VenueStatusEnum.DELETED, 1L));
                                assertTrue(checkVenueStatusCount(ownerNoSubscription, VenueStatusEnum.DEACTIVATED, 2L));

                                // TODO : GROUP 2 owner without expired subscription and NO balance
                                assertTrue(checkVenueStatusCount(ownerExpiredSubscriptionNoBalance,
                                                VenueStatusEnum.ACTIVATED, 0L));
                                assertTrue(checkVenueStatusCount(ownerExpiredSubscriptionNoBalance,
                                                VenueStatusEnum.DELETED, 1L));
                                assertTrue(checkVenueStatusCount(ownerExpiredSubscriptionNoBalance,
                                                VenueStatusEnum.DEACTIVATED, 2L));
                                assertFalse(ownerExpiredSubscriptionNoBalance.getCurrentSubscriptionEndDate()
                                                .isAfter(LocalDate.now()));

                                // TODO : GROUP 3 owner without expired subscription and WITH balance -> RENEWED
                                // subscription
                                assertTrue(checkVenueStatusCount(ownerExpiredSubscriptionWithBalance,
                                                VenueStatusEnum.ACTIVATED, 1L));
                                assertTrue(checkVenueStatusCount(ownerExpiredSubscriptionWithBalance,
                                                VenueStatusEnum.DELETED, 1L));
                                assertTrue(checkVenueStatusCount(ownerExpiredSubscriptionWithBalance,
                                                VenueStatusEnum.DEACTIVATED, 1L));
                                assertTrue(
                                                ownerExpiredSubscriptionWithBalance.getCurrentSubscriptionEndDate()
                                                                .isAfter(LocalDate.now()));
                                assertFalse(
                                                ownerExpiredSubscriptionWithBalance.getCurrentSubscriptionEndDate()
                                                                .isEqual(LocalDate.now()));

                                // TODO : GROUP 4 owner with an existing subscription with a future expiry date
                                assertTrue(checkVenueStatusCount(ownerValidSubscription, VenueStatusEnum.ACTIVATED,
                                                1L));
                                assertTrue(checkVenueStatusCount(ownerValidSubscription, VenueStatusEnum.DELETED, 1L));
                                assertTrue(checkVenueStatusCount(ownerValidSubscription, VenueStatusEnum.DEACTIVATED,
                                                1L));
                        }
                });

        }

        private boolean checkVenueStatusCount(Owner owner, VenueStatusEnum status, long l) {
                return owner.getVenues().stream().filter(v -> v.getVenueStatus().equals(status)).count() == l;
        }

}
