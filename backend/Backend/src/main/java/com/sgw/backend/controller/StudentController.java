package com.sgw.backend.controller;

import com.sgw.backend.config.AuthenticationRequest;
import com.sgw.backend.config.AuthenticationResponse;
import com.sgw.backend.entity.Admin;
import com.sgw.backend.entity.Student;
import com.sgw.backend.entity_venue.Venue;
import com.sgw.backend.exception.UsernameAlreadyExistsException;
import com.sgw.backend.service.AdminService;
import com.sgw.backend.service.DTOMapperService;
import com.sgw.backend.service.StudentService;
import com.sgw.backend.service.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    private final VenueService venueService;

    // needs to be final for annotations to use variables

    @GetMapping(value = "/admin/students")
    public List<DTOMapperService.StudentDTO> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return students.stream().map(DTOMapperService.getStudentMapper()).collect(Collectors.toList());
    }

    @PutMapping(value = "/admin/student/activation-status")
    public ResponseEntity changeActivationStatus(@Valid @RequestBody Student student) {
        if (studentService.changeActivationStatus(student)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping(value = "/student/{id}")
    public Student getStudentById(@PathVariable("id") Long id) {
        // need to catch exception here? maybe if user doesnt exist
        try {
            Student student = studentService.getStudentById(id);
            student.setWallet(null);
            student.setTickets(null);
            student.setBookings(null);
            student.setReviews(null);
            return student;
        } catch (Exception e) {
            // will make custom exception later
            System.out.println("User with id " + id + " does not exist");
            // return some error request to client
        }

        // placeholder
        return null;
    }

    @GetMapping(value = "/student/profile/{username}")
    public Student getStudentByUsername(@PathVariable("username") String username) {
        // need to catch exception here? maybe if user doesnt exist
        try {
            Student student = studentService.getStudentByUsername(username);
            student.getWallet().setGeneralUser(null);
            student.getWallet().setVouchers(null);
            student.getWallet().setIncomingTransactions(null);
            student.getWallet().setOutgoingTransactions(null);
            student.setTickets(null);
            student.setBookings(null);
            student.setReviews(null);
            return student;
        } catch (Exception e) {
            // will make custom exception later
            System.out.println("User with id " + username + " does not exist");
            // return some error request to client
        }

        // placeholder
        return null;
    }

    @PostMapping("/student/profile/{username}")
    public ResponseEntity<Void> updateStudentByUsername(@PathVariable("username") String username, @RequestBody Student student) {
        // need to catch exception here? maybe if user doesnt exist
        try {
            System.out.println(student.getName());
            student.setUsername(username);
            studentService.updateStudentDetails(student);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // will make custom exception later
            System.out.println("User with does not exist");
            // return some error request to client
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping(value = "/student/venues")
    public List<Map<String, ?>> getNearbyVenues(@RequestParam String latitude, @RequestParam String longitude) {
        try {
            double myLat = Double.parseDouble(latitude);
            double myLong = Double.parseDouble(longitude);
            System.out.println("OK - Lat: " + myLat + " Long: " + myLong);
            return venueService.getNearbyVenues(myLat, myLong);

        } catch (Exception e) {
            System.out.println("ERR - " + e.toString());
            return null;
        }

    }
}