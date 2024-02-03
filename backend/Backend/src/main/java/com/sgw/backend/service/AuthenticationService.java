package com.sgw.backend.service;

import com.sgw.backend.config.AuthenticationRequest;
import com.sgw.backend.config.AuthenticationResponse;
import com.sgw.backend.entity_venue.Operator;
import com.sgw.backend.exception.UserIsDisabledException;
import com.sgw.backend.exception.UserIsNotVerifiedException;
import com.sgw.backend.repository.AdminRepository;
import com.sgw.backend.repository.OperatorRepository;
import com.sgw.backend.repository.OwnerRepository;
import com.sgw.backend.repository.StudentRepository;
import io.jsonwebtoken.Jwt;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@AllArgsConstructor
@Service
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final OwnerRepository ownerRepository;
    private final OperatorRepository operatorRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationResponse authenticateAdmin(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            var user = adminRepository.getAdminByUsername(request.getUsername());
            HashMap<String, Object> extraClaims = new HashMap<String, Object>();
            extraClaims.put("role" , "Admin");
            var jwtToken = jwtService.generateToken(extraClaims, user);
            return AuthenticationResponse
                    .builder()
                    .token(jwtToken)
                    .build();

        } catch (Exception e) {
            System.out.println(e.toString());
            return null;
        }
    }

    public AuthenticationResponse authenticateStudent(AuthenticationRequest request) throws UserIsNotVerifiedException, UserIsDisabledException {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        var user = studentRepository.getStudentByUsername(request.getUsername());
        System.out.println("Gonna check now");

        if (!user.isEnabled()){
            System.out.println("User is disabled");
            throw new UserIsDisabledException("User is disabled");
        }

        if (user.isVerified()) {
            HashMap<String, Object> extraClaims = new HashMap<String, Object>();
            extraClaims.put("role" , "Student");
            System.out.println("VALID");
            var jwtToken = jwtService.generateToken(extraClaims, user);
            return AuthenticationResponse
                    .builder()
                    .token(jwtToken)
                    .build();
        } else {
            System.out.println("Not verified user");
            throw new UserIsNotVerifiedException("User is not verified");
        }

    }

    // ADDED OPERATOR INTO THE SAME METHOD AS WELL
    public AuthenticationResponse authenticateOwner(AuthenticationRequest request) throws UserIsNotVerifiedException, UserIsDisabledException {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        HashMap<String, Object> extraClaims = new HashMap<String, Object>();
        var user = ownerRepository.getOwnerByUsername(request.getUsername()); // This is Owner user
//            System.out.println("user: " + user);
        if (user == null) { // if can't find owner user, we try to find an operator
            Operator op = operatorRepository.getOperatorByUsername(request.getUsername());
            extraClaims.put("role" , "Operator");
            if (!op.isEnabled()) {
                throw new UserIsDisabledException("Operator has been disabled by venue owner");
            }
            var jwtToken = jwtService.generateToken(extraClaims, op);
            return AuthenticationResponse
                    .builder()
                    .token(jwtToken)
                    .build();

        } else { // else if Owner user IS found, we check if he is verified and enabled
            if (!user.isEnabled()) {
                throw new UserIsDisabledException("User has been banned");
            }
            if (!user.isVerified()) {
                throw new UserIsNotVerifiedException("User is not verified");
            }
            extraClaims.put("role" , "Owner");
        }
        var jwtToken = jwtService.generateToken(extraClaims, user);
        return AuthenticationResponse
                .builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse packToken(UserDetails userDetails, HashMap<String, Object> extraClaims) {
        var jwtToken = jwtService.generateToken(extraClaims, userDetails);
        return AuthenticationResponse
                .builder()
                .token(jwtToken)
                .build();
    }
}
