package com.sgw.backend.service;

import com.sgw.backend.entity.Owner;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.entity_venue.VenueStatusEnum;
import com.sgw.backend.exception.UserDoesNotExistException;
import com.sgw.backend.exception.UserIsNotVerifiedException;
import com.sgw.backend.exception.UsernameAlreadyExistsException;
import com.sgw.backend.repository.OwnerRepository;
import com.sgw.backend.repository.VenueRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class OwnerService {

    private final OwnerRepository ownerRepo;
    private final JwtService jwtService;
    private final WalletService walletService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    private final VenueRepository venueRepository;




    public OwnerService(OwnerRepository ownerRepo, WalletService walletService, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager, VenueRepository venueRepository) {
        this.ownerRepo = ownerRepo;
        this.walletService = walletService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.venueRepository = venueRepository;
    }


    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void testSeparateTransaction() {
        ownerRepo.findAll().forEach(o -> {
            System.out.println(o.getUsername());
            System.out.println(o.getCurrentSubscriptionEndDate());
            o.getVenues().forEach(v -> {
                System.out.println(v.getVenueStatus());
            });
        });
    }
    public List<Owner> getAllOwners() {
        return ownerRepo.findAll();
    }

    // note that this addGeneralUser can add Owners, Students, etc.
    public Owner addOwner(Owner newOwner) throws Exception {

        Owner checkedOwner = getOwnerByUsername(newOwner.getUsername());

        if (checkedOwner == null) {
            walletService.addNewWalletToUser(newOwner);
            newOwner.setPassword(passwordEncoder.encode(newOwner.getPassword()));
            ownerRepo.save(newOwner);
            ownerRepo.flush();
            return newOwner;
        } else {
            UsernameAlreadyExistsException e = new UsernameAlreadyExistsException("This guy already exists");
            throw e;
        }
    }

    public Owner addOwnerWithVerification(Owner newOwner) throws UsernameAlreadyExistsException, UserIsNotVerifiedException {
        Owner checkedOwner = getOwnerByUsername(newOwner.getUsername());
        Owner emailCheck = ownerRepo.findByEmail(newOwner.getEmail());

        if (emailCheck != null) {
            UsernameAlreadyExistsException e = new UsernameAlreadyExistsException("Email already exists");
            throw e;
        }


        if (checkedOwner == null) {
            walletService.addNewWalletToUser(newOwner);
            newOwner.setPassword(passwordEncoder.encode(newOwner.getPassword()));

            //Setting code of length 6 e.g. 123456 and creation time
            // default student is disabled without verification
            String verificationCode = getRandomCode(6);
            newOwner.setVerificationCode(verificationCode);

            ZonedDateTime singaporeTime = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
            newOwner.setVerificationCodeCreateTime(singaporeTime.toLocalDateTime());

            ownerRepo.save(newOwner);
            ownerRepo.flush();
            return newOwner;
        } else if (checkedOwner.isEnabled()){
            UsernameAlreadyExistsException e = new UsernameAlreadyExistsException("User already exists");
            throw e;
        } else {
            throw new UserIsNotVerifiedException("Username is not verified");
        }

    }


    public boolean isCodeValid(Owner owner, String code) throws Exception{
        Owner checkedOwner = getOwnerByUsername(owner.getUsername());

        if (checkedOwner != null) {
            String storedCode = checkedOwner.getVerificationCode();
            if (!storedCode.equals(code)) {
                return false;
            }
// this code will check if the verificaioncodecreationtime is within 5min limit, if its 5min exact of more than 5min will return false
// if <5min will return true
            if (isWithin5Minutes(checkedOwner.getVerificationCodeCreateTime())) {
                //Update student
                checkedOwner.setVerified(true);
                ownerRepo.save(checkedOwner);
                return true;
            }
            return false;

        } else {
            UserDoesNotExistException e = new UserDoesNotExistException("This guy does not exists");
            throw e;
        }
    }

    public Owner getOwnerById(Long id) {
        return ownerRepo.getOwnerByUserId(id);
    }

    public Owner getOwnerByUsername(String username) {
        return ownerRepo.getOwnerByUsername(username);
    }

    public Boolean existsByEmail (String email) { return ownerRepo.existsByEmail(email);}

    public Owner updateOwner(Long ownerId, Owner owner) {
        Owner ownerManaged = ownerRepo.findById(ownerId).get();
        ownerManaged.setName(owner.getName());
        ownerManaged.setEmail(owner.getEmail());
        if (owner.getPassword().equalsIgnoreCase("")) {
            ownerRepo.save(ownerManaged);
            return ownerManaged;
        }
        ownerManaged.setPassword(passwordEncoder.encode(owner.getPassword()));
        ownerRepo.save(ownerManaged);
        return ownerManaged;
    }

    public String getRandomCode(int length) {
        String capitalCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "1234567890";
        char[] password = new char[length];
        String combination = capitalCaseLetters + lowerCaseLetters + numbers;
        Random r = new Random();
        for (int i = 0; i < length; i++) {
            password[i] = combination.charAt(r.nextInt(combination.length()));
        }

        return new String(password);
    }

    public boolean isWithin5Minutes(LocalDateTime verificationCodeCreateTime) {
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Singapore"));
        long minutesDifference = ChronoUnit.MINUTES.between(verificationCodeCreateTime, now);
        return minutesDifference < 5;
    }

    public Owner activateOwner(Long id) throws Exception {
        Owner temp = ownerRepo.getOwnerByUserId(id);
        if (temp == null) {
            throw new Exception("owner not found");
        }

        if (temp.isEnabled()) {
            temp.setEnabled(false);
            List<Venue> allOwnerVenue = venueRepository.findAllByOwnerUsername(temp.getUsername());
            List<Venue> ownersVenue = temp.getVenues();
            if (!allOwnerVenue.isEmpty()) {
                for(Venue v : allOwnerVenue) {
                    v.setVenueStatus(VenueStatusEnum.DEACTIVATED);
                    venueRepository.save(v);
                }
            }

            if (!ownersVenue.isEmpty()) {
                for(Venue v : ownersVenue) {
                    v.setVenueStatus(VenueStatusEnum.DEACTIVATED);
                }
                temp.setVenues(ownersVenue);
            }
        } else {
            temp.setEnabled(true);
        }



        ownerRepo.save(temp);
        return temp;
    }


    public Owner activateAutoRenewByOwnerId(Long id) throws Exception {
        Owner owner = ownerRepo.getOwnerByUserId(id);
        if (owner == null) {
            throw new Exception("No user founder");
        }
        if (owner.isAutoRenewSubscription()) {
            owner.setAutoRenewSubscription(false);
        } else {
            owner.setAutoRenewSubscription(true);
        }

        ownerRepo.save(owner);
        return owner;
    }

    public Owner refreshOwnerVerification(Owner owner) throws Exception{
        Owner checkedOwner = getOwnerByUsername(owner.getUsername());

        if (checkedOwner != null) {
            //Setting code of length 6 e.g. 123456 and creation time
            // default student is disabled without verification
            String verificationCode = getRandomCode(6);
            checkedOwner.setVerificationCode(verificationCode);

            ZonedDateTime singaporeTime = ZonedDateTime.now(ZoneId.of("Asia/Singapore"));
            checkedOwner.setVerificationCodeCreateTime(singaporeTime.toLocalDateTime());

            ownerRepo.save(owner);
            ownerRepo.flush();
            return owner;
        } else {
            throw new UserDoesNotExistException("User does not exist");
        }
    }



}
