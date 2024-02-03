package com.sgw.backend.controller;

import com.sgw.backend.config.AuthenticationRequest;
import com.sgw.backend.config.AuthenticationResponse;
import com.sgw.backend.config.ErrorJsonResponse;
import com.sgw.backend.entity.Admin;
import com.sgw.backend.entity.Owner;
import com.sgw.backend.entity.Student;
import com.sgw.backend.exception.UserDoesNotExistException;
import com.sgw.backend.exception.UserIsDisabledException;
import com.sgw.backend.exception.UserIsNotVerifiedException;
import com.sgw.backend.exception.UsernameAlreadyExistsException;
import com.sgw.backend.misc.SchedulerComponent;
import com.sgw.backend.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final StudentService studentService;
    private final OwnerService ownerService;
    private final AdminService adminService;
    private final JwtService jwtService;
    private final EmailSendingService emailSendingService;
    private final SchedulerComponent schedulerComponent;

    @GetMapping("/test")
    public void test() {
        schedulerComponent.subscriptionCleaningServiceAtNight();
    }

    @PostMapping("/student/register")
    public ResponseEntity<?> registerStudent(
            @RequestBody Student student) {
        try {
            Student studentAdd = studentService.addStudent(student);
            HashMap<String, Object> extraClaims = new HashMap<String, Object>();
            extraClaims.put("role", "Student");
            return ResponseEntity.ok(authenticationService.packToken(studentAdd, extraClaims));
        } catch (UsernameAlreadyExistsException e) {
            System.out.println("username alrd exists");
            // return some error request to client
        } catch (Exception e) {
            System.out.println("something happened");
            System.out.println(e.getMessage());
            throw new RuntimeException(e);
        }
        return ResponseEntity.internalServerError().body("Username already exists probably");
    }

    @PostMapping("/student/first-register")
    public ResponseEntity<?> firstRegisterStudent(
            @RequestBody Student student) {
        try {
            Student studentAdd = studentService.addStudentWithVerification(student);
            // Send email
            emailSendingService.sendEmail(student.getEmail(),
                    "Student Go Where Account Verification Code",
                    "Verification code: " + studentAdd.getVerificationCode());
            return ResponseEntity.ok().build();
        } catch (UsernameAlreadyExistsException e) {
            System.out.println("username alrd exists");
            return ResponseEntity.status(409).body(new ErrorJsonResponse("Username already exists"));
            // return some error request to client
        } catch (UserIsNotVerifiedException e) {
            return ResponseEntity.status(403).body(new ErrorJsonResponse("Username is not verified"));
        } catch (Exception e) {
            System.out.println("something happened");
            System.out.println(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/student/verify")
    public ResponseEntity<?> verifyStudent(
            @RequestBody HashMap<String, Object> json) {
        System.out.println("VERIFYING");
        System.out.println(json.toString());
        try {
            String verificationCode = (String) json.get("verificationCode");
            String username = (String) json.get("username");
            Student student = studentService.getStudentByUsername(username);
            if (studentService.isCodeValid(student, verificationCode)) {
                // Send JWT
                HashMap<String, Object> extraClaims = new HashMap<String, Object>();
                extraClaims.put("role", "Student");
                return ResponseEntity.ok(authenticationService.packToken(student, extraClaims));
            } else {
                ResponseEntity.ok(new ErrorJsonResponse("Invalid Verification Code"));
            }
        } catch (UsernameAlreadyExistsException e) {
            System.out.println("username alrd exists");
            // return some error request to client
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.ok(new ErrorJsonResponse(e.getMessage()));
        }
        return ResponseEntity.internalServerError().build();
    }

    @PostMapping("/student/resend-verification")
    public ResponseEntity<?> resendStudentVerificationToken(
            @RequestBody HashMap<String, Object> json) {
        try {
            String username = (String) json.get("username");
            Student student = studentService.getStudentByUsername(username);
            student = studentService.refreshStudentVerification(student);
            emailSendingService.sendEmail(student.getEmail(),
                    "Student Go Where Account Verification Code",
                    "Verification code: " + student.getVerificationCode());
            return ResponseEntity.ok().build();

        } catch (UsernameAlreadyExistsException e) {
            System.out.println("username alrd exists");
            // return some error request to client
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.ok(new ErrorJsonResponse(e.getMessage()));
        }
        return ResponseEntity.internalServerError().build();
    }

    @PostMapping("/student/authenticate")
    public ResponseEntity<?> authenticateStudent(
            @RequestBody AuthenticationRequest request) {
        try {
            AuthenticationResponse jwtToken = authenticationService.authenticateStudent(request);
            return ResponseEntity.ok(jwtToken);
        } catch (UserIsNotVerifiedException e) {
            Map<String, Object> response = new HashMap<>();
            System.out.println("WE ARE SENDING AN EMAIL");
            response.put("error", "User is not verified");
            response.put("email", studentService.getStudentByUsername(request.getUsername()).getEmail());
            return ResponseEntity.status(403).body(response);
        } catch (UserIsDisabledException e) {
            return ResponseEntity.status(404).body(new ErrorJsonResponse("User has been banned"));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(403).body(new ErrorJsonResponse("Failed to log in"));
        }
    }

    @PostMapping("/owner/first-register")
    public ResponseEntity<?> firstRegisterOwner(
            @RequestBody Owner owner) {
        try {
            Owner ownerAdd = ownerService.addOwnerWithVerification(owner);
            // Send email
            emailSendingService.sendEmail(owner.getEmail(),
                    "Student Go Where Account Verification Code",
                    "Verification code: " + ownerAdd.getVerificationCode());
            return ResponseEntity.ok().build();
        } catch (UsernameAlreadyExistsException e) {
            System.out.println("username/ email alrd exists");
            return ResponseEntity.status(409).body(new ErrorJsonResponse("Username already exists"));
            // return some error request to client
        } catch (UserIsNotVerifiedException e) {
            return ResponseEntity.status(403).body(new ErrorJsonResponse("Username is not verified"));
        } catch (Exception e) {
            System.out.println("something happened");
            System.out.println(e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/owner/verify")
    public ResponseEntity<?> verifyOwner(
            @RequestBody HashMap<String, Object> json) {
        System.out.println("VERIFYING");
        System.out.println(json.toString());
        try {
            String verificationCode = (String) json.get("verificationCode");
            String username = (String) json.get("username");
            Owner owner = ownerService.getOwnerByUsername(username);
            if (ownerService.isCodeValid(owner, verificationCode)) {
                // Send JWT
                HashMap<String, Object> extraClaims = new HashMap<String, Object>();
                extraClaims.put("role", "Owner");
                return ResponseEntity.ok(authenticationService.packToken(owner, extraClaims));
            } else {
                return ResponseEntity.status(403).body(new ErrorJsonResponse("Invalid Verification Code"));
            }
        } catch (UsernameAlreadyExistsException e) {
            System.out.println("username alrd exists");
            // return some error request to client
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.status(500).body(new ErrorJsonResponse(e.getMessage()));
        }
        return ResponseEntity.internalServerError().build();
    }

    @PostMapping("/owner/resend-verification")
    public ResponseEntity<?> resendOwnerVerificationToken(
            @RequestBody HashMap<String, Object> json) {
        try {
            String username = (String) json.get("username");
            Owner owner = ownerService.getOwnerByUsername(username);
            owner = ownerService.refreshOwnerVerification(owner);
            emailSendingService.sendEmail(owner.getEmail(),
                    "Student Go Where Account Verification Code",
                    "Verification code: " + owner.getVerificationCode());
            return ResponseEntity.ok().build();

        } catch (UsernameAlreadyExistsException e) {
            System.out.println("username alrd exists");
            // return some error request to client
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.ok(new ErrorJsonResponse(e.getMessage()));
        }
        return ResponseEntity.internalServerError().build();
    }

    @PostMapping("/owner/register")
    public ResponseEntity<?> registerOwner(
            @RequestBody Owner owner) {
        try {
            Owner ownerAdd = ownerService.addOwner(owner);
            HashMap<String, Object> extraClaims = new HashMap<String, Object>();
            extraClaims.put("role", "Owner");
            return ResponseEntity.ok(authenticationService.packToken(ownerAdd, extraClaims));
        } catch (UsernameAlreadyExistsException e) {
            System.out.println("username alrd exists");
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
            // return some error request to client
        } catch (Exception e) {
            System.out.println("something happened");
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().body("Username already exists probably");
        }
        // return ResponseEntity.internalServerError().body("Username already exists
        // probably");
    }

    @PostMapping("/owner/authenticate") // I included operator in this endpoint as well
    public ResponseEntity<?> authenticateOwner(
            @RequestBody AuthenticationRequest request) {
        try {
            AuthenticationResponse jwtToken = authenticationService.authenticateOwner(request);
            return ResponseEntity.ok(jwtToken);
        } catch (UserIsNotVerifiedException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "User is not verified");
            response.put("email", ownerService.getOwnerByUsername(request.getUsername()).getEmail());
            return ResponseEntity.status(403).body(response);
        } catch (UserIsDisabledException e) {
            return ResponseEntity.status(404).body(new ErrorJsonResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ErrorJsonResponse(e.getMessage()));
        }
    }

    // Consider moving this endpoint protected behind Admin role. Current public
    @PostMapping("/admin/register")
    public ResponseEntity<?> registerAdmin(
            @RequestBody Admin admin) {
        try {
            Admin adminAdd = adminService.addAdmin(admin);
            HashMap<String, Object> extraClaims = new HashMap<String, Object>();
            extraClaims.put("role", "Admin");
            return ResponseEntity.ok(authenticationService.packToken(adminAdd, extraClaims));
        } catch (UsernameAlreadyExistsException e) {
            System.out.println("username alrd exists");
            // return some error request to client
        } catch (Exception e) {
            System.out.println("something happened");
            System.out.println(e.getMessage());
            throw new RuntimeException(e);
        }
        return ResponseEntity.internalServerError().body("Username already exists probably");
    }

    @PostMapping("/admin/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticateAdmin(
            @RequestBody AuthenticationRequest request) {

        Admin thisAdmin = adminService.getAdminByUsername(request.getUsername());
        if (thisAdmin == null) {
            return ResponseEntity.notFound().build();
        }

        if (!thisAdmin.isEnabled()) {
            return ResponseEntity.notFound().build();
        }

        AuthenticationResponse jwtToken = authenticationService.authenticateAdmin(request);

        if (jwtToken != null) {
            return ResponseEntity.ok(jwtToken);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/owner/refresh")
    public ResponseEntity<AuthenticationResponse> refreshOwnerJWTController() {
        return jwtService.refreshOwnerJWT().map(auth -> ResponseEntity.ok(auth))
                .orElse(ResponseEntity.badRequest().build());
    }

    @GetMapping("/student/refresh")
    public ResponseEntity<AuthenticationResponse> refreshStudentJWTController() {
        return jwtService.refreshStudentJWT().map(auth -> ResponseEntity.ok(auth))
                .orElse(ResponseEntity.badRequest().build());
    }

    @GetMapping("/admin/refresh")
    public ResponseEntity<AuthenticationResponse> refreshAdminJWTController() {
        return jwtService.refreshAdminJWT().map(auth -> ResponseEntity.ok(auth))
                .orElse(ResponseEntity.badRequest().build());
    }

}
