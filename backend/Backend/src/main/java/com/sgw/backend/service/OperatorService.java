package com.sgw.backend.service;

import com.sgw.backend.entity.Owner;
import com.sgw.backend.entity_venue.Operator;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.exception.UserDoesNotExistException;
import com.sgw.backend.exception.UserIsNotVerifiedException;
import com.sgw.backend.exception.UsernameAlreadyExistsException;
import com.sgw.backend.repository.OperatorRepository;
import com.sgw.backend.repository.OwnerRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;

@Service
@Transactional
public class OperatorService {

    private final OperatorRepository operatorRepository;


    public record OperatorWithVenueDTO(
            Long userId,
            String username,
            String email,
            Venue venue,
            boolean enabled
    ) {}

    public OperatorService(OwnerRepository ownerRepo, OperatorRepository operatorRepository, WalletService walletService, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.operatorRepository = operatorRepository;
    }


    public Operator getOperatorById(Long id) {
        return operatorRepository.getOperatorByUserId(id);
    }
    public Operator getOperatorByUsername(String username) { return operatorRepository.getOperatorByUsername(username); }

    public OperatorWithVenueDTO getOperatorByToken() {
        UserDetails operatorUserDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Operator realOperatorUserObject = getOperatorByUsername(operatorUserDetails.getUsername());

        if (realOperatorUserObject != null) {
            OperatorWithVenueDTO operatorWithVenueDTO = new OperatorWithVenueDTO(
                    realOperatorUserObject.getUserId(),
                    realOperatorUserObject.getUsername(),
                    realOperatorUserObject.getEmail(),
                    realOperatorUserObject.getVenue(),
                    realOperatorUserObject.isEnabled()
            );
            return operatorWithVenueDTO;
        }

        return null; // CODE WILL NEVER REACH HERE (hopefully); im too lazy to create a new exception for this

    }

}
